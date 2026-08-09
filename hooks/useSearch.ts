"use client";

import { useMemo, useState } from "react";

export function useSearch<T>(
  items: T[],
  predicate: (item: T, query: string, sector: string) => boolean
) {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");

  const filtered = useMemo(
    () => items.filter((item) => predicate(item, search, sector)),
    [items, search, sector, predicate]
  );

  return { search, setSearch, sector, setSector, filtered };
}
