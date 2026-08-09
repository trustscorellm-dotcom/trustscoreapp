"use client";

import { useState, type KeyboardEvent } from "react";
import { FiX, FiPlus } from "react-icons/fi";

interface TagListInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagListInput({ label, values, onChange, placeholder }: TagListInputProps) {
  const [draft, setDraft] = useState("");

  function addValue() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft("");
  }

  function removeValue(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addValue();
    }
  }

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
        <button
          type="button"
          onClick={addValue}
          aria-label={`Add ${label}`}
          className="flex items-center justify-center rounded-md border border-border px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <FiPlus size={16} aria-hidden="true" />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(index)}
                aria-label={`Remove ${value}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiX size={12} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
