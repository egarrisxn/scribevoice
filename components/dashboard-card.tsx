"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveTranscription } from "@/app/actions";
import { cn } from "@/lib/utils";
import { processTranscription } from "@/lib/openai";
import RecordAndUpload from "@/components/main/record-and-upload";
import { type OutputFormat, FormatSelector } from "@/components/main/format-selector";
import TranscriptionOutput from "@/components/main/transcription-output";
import SavedTranscriptionsList from "@/components/saved/transcriptions-list";
import Loader from "@/components/loader";

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

  const Border = ({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div
        {...rest}
        className={cn("absolute size-6 border-zinc-700 dark:border-zinc-200", className)}
      />
    );
  };

  return (
    <div className="container mx-auto min-h-screen w-full max-w-lg space-y-16 px-4 py-14 sm:max-w-screen-sm sm:space-y-24 md:max-w-screen-md lg:py-28">
      <div className="border-accent relative rounded-md border-2 bg-white dark:bg-zinc-900">
        <Border className="-top-0.5 -left-0.5 rounded-tl-md border-t-2 border-l-2" />
        <Border className="-top-0.5 -right-0.5 rounded-tr-md border-t-2 border-r-2" />
        <Border className="-bottom-0.5 -left-0.5 rounded-bl-md border-b-2 border-l-2" />
        <Border className="-right-0.5 -bottom-0.5 rounded-br-md border-r-2 border-b-2" />
        <div className="space-y-8 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
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
        </div>
      </div>
      <SavedTranscriptionsList />
    </div>
  );
}
