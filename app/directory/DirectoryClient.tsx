"use client";

import { useCallback } from "react";
import { FiInbox } from "react-icons/fi";
import { StartupCard } from "@/components/StartupCard";
import { SearchFilters } from "@/components/SearchFilters";
import { ResponsiveGrid } from "@/components/ResponsiveGrid";
import { useSearch } from "@/hooks/useSearch";
import type { Company } from "@/types/startup";

interface DirectoryClientProps {
  companies: Company[];
}

export function DirectoryClient({ companies }: DirectoryClientProps) {
  const sectors = Array.from(
    new Set(companies.map((company) => company.sector).filter((s): s is string => Boolean(s)))
  ).sort();

  const matches = useCallback(
    (company: Company, query: string, sectorFilter: string) => {
      const matchesQuery =
        !query || company.name.toLowerCase().includes(query.toLowerCase());
      const matchesSector = !sectorFilter || company.sector === sectorFilter;
      return matchesQuery && matchesSector;
    },
    []
  );

  const { search, setSearch, sector, setSector, filtered } = useSearch(companies, matches);

  return (
    <div className="flex flex-col gap-8">
      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        sector={sector}
        sectors={sectors}
        onSectorChange={setSector}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <FiInbox size={28} className="text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            {companies.length === 0
              ? "No startups on the platform yet"
              : "No startups match your search"}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {companies.length === 0
              ? "Founders who complete their TrustScore profile will appear here."
              : "Try a different search term or sector."}
          </p>
        </div>
      ) : (
        <ResponsiveGrid>
          {filtered.map((company) => (
            <StartupCard key={company.id} company={company} />
          ))}
        </ResponsiveGrid>
      )}
    </div>
  );
}
