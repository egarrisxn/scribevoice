"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";
import { processTranscription } from "@/lib/openai";
import { saveTranscription } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    toast.info("Your transcription has been saved and can be accessed later.");
  };

  return (
    <main className="container mx-auto w-full max-w-3xl p-4 sm:p-6">
      <section className="grid w-full place-content-center place-items-center gap-4 py-12 text-center sm:py-28">
        <Badge>Use Your Voice!</Badge>

        <h1 className="text-[4rem] leading-none font-bold tracking-tight sm:text-[6rem]">
          ScribeVoice
        </h1>

        <p className="text-muted-foreground max-w-[26rem] text-lg sm:text-xl">
          Transform your voice into notes, transcripts, lists and more with the power of AI!
        </p>
      </section>

      <section className="mx-auto w-full max-w-[32rem] space-y-4 py-6 sm:max-w-[40rem] sm:py-12 md:max-w-[48rem]">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Record</h2>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </section>

      <section className="mx-auto w-full max-w-[32rem] space-y-4 py-6 sm:max-w-[40rem] sm:py-12 md:max-w-[48rem]">
        <h2 className="text-center text-3xl font-bold md:text-4xl">Format</h2>
        <OutputFormatSelector onFormatChange={handleFormatChange} />
      </section>

      <div className="mx-auto w-full max-w-[32rem] space-y-20 py-6 sm:max-w-[40rem] sm:space-y-24 sm:py-12 md:max-w-[48rem]">
        {isProcessing ? (
          <section className="flex items-center justify-center">
            <Loader2 className="text-primary size-8 animate-spin" />
            <span className="ml-2 text-lg">Processing your transcription...</span>
          </section>
        ) : rawTranscription ? (
          <section className="space-y-4">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">Results</h2>
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

      <section className="mx-auto w-full max-w-[32rem] space-y-6 py-12 text-center sm:pt-28 sm:pb-20">
        <h2 className="text-3xl font-bold md:text-4xl">Completely Open Source</h2>

        <p className="text-muted-foreground">
          The code for this project is completely open source and available on GitHub. Join the
          community and contribute to the future of web development!
        </p>

        <Button asChild>
          <a href="https://github.com/egarrisxn/scribevoice" target="_blank">
            View on GitHub
          </a>
        </Button>
      </section>
    </main>
  );
}
