import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteButton } from "@/components/saved/delete-btn";
import { CopyButton } from "@/components/saved/copy-btn";
import { DownloadButton } from "@/components/saved/download-btn";
import type { Transcription } from "@/lib/types";

interface TranscriptionCardProps {
  transcription: Transcription;
  setTranscriptions: React.Dispatch<React.SetStateAction<Transcription[]>>;
}

export function TranscriptionCard({ transcription, setTranscriptions }: TranscriptionCardProps) {
  return (
    <Card className="from-background via-background to-accent/40 overflow-hidden rounded bg-gradient-to-t shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              <h1>{transcription.transcription_text.substring(0, 20) + "..."}</h1>
            </CardTitle>
            <CardDescription className="mt-0.5 text-sm">
              <h2>
                {formatDistanceToNow(new Date(transcription.created_at), { addSuffix: true })}
              </h2>
            </CardDescription>
          </div>
          <DeleteButton id={transcription.id} setTranscriptions={setTranscriptions} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-muted/50 max-h-[150px] overflow-y-auto rounded-md p-3 text-sm whitespace-pre-wrap">
          <p>{transcription.transcription_text}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center sm:justify-end sm:pt-1 sm:pb-3">
        <CopyButton text={transcription.transcription_text} id={transcription.id} />
        <DownloadButton transcription={transcription} />
      </CardFooter>
    </Card>
  );
}

// import { formatDistanceToNow } from "date-fns";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { DeleteButton } from "@/components/saved/delete-btn";
// import { CopyButton } from "@/components/saved/copy-btn";
// import { DownloadButton } from "@/components/saved/download-btn";

// interface Transcription {
//   id: string;
//   user_id: string;
//   transcription_text: string;
//   created_at: string;
// }

// interface TranscriptionCardProps {
//   transcription: Transcription;
// }

// export function TranscriptionCard({ transcription }: TranscriptionCardProps) {
//   return (
//     <Card className="from-background via-background to-accent/40 overflow-hidden rounded bg-gradient-to-t shadow">
//       <CardHeader className="pb-2">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-base font-semibold">
//               <h1>{transcription.transcription_text.substring(0, 20) + "..."}</h1>
//             </CardTitle>
//             <CardDescription className="mt-0.5 text-sm">
//               <h2>
//                 {formatDistanceToNow(new Date(transcription.created_at), { addSuffix: true })}
//               </h2>
//             </CardDescription>
//           </div>
//           <DeleteButton id={transcription.id} />
//         </div>
//       </CardHeader>
//       <CardContent className="pb-2">
//         <div className="bg-muted/50 max-h-[150px] overflow-y-auto rounded-md p-3 text-sm whitespace-pre-wrap">
//           <p>{transcription.transcription_text}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-center sm:justify-end sm:pt-1 sm:pb-3">
//         <CopyButton text={transcription.transcription_text} id={transcription.id} />
//         <DownloadButton transcription={transcription} />
//       </CardFooter>
//     </Card>
//   );
// }
