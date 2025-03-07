import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceProps {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export default function RecordButton({
  isRecording,
  isProcessing,
  startRecording,
  stopRecording,
}: VoiceProps) {
  if (isProcessing)
    return (
      <Button disabled size="lg">
        <Loader2 className="mr-1 size-4 animate-spin" /> <span>Processing...</span>
      </Button>
    );
  return isRecording ? (
    <div className="flex flex-col items-center">
      <Button
        onClick={stopRecording}
        size="lg"
        variant="outline"
        className="text-destructive cursor-pointer"
      >
        <Square className="mr-1 size-4" /> <span>Stop Recording</span>
      </Button>
    </div>
  ) : (
    <Button
      onClick={startRecording}
      size="lg"
      className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-600/90 sm:w-auto"
    >
      <Mic className="size-4.5" /> <span>Start Recording</span>
    </Button>
  );
}
