"use client";

import { FiSearch } from "react-icons/fi";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sector: string;
  sectors: string[];
  onSectorChange: (value: string) => void;
}

export function SearchFilters({
  search,
  onSearchChange,
  sector,
  sectors,
  onSectorChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <FiSearch
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          size={16}
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search startups..."
          aria-label="Search startups"
          className="w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
      </div>
      <select
        value={sector}
        onChange={(event) => onSectorChange(event.target.value)}
        aria-label="Filter by sector"
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
      >
        <option value="">All sectors</option>
        {sectors.map((sectorOption) => (
          <option key={sectorOption} value={sectorOption}>
            {sectorOption}
          </option>
        ))}
      </select>
    </div>
  );
}
