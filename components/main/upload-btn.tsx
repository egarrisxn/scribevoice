import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AudioProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadButton({
  fileInputRef,
  handleFileUpload,
}: AudioProps) {
  return (
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
        className="w-full cursor-pointer sm:w-auto"
      >
        <Upload className="mr-1 size-4" /> Upload Audio
      </Button>
    </div>
  );
}
