"use client";

import { deckThemes } from "@/lib/mock-data";
import type { DeckTheme } from "@/types";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  value: DeckTheme;
  onChange: (theme: DeckTheme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700">
        Presentation Theme
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {deckThemes.map((theme) => (
          <button
            key={theme.value}
            type="button"
            onClick={() => onChange(theme.value)}
            className={cn(
              "group relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all",
              value === theme.value
                ? "border-violet-500 ring-2 ring-violet-500/20"
                : "border-slate-200 hover:border-violet-300"
            )}
            aria-pressed={value === theme.value}
            aria-label={`Select ${theme.label} theme`}
          >
            <div
              className={cn(
                "mb-2 h-12 w-full rounded-lg bg-gradient-to-br",
                theme.preview
              )}
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-slate-900">
              {theme.label}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
