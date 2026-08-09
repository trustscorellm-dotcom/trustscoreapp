"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";

interface UseOptimisticSaveOptions {
  upsert?: boolean;
  onConflict?: string;
}

// Implements the optimistic-UI -> Supabase write -> rollback-on-failure pattern
// from CLAUDE.md Section 19, generalized across companies/gated/NDA tables.
//
// Payloads are cast to Record<string, unknown> at the Supabase call sites —
// the client isn't wired to generated Database types (no `supabase gen types`
// step in this project yet), so its strict per-table payload typing can't
// otherwise match our hand-written Company/GatedData/NdaData interfaces.
export function useOptimisticSave<T extends object>(
  table: string,
  keyFields: Partial<T>,
  data: T,
  setData: (updater: (prev: T) => T) => void,
  options?: UseOptimisticSaveOptions
) {
  const [supabase] = useState(() => createClient());
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (updatedFields: Partial<T>) => {
      const previous = data;

      // 1. Optimistic UI update — happens immediately.
      setData((prev) => ({ ...prev, ...updatedFields }));
      setSaving(true);

      // 2. Background write to Supabase.
      const { error } = options?.upsert
        ? await supabase
            .from(table)
            .upsert(
              { ...keyFields, ...updatedFields } as Record<string, unknown>,
              { onConflict: options.onConflict }
            )
        : await supabase
            .from(table)
            .update(updatedFields as Record<string, unknown>)
            .match(keyFields as Record<string, unknown>);

      setSaving(false);

      if (error) {
        // 3. Rollback + surface error — the save did not actually happen.
        setData(() => previous);
        toast.error("Failed to save changes", "Please try again.");
        return false;
      }

      // 4. Success — nothing further needed here.
      return true;
    },
    [data, setData, supabase, table, keyFields, options]
  );

  return { save, saving };
}
