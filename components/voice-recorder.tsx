"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Mic, Square, Loader2 } from "lucide-react";
import { transcribeAudio } from "@/lib/openai";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function VoiceRecorder({
  onTranscriptionComplete,
}: {
  onTranscriptionComplete: (text: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        try {
          setIsProcessing(true);
          const transcription = await transcribeAudio(audioBlob);
          onTranscriptionComplete(transcription);
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error("Processing failed. There was an error transcribing your audio.");
        } finally {
          setIsProcessing(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast.success("Recording started. Speak clearly into your microphone.");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Microphone access denied. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast.info("Recording stopped. Processing your audio...");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="mb-2 text-center font-semibold lg:text-lg">
          {isRecording ? (
            <div className="animate-pulse text-red-500">Recording: {formatTime(recordingTime)}</div>
          ) : isProcessing ? (
            <div className="text-blue-500">Processing audio...</div>
          ) : (
            <div>Ready to record</div>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          {!isRecording && !isProcessing ? (
            <Button
              onClick={startRecording}
              size="lg"
              variant="default"
              className="bg-red-500 text-white hover:bg-red-600"
            >
              <Mic className="mr-1 size-4 lg:mr-0 lg:size-5" />
              Start Recording
            </Button>
          ) : isRecording ? (
            <Button
              onClick={stopRecording}
              size="lg"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Square className="mr-1 size-4 lg:mr-0 lg:size-5" />
              Stop Recording
            </Button>
          ) : (
            <Button disabled size="lg">
              <Loader2 className="mr-1 size-4 animate-spin lg:size-5" />
              Processing...
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground mx-auto max-w-[18rem] text-center text-xs">
        <p>
          Press button to start. Speak clearly into your microphone. When finished, press stop to
          process your recording.
        </p>
      </CardFooter>
    </Card>
  );
}
