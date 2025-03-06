import { cn } from "@/lib/utils";
import RecordAndUpload from "@/components/main/record-and-upload";
import { type OutputFormat, FormatSelector } from "@/components/main/format-selector";
import TranscriptionOutput from "@/components/main/transcription-output";
import Loader from "@/components/shared/loader";

interface MainCardAreaProps {
  onTranscriptionComplete: (text: string) => void;
  rawTranscription: string;
  processedOutput: string;
  outputFormat: OutputFormat;
  isProcessing: boolean;
  handleFormatChange: (format: OutputFormat) => void;
}

export default function MainCard({
  onTranscriptionComplete,
  rawTranscription,
  processedOutput,
  outputFormat,
  isProcessing,
  handleFormatChange,
}: MainCardAreaProps) {
  const Border = ({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div
        {...rest}
        className={cn("absolute size-6 border-zinc-700 dark:border-zinc-200", className)}
      />
    );
  };
  return (
    <div className="border-accent relative rounded-md border-2 bg-white dark:bg-zinc-900">
      <Border className="-top-0.5 -left-0.5 rounded-tl-md border-t-2 border-l-2" />
      <Border className="-top-0.5 -right-0.5 rounded-tr-md border-t-2 border-r-2" />
      <Border className="-bottom-0.5 -left-0.5 rounded-bl-md border-b-2 border-l-2" />
      <Border className="-right-0.5 -bottom-0.5 rounded-br-md border-r-2 border-b-2" />
      <div className="space-y-8 p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
        <hr className="border-muted" />
        <RecordAndUpload onTranscriptionComplete={onTranscriptionComplete} />
        <hr className="border-muted" />
        <FormatSelector onFormatChange={handleFormatChange} />
        <hr className="border-muted" />
        {isProcessing ? (
          <Loader text={"Processing your transcription..."} />
        ) : rawTranscription ? (
          <TranscriptionOutput
            rawTranscription={rawTranscription}
            processedOutput={processedOutput}
            outputFormat={outputFormat}
          />
        ) : null}
      </div>
    </div>
  );
}
