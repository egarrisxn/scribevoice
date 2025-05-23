"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { saveTranscription } from "@/app/actions";
import { processTranscription } from "@/lib/openai";
import FunCard from "@/components/fun-card";
import RecordAndUpload from "@/components/main/record-and-upload";
import { type OutputFormat, FormatSelector } from "@/components/main/format-selector";
import TranscriptionOutput from "@/components/main/transcription-output";
import Loader from "@/components/loader";
import TranscriptionsList from "@/components/saved/transcriptions-list";
import { MAX_DAILY_TRANSCRIBE_USES, MAX_DAILY_PROCESS_USES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function DashboardCard() {
  const [rawTranscription, setRawTranscription] = useState("");
  const [processedOutput, setProcessedOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("notes");

  // --- NEW STATE FOR USAGE ---
  const [transcribeRemaining, setTranscribeRemaining] = useState<number | null>(null);
  const [processRemaining, setProcessRemaining] = useState<number | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  // --- EFFECT TO GET USER ID AND FETCH USAGE ---
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getSession();

    // Listen for auth changes to update user ID and trigger usage fetch
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setUserId(session?.user?.id || null);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setTranscribeRemaining(null); // Clear usage on sign out
        setProcessRemaining(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchDailyUsage = useCallback(async () => {
    if (!userId) {
      setTranscribeRemaining(null);
      setProcessRemaining(null);
      setUsageError(null);
      return;
    } // Don't fetch if no user is logged in

    try {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setTranscribeRemaining(data.transcribeRemaining);
        setProcessRemaining(data.processRemaining);
        setUsageError(null);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error fetching usage" }));
        setUsageError(errorData.error || "Failed to load usage data.");
        toast.error("Failed to load usage", { description: errorData.error });
      }
    } catch (err) {
      console.error("Error fetching daily usage:", err);
      setUsageError("Error connecting to usage service.");
      toast.error("Network error", { description: "Could not connect to usage service." });
    }
  }, [userId]); // Re-run when userId changes

  // Fetch usage on component mount and when userId changes
  useEffect(() => {
    fetchDailyUsage();
  }, [fetchDailyUsage]);

  const handleTranscriptionComplete = async (text: string) => {
    setRawTranscription(text);
    try {
      setIsProcessing(true);
      const processed = await processTranscription(text, outputFormat);
      setProcessedOutput(processed);
      await saveTranscription(text);
      fetchDailyUsage(); // Fetch updated usage after successful processing
    } catch (error: unknown) {
      console.error("Error processing transcription:", error);

      if (error instanceof Error) {
        if (error.message.includes("429")) {
          const message =
            "You've reached your daily content processing limit. Please try again tomorrow.";
          toast.error("Limit Reached", { description: message });
          setUsageError(message);
        } else {
          toast.error("Processing failed", {
            description:
              error.message ||
              "There was an error processing your transcription. Please try again.",
          });
        }
      } else {
        toast.error("Processing failed", {
          description: "An unexpected error occurred during processing.",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormatChange = async (format: OutputFormat) => {
    setOutputFormat(format);
    if (rawTranscription) {
      try {
        setIsProcessing(true);
        const processed = await processTranscription(rawTranscription, format);
        setProcessedOutput(processed);
        fetchDailyUsage(); // Fetch updated usage after successful re-processing
      } catch (error: unknown) {
        console.error("Error processing transcription:", error);
        if (error instanceof Error) {
          if (error.message.includes("429")) {
            const message =
              "You've reached your daily content processing limit. Please try again tomorrow.";
            toast.error("Limit Reached", { description: message });
            setUsageError(message);
          } else {
            toast.error("Processing failed", {
              description:
                error.message ||
                "There was an error processing your transcription. Please try again.",
            });
          }
        } else {
          toast.error("Processing failed", {
            description: "An unexpected error occurred during processing.",
          });
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-2 px-4">
      <FunCard className="space-y-8 p-6">
        {(transcribeRemaining !== null || processRemaining !== null) && (
          <div className="text-center text-sm text-gray-600">
            {transcribeRemaining !== null && (
              <p>
                Transcriptions left: {transcribeRemaining} / {MAX_DAILY_TRANSCRIBE_USES}
              </p>
            )}
            {processRemaining !== null && (
              <p>
                Processed content left: {processRemaining} / {MAX_DAILY_PROCESS_USES}
              </p>
            )}
          </div>
        )}
        {usageError && (
          <div className="mb-4 text-center text-sm text-red-500">
            <p>{usageError}</p>
          </div>
        )}

        <hr className="border-muted" />
        <RecordAndUpload
          onTranscriptionComplete={handleTranscriptionComplete}
          onUsageLimitReached={fetchDailyUsage} // Pass this down so RecordAndUpload can trigger a refetch
        />
        <hr className="border-muted" />
        <FormatSelector onFormatChange={handleFormatChange} />
        <hr className="border-muted" />
        {isProcessing ? (
          <Loader text={"Processing your transcription..."} />
        ) : rawTranscription ? (
          <TranscriptionOutput
            rawTranscription={rawTranscription}
            processedOutput={processedOutput}
            outputFormat={outputFormat}
          />
        ) : null}
      </FunCard>
      <TranscriptionsList />
    </div>
  );
}
