"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptionCard } from "@/components/saved/transcription-card";

interface Transcription {
  id: string;
  user_id: string;
  transcription_text: string;
  created_at: string;
}

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

  if (transcriptions.length === 0) {
    return null;
  }

  const Border = ({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
      <div
        {...rest}
        className={cn("absolute size-6 border-zinc-700 dark:border-zinc-200", className)}
      />
    );
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-accent group relative rounded-md border-2 bg-white dark:bg-zinc-900"
    >
      <Border className="-top-0.5 -left-0.5 rounded-tl-md border-t-2 border-l-2" />
      <Border className="-top-0.5 -right-0.5 rounded-tr-md border-t-2 border-r-2" />
      <Border className="-bottom-0.5 -left-0.5 rounded-bl-md border-b-2 border-l-2" />
      <Border className="-right-0.5 -bottom-0.5 rounded-br-md border-r-2 border-b-2" />
      <div className="p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
        <hr className="border-muted" />
        <div className="flex items-center justify-between py-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex cursor-pointer items-center gap-2">
              {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              <h3 className="text-base leading-none font-semibold">
                Saved Transcriptions ({transcriptions.length})
              </h3>
            </Button>
          </CollapsibleTrigger>
        </div>
        <hr className="border-muted" />
        <CollapsibleContent className="x">
          <div className="py-6">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {transcriptions.map((transcription) => (
                  <TranscriptionCard key={transcription.id} transcription={transcription} />
                ))}
              </div>
            </ScrollArea>
          </div>
          <hr className="border-muted" />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
