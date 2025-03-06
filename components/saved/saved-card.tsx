import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteTranscription } from "@/components/saved/delete-btn";
import { CopyTranscription } from "@/components/saved/copy-btn";
import { DownloadTranscription } from "@/components/saved/download-btn";

interface Transcription {
  id: string;
  user_id: string;
  transcription_text: string;
  created_at: string;
}

interface TranscriptionCardProps {
  transcription: Transcription;
}

export function TranscriptionCard({ transcription }: TranscriptionCardProps) {
  return (
    <Card className="from-background via-background to-accent/40 overflow-hidden rounded bg-gradient-to-t">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              {transcription.transcription_text.substring(0, 20) + "..."}
            </CardTitle>
            <CardDescription>
              {formatDistanceToNow(new Date(transcription.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <DeleteTranscription id={transcription.id} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="bg-muted/50 max-h-[150px] overflow-y-auto rounded-md p-3 text-sm whitespace-pre-wrap">
          {transcription.transcription_text}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2 pb-3">
        <CopyTranscription text={transcription.transcription_text} id={transcription.id} />
        <DownloadTranscription transcription={transcription} />
      </CardFooter>
    </Card>
  );
}
