"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { deleteTranscription } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transcription?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteTranscription(id);
      toast.success("Transcription deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete transcription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive size-8 cursor-pointer"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  );
}
