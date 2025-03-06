"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveTranscription } from "@/app/actions";
import { processTranscription } from "@/lib/openai";
import { Card } from "@/components/ui/card";
import RecordCard from "@/components/record/record-card";
import { type OutputFormat, FormatSelector } from "@/components/output/output-selector";
import TranscriptionOutput from "@/components/output/output-card";
import Loader from "@/components/shared/loader";
import SavedTranscriptions from "@/components/saved/saved-list";

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
    <section className="from-foreground/5 via-background to-background w-full bg-gradient-to-b py-20 lg:py-40">
      <div className="container mx-auto min-h-screen w-full max-w-lg space-y-16 px-4 sm:max-w-screen-sm sm:space-y-24 md:max-w-screen-md">
        <Card className="w-full space-y-8 py-10">
          <RecordCard onTranscriptionComplete={handleTranscriptionComplete} />
          <hr />
          <FormatSelector onFormatChange={handleFormatChange} />
        </Card>

        {isProcessing ? (
          <Loader text={"Processing your transcription..."} />
        ) : rawTranscription ? (
          <TranscriptionOutput
            rawTranscription={rawTranscription}
            processedOutput={processedOutput}
            outputFormat={outputFormat}
          />
        ) : null}
        <SavedTranscriptions />
      </div>
    </section>
  );
}
