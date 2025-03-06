import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { transcribeAudio } from "@/lib/openai";
import { getMimeType, createAudioBlob } from "@/utils/helpers";

export function useRecorder(onTranscriptionComplete: (text: string) => void) {
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
    } catch (error: any) {
      setError("Error starting recording.");
      toast.error("Recording failed", { description: error.message });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info("Recording stopped");
    }
  };

  const handleTranscription = async () => {
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
    } catch (error: any) {
      setError(error.message || "Error transcribing audio.");
      toast.error("Transcription failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    isProcessing,
    isMediaRecorderSupported,
    error,
    startRecording,
    stopRecording,
  };
}
