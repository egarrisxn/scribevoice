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

export default function Home() {
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
    toast("Your transcription has been saved and can be accessed later.");
  };

  return (
    <div className="my-24 w-full px-4 md:mt-20 md:mb-28">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <section className="mx-auto space-y-3 text-center">
          <h1 className="text-6xl font-bold tracking-tight">ScribeVoice</h1>
          <p className="text-muted-foreground max-w-[26rem] text-xl">
            Transform your voice into notes, transcripts, lists and more with AI
          </p>
        </section>

        <section className="mx-auto w-full max-w-[26rem]">
          <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        </section>

        <section className="mx-auto my-8 w-full max-w-[20rem]">
          <OutputFormatSelector onFormatChange={handleFormatChange} />
        </section>
        {isProcessing ? (
          <section className="flex items-center justify-center py-12">
            <Loader2 className="text-primary size-8 animate-spin" />
            <span className="ml-2 text-lg">Processing your transcription...</span>
          </section>
        ) : rawTranscription ? (
          <section className="mx-auto grid w-full max-w-[32rem] gap-4">
            <TranscriptionOutput
              rawTranscription={rawTranscription}
              processedOutput={processedOutput}
              outputFormat={outputFormat}
              onSave={handleSaveTranscription}
              isSaved={isSaved}
            />
          </section>
        ) : null}
        <section className="mx-auto grid w-full max-w-[36rem] gap-4">
          <SavedTranscriptions />
        </section>
      </div>
    </div>
  );
}
