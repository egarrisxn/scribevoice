"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  id: string;
}

export function CopyButton({ text, id }: CopyButtonProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Button variant="outline" size="sm" className="mr-2 cursor-pointer" onClick={copyToClipboard}>
      {copied === id ? (
        <>
          <Check className="mr-1 size-4" /> <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="mr-1 size-4" /> <span>Copy</span>
        </>
      )}
    </Button>
  );
}
