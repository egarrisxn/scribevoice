// import { Download } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export interface TestTranscription {
//   id: string;
//   rawTranscription: string;
//   processedOutput: string;
//   outputFormat: string;
//   timestamp: number;
//   title: string;
// }

// interface DownloadButtonProps {
//   transcription: TestTranscription;
// }

// export function TestDownloadButton({ transcription }: DownloadButtonProps) {
//   const downloadTranscription = () => {
//     const blob = new Blob([transcription.title], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `ScribeVoice-raw-${new Date(transcription.timestamp).toISOString().slice(0, 10)}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Button variant="outline" size="sm" className="cursor-pointer" onClick={downloadTranscription}>
//       <Download className="mr-1 size-4" />
//       Download
//     </Button>
//   );
// }
