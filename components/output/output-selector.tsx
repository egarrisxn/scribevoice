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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <>
      <Card className="w-full space-y-2 rounded-none border-none py-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-center font-semibold lg:text-lg">Select Your Format</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="mx-auto flex w-full max-w-[20rem] justify-between"
              >
                {value
                  ? formats.find((format) => format.value === value)?.label
                  : "Select format..."}
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
                        <span className="text-muted-foreground text-xs">{format.description}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
        <CardFooter className="text-muted-foreground mx-auto max-w-[30rem] text-center text-xs lg:text-sm">
          <p>
            Select your preferred output format. Afterwards, you may copy or save the results. If
            you are not satisfied, try again!
          </p>
        </CardFooter>
      </Card>
    </>
  );
}
