"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveTranscription } from "@/app/actions";
import { processTranscription } from "@/lib/openai";
import FunCard from "@/components/fun-card";
import RecordAndUpload from "@/components/main/record-and-upload";
import { type OutputFormat, FormatSelector } from "@/components/main/format-selector";
import TranscriptionOutput from "@/components/main/transcription-output";
import Loader from "@/components/loader";
import TranscriptionsList from "@/components/saved/transcriptions-list";

export default function DashboardCard() {
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
    <div className="mx-auto w-full max-w-3xl space-y-2 px-4">
      <FunCard className="space-y-8 p-6">
        <hr className="border-muted" />
        <RecordAndUpload onTranscriptionComplete={handleTranscriptionComplete} />
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
