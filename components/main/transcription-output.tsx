"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TranscriptionOutput({
  rawTranscription,
  processedOutput,
  outputFormat,
}: {
  rawTranscription: string;
  processedOutput: string;
  outputFormat: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = (text: string, type: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ScribeVoice-${type}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTitle = (format: string) => {
    return format.charAt(0).toUpperCase() + format.slice(1);
  };

  return (
    <div className="w-full space-y-2 px-4 py-2">
      <h1 className="text-center font-semibold lg:text-lg">Transcription Results</h1>
      <div className="mt-4">
        <Tabs defaultValue="processed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="processed" className="cursor-pointer">
              {formatTitle(outputFormat)}
            </TabsTrigger>
            <TabsTrigger value="raw" className="cursor-pointer">
              Raw Transcription
            </TabsTrigger>
          </TabsList>
          <TabsContent value="processed" className="mt-4">
            <div className="rounded-md bg-muted/50 p-4 whitespace-pre-wrap">
              {processedOutput || "No processed output available."}
            </div>
            <div className="mt-4 flex justify-center space-x-2 sm:justify-end lg:mt-6">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => copyToClipboard(processedOutput)}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 size-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 size-4" /> Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => downloadOutput(processedOutput, outputFormat)}
              >
                <Download className="mr-1 size-4" /> Download
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="raw" className="mt-4">
            <div className="rounded-md bg-muted/50 p-4 whitespace-pre-wrap">
              {rawTranscription || "No raw transcription available."}
            </div>
            <div className="mt-4 flex justify-center space-x-2 sm:justify-end lg:mt-6">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => copyToClipboard(rawTranscription)}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 size-4" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 size-4" /> Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => downloadOutput(rawTranscription, "raw")}
              >
                <Download className="mr-1 size-4" /> Download
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <p className="mx-auto mt-4 text-center text-xs text-muted-foreground md:text-sm">
        You can switch between the processed output and raw transcription using the tabs above.
      </p>
    </div>
  );
}
