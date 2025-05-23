import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { transcribeAudio } from "@/lib/openai";
import { getMimeType, createAudioBlob } from "@/lib/helpers";

export function useRecorder(
  onTranscriptionComplete: (text: string) => void,
  onUsageLimitReached: () => void, // --- NEW PARAMETER ---
) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const isSupported =
      typeof MediaRecorder !== "undefined" &&
      typeof navigator.mediaDevices !== "undefined" &&
      typeof navigator.mediaDevices.getUserMedia === "function";

    setIsMediaRecorderSupported(isSupported);

    return () => {
      if (mediaRecorderRef.current && isRecording) {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.error("Error stopping recorder on unmount:", e);
        }
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      setError(null); // Clear previous errors
      audioChunksRef.current = [];
      if (!isMediaRecorderSupported) {
        setError("Your browser doesn't support audio recording.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onerror = () => {
        setError("An error occurred while recording.");
        stopRecording();
      };

      mediaRecorder.onstop = async () => {
        handleTranscription();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Error starting recording.");
        toast.error("Recording failed", { description: error.message });
      } else {
        setError("Error starting recording.");
        toast.error("Recording failed");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Recording stopped");
    }
  };

  const handleTranscription = useCallback(async () => {
    if (audioChunksRef.current.length === 0) {
      setError("No audio data was captured.");
      return;
    }

    const audioBlob = createAudioBlob(audioChunksRef.current);

    try {
      setIsProcessing(true);
      const transcription = await transcribeAudio(audioBlob);
      if (!transcription.trim()) throw new Error("No speech detected.");

      onTranscriptionComplete(transcription);
      toast.success("Transcription completed.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("429")) {
          const errorMessage =
            "You've reached your daily transcription limit. Please try again tomorrow.";
          setError(errorMessage);
          toast.error("Limit Reached", { description: errorMessage });
          onUsageLimitReached(); // --- CALL THE CALLBACK ---
        } else {
          setError(error.message || "Error transcribing audio.");
          toast.error("Transcription failed", { description: error.message });
        }
      } else {
        setError("An unknown error occurred during transcription.");
        toast.error("Transcription failed");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [onTranscriptionComplete, onUsageLimitReached]);

  return {
    isRecording,
    isProcessing,
    isMediaRecorderSupported,
    error,
    startRecording,
    stopRecording,
  };
}

export function useFileUpload(
  onTranscriptionComplete: (text: string) => void,
  onUsageLimitReached: () => void, // --- NEW PARAMETER ---
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    setIsDesktop(!isMobile);
  }, []);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null); // Clear previous errors
      if (!isDesktop) {
        toast.error("File upload is only supported on desktop.");
        return;
      }

      const file = event.target.files?.[0];
      if (!file) return;

      setIsProcessing(true);

      try {
        const transcription = await transcribeAudio(file);
        if (!transcription.trim()) throw new Error("No speech detected.");

        onTranscriptionComplete(transcription);
        toast.success("File processed successfully");
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message.includes("429")) {
            const errorMessage =
              "You've reached your daily transcription limit. Please try again tomorrow.";
            setError(errorMessage);
            toast.error("Limit Reached", { description: errorMessage });
            onUsageLimitReached(); // --- CALL THE CALLBACK ---
          } else {
            setError(error.message || "Processing failed");
            toast.error("Processing failed", { description: error.message });
          }
        } else {
          setError("An unknown error occurred during file processing.");
          toast.error("Processing failed");
        }
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [isDesktop, onTranscriptionComplete, onUsageLimitReached],
  );

  return { fileInputRef, isProcessing, handleFileUpload, isDesktop, error };
}
