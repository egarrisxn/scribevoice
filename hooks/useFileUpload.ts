import { useState, useRef } from "react";
import { toast } from "sonner";
import { transcribeAudio } from "@/lib/openai";

export function useFileUpload(onTranscriptionComplete: (text: string) => void) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const transcription = await transcribeAudio(file);
      if (!transcription.trim()) throw new Error("No speech detected.");

      onTranscriptionComplete(transcription);
      toast.success("File processed successfully");
    } catch (error: any) {
      toast.error("Processing failed", { description: error.message });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return { fileInputRef, isProcessing, handleFileUpload };
}
