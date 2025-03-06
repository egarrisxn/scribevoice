import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transcription {
  id: string;
  user_id: string;
  transcription_text: string;
  created_at: string;
}

interface DownloadButtonProps {
  transcription: Transcription;
}

export function DownloadTranscription({ transcription }: DownloadButtonProps) {
  const downloadTranscription = () => {
    const blob = new Blob([transcription.transcription_text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ScribeVoice-raw-${new Date(transcription.created_at).toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" className="cursor-pointer" onClick={downloadTranscription}>
      <Download className="mr-1 size-4" />
      Download
    </Button>
  );
}
