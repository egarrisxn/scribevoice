"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { transcribeAudio } from "@/lib/openai";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

export default function VoiceRecorder({
  onTranscriptionComplete,
}: {
  onTranscriptionComplete: (text: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);

    const isMediaDevicesSupported = !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    );
    const isMediaRecorderSupported = typeof MediaRecorder !== "undefined";
    setIsMediaRecorderSupported(
      isMediaDevicesSupported && isMediaRecorderSupported && !isMobileDevice,
    );
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

  const getMimeType = () => {
    const types = [
      "audio/webm",
      "audio/mp4",
      "audio/ogg",
      "audio/wav",
      "audio/webm;codecs=opus",
      "audio/webm;codecs=pcm",
      "audio/webm;codecs=vorbis",
    ];

    for (const type of types) {
      if (MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "audio/webm";
  };

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      if (!isMediaRecorderSupported) {
        setError(
          "Your browser doesn't support audio recording. Please try uploading an audio file instead or use a different browser.",
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeType = getMimeType();

      const options = { mimeType };
      let mediaRecorder;

      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        console.warn(
          "Failed to create MediaRecorder with specified options, trying without options",
          e,
        );
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("An error occurred while recording. Please try again.");
        stopRecording();
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          setError("No audio data was captured. Please try again.");
          setIsProcessing(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size < 100) {
          setError("The recorded audio is too short or empty. Please try again and speak clearly.");
          setIsProcessing(false);
          return;
        }

        try {
          setIsProcessing(true);
          const transcription = await transcribeAudio(audioBlob);

          if (!transcription || transcription.trim() === "") {
            setError("No speech was detected. Please try again and speak clearly.");
            setIsProcessing(false);
            return;
          }

          onTranscriptionComplete(transcription);
        } catch (error: any) {
          console.error("Transcription error:", error);
          setError(
            error.message || "There was an error transcribing your audio. Please try again.",
          );
          toast.error("Microphone access denied. Please allow microphone access.");
        } finally {
          setIsProcessing(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      const timeslice = isMobile ? 1000 : 10000;

      mediaRecorder.start(timeslice);
      setIsRecording(true);

      toast.success("Recording started. Speak clearly into your microphone.");
    } catch (error: any) {
      console.error("Error starting recording:", error);

      let errorMessage = "Please allow microphone access to use this feature.";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage =
          "Microphone permission was denied. Please allow access in your browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No microphone was found on your device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage =
          "Your microphone is busy or unavailable. Please close other apps that might be using it.";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "The requested microphone settings are not supported by your device.";
      } else if (
        error.name === "TypeError" ||
        error.message?.includes("getUserMedia is not a function")
      ) {
        errorMessage =
          "Your browser doesn't support audio recording. Please try uploading an audio file instead or use a different browser.";
        setIsMediaRecorderSupported(false);
      }

      setError(errorMessage);
      console.log(errorMessage);
      toast.error("Recording failed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error("Error stopping recording:", e);
        setError(
          "There was an error stopping the recording. Please refresh the page and try again.",
        );
      }

      setIsRecording(false);

      toast.info("Recording stopped. Processing your audio...");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      if (file.size > 25 * 1024 * 1024) {
        throw new Error("File is too large. Please upload an audio file smaller than 25MB.");
      }

      const validTypes = [
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
        "audio/mp4",
        "audio/webm",
        "audio/x-m4a",
        "audio/aac",
      ];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|webm|aac)$/i)) {
        throw new Error(
          "Invalid file type. Please upload an audio file (MP3, WAV, OGG, M4A, etc.)",
        );
      }

      const transcription = await transcribeAudio(file);

      if (!transcription || transcription.trim() === "") {
        throw new Error("No speech was detected in the audio file. Please try a different file.");
      }

      onTranscriptionComplete(transcription);

      toast.info("File processed successfully.");
    } catch (error: any) {
      console.error("File upload error:", error);
      setError(error.message || "There was an error processing your audio file. Please try again.");
      toast.error(
        "Processing failed. There was an error processing your audio file. Please try again.",
      );
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section>
      <h2 className="pb-4 text-center text-3xl font-bold md:text-4xl">
        {isMobile ? "Upload Audio" : "Record or Upload"}
      </h2>
      <Card className="from-background via-background to-accent/40 w-full space-y-2 bg-gradient-to-t py-10">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="mb-2 text-center font-semibold lg:text-lg">
              {isRecording ? (
                <p className="animate-pulse text-red-500">Recording in progress</p>
              ) : isProcessing ? (
                <p className="text-blue-500">Processing audio...</p>
              ) : (
                <p> {isMobile ? "" : "Ready to record"}</p>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isMobile && (
              <Alert className="mb-4">
                <AlertCircle className="size-4" />
                <AlertTitle>Mobile Device Detected</AlertTitle>
                <AlertDescription>
                  Voice recording is only available on desktop browsers. Please use the file upload
                  option instead.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              {!isRecording && !isProcessing ? (
                <>
                  {isMediaRecorderSupported && !isMobile && (
                    <Button
                      onClick={startRecording}
                      size="lg"
                      className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-600/90 sm:w-auto"
                    >
                      <Mic className="size-4.5" />
                      Start Recording
                    </Button>
                  )}

                  <div className="flex w-full items-center sm:w-auto">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="audio-upload"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant={isMobile ? "default" : "outline"}
                      size="lg"
                      className="w-full cursor-pointer sm:w-auto"
                    >
                      <Upload className="mr-1 size-4" />
                      Upload Audio
                    </Button>
                  </div>
                </>
              ) : isRecording ? (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="outline"
                  className="text-destructive cursor-pointer"
                >
                  <Square className="mr-1 size-4" />
                  Stop Recording
                </Button>
              ) : (
                <Button disabled size="lg">
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Processing...
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground mx-auto max-w-[30rem] text-center text-xs lg:text-sm">
          <p>
            {isMobile ? (
              <>
                Upload an audio file from your device to transcribe it. Supported formats include
                MP3, WAV, OGG, M4A, and more.
              </>
            ) : isMediaRecorderSupported ? (
              <>
                Click the record button to start recording. Speak clearly into your microphone. When
                finished, click stop to process your recording.
                <br />
                <br />
                Alternatively, you can upload an existing audio file.
              </>
            ) : (
              <>
                Your browser doesn&apos;t support direct audio recording. Please upload an audio
                file instead or try using a different browser like Chrome or Firefox.
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
