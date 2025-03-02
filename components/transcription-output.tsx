"use client";

import { useState } from "react";
import { Copy, Check, Download, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function TranscriptionOutput({
  rawTranscription,
  processedOutput,
  outputFormat,
  onSave,
  isSaved,
}: {
  rawTranscription: string;
  processedOutput: string;
  outputFormat: string;
  onSave: () => void;
  isSaved: boolean;
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
    a.download = `voicescribe-${type}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTitle = (format: string) => {
    return format.charAt(0).toUpperCase() + format.slice(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transcription Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="processed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="processed">{formatTitle(outputFormat)}</TabsTrigger>
            <TabsTrigger value="raw">Raw Transcription</TabsTrigger>
          </TabsList>
          <TabsContent value="processed" className="mt-4">
            <div className="bg-muted/50 rounded-md p-4 whitespace-pre-wrap">
              {processedOutput || "No processed output available."}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(processedOutput)}>
                {copied ? (
                  <>
                    <Check className="mr-2 size-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 size-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadOutput(processedOutput, outputFormat)}
              >
                <Download className="mr-2 size-4" />
                Download
              </Button>
              <Button
                variant={isSaved ? "secondary" : "default"}
                size="sm"
                onClick={onSave}
                disabled={isSaved}
              >
                <Save className="mr-2 size-4" />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="raw" className="mt-4">
            <div className="bg-muted/50 rounded-md p-4 whitespace-pre-wrap">
              {rawTranscription || "No raw transcription available."}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(rawTranscription)}>
                {copied ? (
                  <>
                    <Check className="mr-2 size-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 size-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadOutput(rawTranscription, "raw")}
              >
                <Download className="mr-2 size-4" />
                Download
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        <p>
          You can switch between the processed output and raw transcription using the tabs above.
        </p>
      </CardFooter>
    </Card>
  );
}
