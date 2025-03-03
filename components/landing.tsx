"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { processTranscription } from "@/lib/openai";
import { saveTranscription } from "@/lib/storage";
import { OutputFormatSelector, OutputFormat } from "@/components/output-format-selector";
import VoiceRecorder from "@/components/voice-recorder";
import TranscriptionOutput from "@/components/transcription-output";
import SavedTranscriptions from "@/components/saved-transcriptions";

export default function Landing() {
  const [rawTranscription, setRawTranscription] = useState("");
  const [processedOutput, setProcessedOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("notes");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (rawTranscription) {
      setIsSaved(false);
    }
  }, [rawTranscription]);

  const handleTranscriptionComplete = async (text: string) => {
    setRawTranscription(text);

    try {
      setIsProcessing(true);
      const processed = await processTranscription(text, outputFormat);
      setProcessedOutput(processed);
    } catch (error) {
      console.error("Error processing transcription:", error);
      toast.error("Processing failed", {
        description: "There was an error processing your transcription. Please try again.",
      });
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
        setIsSaved(false);
      } catch (error) {
        console.error("Error processing transcription:", error);
        toast.error("Processing failed", {
          description: "There was an error processing your transcription. Please try again.",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveTranscription = () => {
    if (!rawTranscription || !processedOutput) return;

    const words = rawTranscription.split(" ");
    const title = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");

    saveTranscription({
      id: uuidv4(),
      rawTranscription,
      processedOutput,
      outputFormat,
      timestamp: Date.now(),
      title,
    });

    setIsSaved(true);
    toast.info("Your transcription has been saved and can be accessed later.");
  };

  return (
    <div className="container mx-auto w-full max-w-lg space-y-16 px-4 py-8 sm:max-w-screen-sm sm:space-y-24 md:max-w-screen-md">
      <section>
        <h2 className="pb-4 text-center text-3xl font-bold md:text-4xl">
          {isMobile ? "Upload Audio" : "Record or Upload"}
        </h2>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </section>

      <section>
        <h2 className="pb-4 text-center text-3xl font-bold md:text-4xl">Select Your Format</h2>
        <OutputFormatSelector onFormatChange={handleFormatChange} />
      </section>

      {isProcessing ? (
        <section className="flex items-center justify-center">
          <Loader2 className="text-primary size-8 animate-spin" />
          <span className="ml-2 text-lg">Processing your transcription...</span>
        </section>
      ) : rawTranscription ? (
        <section>
          <h2 className="pb-4 text-center text-3xl font-bold sm:text-4xl">See the Results</h2>
          <TranscriptionOutput
            rawTranscription={rawTranscription}
            processedOutput={processedOutput}
            outputFormat={outputFormat}
            onSave={handleSaveTranscription}
            isSaved={isSaved}
          />
        </section>
      ) : null}

      <section>
        <SavedTranscriptions />
      </section>
    </div>
  );
}
