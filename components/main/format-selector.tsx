"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formats = [
  {
    value: "notes",
    label: "Notes",
    description: "Organized notes with headings and bullet points",
  },
  {
    value: "transcript",
    label: "Transcript",
    description: "Clean, readable transcript format",
  },
  {
    value: "list",
    label: "List",
    description: "Structured list of action items or key points",
  },
  {
    value: "summary",
    label: "Summary",
    description: "Concise summary of main points",
  },
];

export type OutputFormat = "notes" | "transcript" | "list" | "summary";

export function FormatSelector({
  onFormatChange,
}: {
  onFormatChange: (format: OutputFormat) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<OutputFormat>("notes");

  return (
    <div className="space-y-2 py-2">
      <h1 className="text-center font-semibold lg:text-lg">Select Output Format</h1>
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="mx-auto flex w-full max-w-[20rem] cursor-pointer justify-between"
            >
              {value ? formats.find((format) => format.value === value)?.label : "Select format..."}
              <ChevronsUpDown className="ml-2 size-5 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search format..." />
              <CommandEmpty>No format found.</CommandEmpty>
              <CommandGroup>
                {formats.map((format) => (
                  <CommandItem
                    key={format.value}
                    value={format.value}
                    onSelect={(currentValue) => {
                      const selectedFormat = currentValue as OutputFormat;
                      setValue(selectedFormat);
                      onFormatChange(selectedFormat);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-1 size-4 lg:size-5",
                        value === format.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{format.label}</span>
                      <span className="text-xs text-muted-foreground">{format.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <p className="mx-auto max-w-[30rem] pt-4 text-center text-xs text-muted-foreground lg:text-sm">
        Choose your preferred output format. You can then copy or save the results. If the output is
        not satisfactory, please try again.
      </p>
    </div>
  );
}
