"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptionCard } from "@/components/saved/saved-card";

interface Transcription {
  id: string;
  user_id: string;
  transcription_text: string;
  created_at: string;
}

export default function SavedTranscriptions() {
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

  if (transcriptions.length === 0) {
    return null;
  }

  return (
    <>
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
        </div>

        <CollapsibleContent>
          <ScrollArea className="h-[400px] p-2">
            <div className="space-y-4">
              {transcriptions.map((transcription) => (
                <TranscriptionCard key={transcription.id} transcription={transcription} />
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
