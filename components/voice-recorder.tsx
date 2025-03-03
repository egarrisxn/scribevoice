"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, AlertCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMediaRecorderSupported, setIsMediaRecorderSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect if user is on mobile
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);

    // Check if MediaRecorder API is supported
    const isMediaDevicesSupported = !!(
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    );
    const isMediaRecorderSupported = typeof MediaRecorder !== "undefined";
    setIsMediaRecorderSupported(isMediaDevicesSupported && isMediaRecorderSupported);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Ensure we stop any ongoing recording when component unmounts
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
    if (
      MediaRecorder &&
      MediaRecorder.isTypeSupported &&
      MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ) {
      return "audio/webm;codecs=opus";
    }
    return "audio/webm";
  };

  const startRecording = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];

      // Check if MediaRecorder is supported
      if (!isMediaRecorderSupported) {
        setError(
          "Your browser doesn't support audio recording. Please try uploading an audio file instead or use a different browser.",
        );
        return;
      }

      // Request audio permission with constraints that work better on mobile
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Get supported MIME type
      const mimeType = getMimeType();
      console.log("Using MIME type:", mimeType);

      // Create MediaRecorder with options
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
        if (event.error && event.error.name) {
          setError(`An error occurred while recording: ${event.error.name}`);
        } else {
          setError("An error occurred while recording. Please try again.");
        }
        stopRecording();
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          setError("No audio data was captured. Please try again.");
          setIsProcessing(false);
          return;
        }

        // Create audio blob with the correct MIME type
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

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      // Set a shorter timeslice for mobile devices to capture data more frequently
      const timeslice = isMobile ? 2000 : 10000; // 2 seconds for mobile

      // Resume AudioContext on user gesture
      const AudioContextConstructor = window.AudioContext;
      if (AudioContextConstructor) {
        const audioContext = new AudioContextConstructor();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
          console.log("AudioContext resumed on user gesture");
        }
      }

      mediaRecorder.start(timeslice);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

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

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast.info("Recording stopped. Processing your audio...");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      // Check file size
      if (file.size > 25 * 1024 * 1024) {
        // 25MB limit
        throw new Error("File is too large. Please upload an audio file smaller than 25MB.");
      }

      // Check file type
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
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-2">
        <div className="flex flex-col items-center space-y-4">
          <div className="mb-2 text-center font-semibold lg:text-lg">
            {isRecording ? (
              <div className="animate-pulse text-red-500">
                Recording: {formatTime(recordingTime)}
              </div>
            ) : isProcessing ? (
              <div className="text-blue-500">Processing audio...</div>
            ) : (
              <div>Ready to record</div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            {!isRecording && !isProcessing ? (
              <>
                {isMediaRecorderSupported && (
                  <Button
                    onClick={startRecording}
                    size="lg"
                    className="w-full bg-red-500 text-white hover:bg-red-600 sm:w-auto"
                  >
                    <Mic className="mr-1 size-4 lg:mr-0 lg:size-5" />
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
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Upload className="mr-1 size-4 lg:mr-0 lg:size-5" />
                    Upload Audio
                  </Button>
                </div>
              </>
            ) : isRecording ? (
              <Button
                onClick={stopRecording}
                size="lg"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <Square className="mr-2 h-5 w-5" />
                Stop Recording
              </Button>
            ) : (
              <Button disabled size="lg">
                <Loader2 className="mr-1 size-4 animate-spin lg:size-5" />
                Processing...
              </Button>
            )}
          </div>

          <p className="text-muted-foreground mt-4 max-w-[20rem] text-center text-xs lg:text-sm">
            {isMediaRecorderSupported ? (
              <>
                Click the button above to start recording. Speak clearly into your microphone. When
                finished, click stop to process your recording.
                {isMobile &&
                  " For best results on mobile, hold your device close to your mouth while speaking."}
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
        </div>
      </CardContent>
    </Card>
  );
}

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { toast } from "sonner";
// import { Mic, Square, Loader2 } from "lucide-react";
// import { transcribeAudio } from "@/lib/openai";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardFooter } from "./ui/card";

// export default function VoiceRecorder({
//   onTranscriptionComplete,
// }: {
//   onTranscriptionComplete: (text: string) => void;
// }) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       audioChunksRef.current = [];
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         const audioBlob = new Blob(audioChunksRef.current, {
//           type: "audio/webm",
//         });

//         try {
//           setIsProcessing(true);
//           const transcription = await transcribeAudio(audioBlob);
//           onTranscriptionComplete(transcription);
//         } catch (error) {
//           console.error("Transcription error:", error);
//           toast.error("Processing failed. There was an error transcribing your audio.");
//         } finally {
//           setIsProcessing(false);
//         }

//         stream.getTracks().forEach((track) => track.stop());
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//       setRecordingTime(0);

//       timerRef.current = setInterval(() => {
//         setRecordingTime((prev) => prev + 1);
//       }, 1000);

//       toast.success("Recording started. Speak clearly into your microphone.");
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       toast.error("Microphone access denied. Please allow microphone access.");
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);

//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }

//       toast.info("Recording stopped. Processing your audio...");
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <Card className="w-full">
//       <CardContent>
//         <div className="mb-2 text-center font-semibold lg:text-lg">
//           {isRecording ? (
//             <div className="animate-pulse text-red-500">Recording: {formatTime(recordingTime)}</div>
//           ) : isProcessing ? (
//             <div className="text-blue-500">Processing audio...</div>
//           ) : (
//             <div>Ready to record</div>
//           )}
//         </div>
//         <div className="flex justify-center space-x-4">
//           {!isRecording && !isProcessing ? (
//             <Button
//               onClick={startRecording}
//               size="lg"
//               variant="default"
//               className="bg-red-500 text-white hover:bg-red-600"
//             >
//               <Mic className="mr-1 size-4 lg:mr-0 lg:size-5" />
//               Start Recording
//             </Button>
//           ) : isRecording ? (
//             <Button
//               onClick={stopRecording}
//               size="lg"
//               variant="outline"
//               className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
//             >
//               <Square className="mr-1 size-4 lg:mr-0 lg:size-5" />
//               Stop Recording
//             </Button>
//           ) : (
//             <Button disabled size="lg">
//               <Loader2 className="mr-1 size-4 animate-spin lg:size-5" />
//               Processing...
//             </Button>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter className="text-muted-foreground mx-auto max-w-[18rem] text-center text-xs">
//         <p>
//           Press button to start. Speak clearly into your microphone. When finished, press stop to
//           process your recording.
//         </p>
//       </CardFooter>
//     </Card>
//   );
// }
