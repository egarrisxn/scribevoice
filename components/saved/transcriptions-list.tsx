"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import FunCard from "@/components/fun-card";
import { TranscriptionCard } from "@/components/saved/transcription-card";
import type { Transcription } from "@/lib/types";

export default function TranscriptionsList() {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadTranscriptions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("transcriptions").select("*");
      if (error) {
        console.error("Error fetching transcriptions:", error);
        toast.error("Failed to load transcriptions.");
      } else {
        setTranscriptions(data);
      }
    };

    loadTranscriptions();
  }, []);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-accent group relative rounded-md border-2 bg-white dark:bg-zinc-900"
    >
      <FunCard className="p-6">
        <hr className="border-muted" />
        <div className="flex items-center justify-between py-6">
          {transcriptions.length > 0 ? (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-base font-semibold">
                {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                <span>Saved Transcriptions ({transcriptions.length})</span>
              </Button>
            </CollapsibleTrigger>
          ) : (
            <Button
              variant="ghost"
              disabled
              className="flex cursor-not-allowed items-center gap-2 text-base font-semibold opacity-50"
            >
              <ChevronDown className="size-4" />
              <span>Saved Transcriptions (0)</span>
            </Button>
          )}
        </div>
        <hr className="border-muted" />
        {transcriptions.length > 0 && (
          <CollapsibleContent>
            <div className="py-6">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {transcriptions.map((transcription) => (
                    <TranscriptionCard
                      key={transcription.id}
                      transcription={transcription}
                      setTranscriptions={setTranscriptions} // Pass state updater
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
            <hr className="border-muted" />
          </CollapsibleContent>
        )}
      </FunCard>
    </Collapsible>
  );
}
