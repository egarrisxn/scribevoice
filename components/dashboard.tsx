"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveTranscription } from "@/app/actions";
import { processTranscription } from "@/lib/openai";
import { type OutputFormat } from "@/components/main/format-selector";
import MainCard from "@/components/main/main-card";
import SavedTranscriptionsList from "@/components/saved/transcriptions-list";

export default function Dashbaord() {
  const [rawTranscription, setRawTranscription] = useState("");
  const [processedOutput, setProcessedOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("notes");

  const handleTranscriptionComplete = async (text: string) => {
    setRawTranscription(text);
    try {
      setIsProcessing(true);
      const processed = await processTranscription(text, outputFormat);
      setProcessedOutput(processed);
      await saveTranscription(text);
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

  return (
    <section className="w-full py-14 lg:py-28">
      <div className="container mx-auto min-h-screen w-full max-w-lg space-y-16 px-4 sm:max-w-screen-sm sm:space-y-24 md:max-w-screen-md">
        <MainCard
          onTranscriptionComplete={handleTranscriptionComplete}
          rawTranscription={rawTranscription}
          processedOutput={processedOutput}
          outputFormat={outputFormat}
          isProcessing={isProcessing}
          handleFormatChange={handleFormatChange}
        />
        <SavedTranscriptionsList />
      </div>
    </section>
  );
}
