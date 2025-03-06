"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useRecorder } from "@/hooks/useRecorder";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VoiceUpload from "@/components/record/voice-upload";
import AudioUpload from "@/components/record/audio-upload";

export default function RecorderCard({
  onTranscriptionComplete,
}: {
  onTranscriptionComplete: (text: string) => void;
}) {
  const recorder = useRecorder(onTranscriptionComplete);
  const fileUpload = useFileUpload(onTranscriptionComplete);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  return (
    <>
      <Card className="w-full space-y-2 rounded-none border-none py-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-center font-semibold lg:text-lg">
            {isMobile ? "Upload Audio" : "Record or Upload"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-0.5">
          {recorder.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{recorder.error}</AlertDescription>
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

          <div className="flex flex-col gap-4 lg:flex-row">
            <VoiceUpload {...recorder} />
            <AudioUpload {...fileUpload} />
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground mx-auto max-w-[30rem] text-center text-xs lg:text-sm">
          <p>
            {isMobile ? (
              <>
                Upload an audio file from your device to transcribe it. Supported formats include
                MP3, WAV, OGG, M4A, and more.
              </>
            ) : recorder.isMediaRecorderSupported ? (
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
    </>
  );
}
