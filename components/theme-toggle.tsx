/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Computer, Sun, Moon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ToggleGroup
      variant="outline"
      type="single"
      size="sm"
      className="text-sm"
      value={theme || resolvedTheme}
      onValueChange={(value) => value && setTheme(value)}
    >
      <ToggleGroupItem
        value="system"
        aria-label="Toggle system theme"
        className="cursor-pointer"
      >
        <Computer className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="light"
        aria-label="Toggle light theme"
        className="cursor-pointer"
      >
        <Sun className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Toggle dark theme"
        className="cursor-pointer"
      >
        <Moon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
