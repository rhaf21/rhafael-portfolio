"use client";

import type { ProjectCategory } from "@/types/project";

type FilterOption = "all" | ProjectCategory;

interface ProjectFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "shopify", label: "Shopify" },
  { value: "wordpress", label: "WordPress" },
  { value: "react", label: "React" },
];

export function ProjectFilter({
  activeFilter,
  onFilterChange,
}: ProjectFilterProps) {
  return (
    <div className="filter-row" data-reveal data-delay="200">
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          className={`filter-chip${activeFilter === f.value ? " active" : ""}`}
          onClick={() => onFilterChange(f.value)}
          data-cursor="hover"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export type { FilterOption };
