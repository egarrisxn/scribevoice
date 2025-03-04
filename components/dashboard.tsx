"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { processTranscription } from "@/lib/openai";
import { saveTranscription } from "@/lib/storage";
import { FormatSelector, OutputFormat } from "@/components/format-selector";
import VoiceRecorder from "@/components/voice-recorder";
import TranscriptionOutput from "@/components/transcription-output";
import Loader from "@/components/loader";
import SavedTranscriptions from "@/components/saved-transcriptions";

export default function Dashbaord() {
  const [rawTranscription, setRawTranscription] = useState("");
  const [processedOutput, setProcessedOutput] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("notes");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    <section className="from-foreground/5 via-background to-background grid min-h-screen w-full place-items-center bg-gradient-to-b p-4 sm:p-6 lg:p-0">
      <div className="container mx-auto w-full max-w-lg space-y-16 px-4 py-8 sm:max-w-screen-sm sm:space-y-24 md:max-w-screen-md">
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        <FormatSelector onFormatChange={handleFormatChange} />
        {isProcessing ? (
          <Loader text={"Processing your transcription..."} />
        ) : rawTranscription ? (
          <TranscriptionOutput
            rawTranscription={rawTranscription}
            processedOutput={processedOutput}
            outputFormat={outputFormat}
            onSave={handleSaveTranscription}
            isSaved={isSaved}
          />
        ) : null}
        <SavedTranscriptions />
      </div>
    </section>
  );
}
