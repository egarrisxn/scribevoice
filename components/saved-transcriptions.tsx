"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Trash2, Download, Copy, Check } from "lucide-react";
import {
  SavedTranscription,
  getSavedTranscriptions,
  deleteTranscription,
  clearAllTranscriptions,
} from "@/lib/storage";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function SavedTranscriptions() {
  const [transcriptions, setTranscriptions] = useState<SavedTranscription[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const loadTranscriptions = () => {
      const saved = getSavedTranscriptions();
      setTranscriptions(saved);
    };

    loadTranscriptions();

    window.addEventListener("storage", loadTranscriptions);

    return () => {
      window.removeEventListener("storage", loadTranscriptions);
    };
  }, []);

  const handleDelete = (id: string) => {
    deleteTranscription(id);
    setTranscriptions((prev) => prev.filter((t) => t.id !== id));
    toast.info("The transcription has been removed from your saved items.");
  };

  const handleClearAll = () => {
    clearAllTranscriptions();
    setTranscriptions([]);
    toast.info("All saved transcriptions have been removed.");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadTranscription = (transcription: SavedTranscription) => {
    const blob = new Blob([transcription.processedOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ScribeVoice-${transcription.outputFormat}-${new Date(transcription.timestamp).toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTitle = (format: string) => {
    return format.charAt(0).toUpperCase() + format.slice(1);
  };

  if (transcriptions.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="pb-4 text-center text-3xl font-bold md:text-4xl">Save Locally</h2>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-card w-full rounded-lg border shadow-sm"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex cursor-pointer items-center gap-2 p-2">
              {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              <h3 className="text-base leading-none font-semibold">
                Saved Transcriptions ({transcriptions.length})
              </h3>
            </Button>
          </CollapsibleTrigger>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive cursor-pointer">
                <Trash2 className="mr-1 size-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your saved transcriptions. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CollapsibleContent>
          <ScrollArea className="h-[400px] px-2 pt-3">
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <Card
                  key={transcription.id}
                  className="from-background via-background to-accent/40 overflow-hidden rounded bg-gradient-to-t"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{transcription.title}</CardTitle>
                        <CardDescription>
                          {formatDistanceToNow(new Date(transcription.timestamp), {
                            addSuffix: true,
                          })}{" "}
                          •{formatTitle(transcription.outputFormat)}
                        </CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive size-8 cursor-pointer"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this transcription?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(transcription.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Tabs defaultValue="processed">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="processed">
                          {formatTitle(transcription.outputFormat)}
                        </TabsTrigger>
                        <TabsTrigger value="raw">Raw Transcription</TabsTrigger>
                      </TabsList>
                      <TabsContent value="processed" className="mt-2">
                        <div className="bg-muted/50 max-h-[150px] overflow-y-auto rounded-md p-3 text-sm whitespace-pre-wrap">
                          {transcription.processedOutput}
                        </div>
                      </TabsContent>
                      <TabsContent value="raw" className="mt-2">
                        <div className="bg-muted/50 max-h-[150px] overflow-y-auto rounded-md p-3 text-sm whitespace-pre-wrap">
                          {transcription.rawTranscription}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-2 pb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2 cursor-pointer"
                      onClick={() =>
                        copyToClipboard(transcription.processedOutput, transcription.id)
                      }
                    >
                      {copied === transcription.id ? (
                        <>
                          <Check className="mr-1 size-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 size-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => downloadTranscription(transcription)}
                    >
                      <Download className="mr-1 size-4" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
