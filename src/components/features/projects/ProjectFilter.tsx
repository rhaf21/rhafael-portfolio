"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import type { ProjectCategory } from "@/types/project";

type FilterOption = "all" | ProjectCategory;

interface ProjectFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "shopify", label: "Shopify" },
  { value: "wordpress", label: "WordPress" },
  { value: "react", label: "React" },
];

export function ProjectFilter({
  activeFilter,
  onFilterChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
            activeFilter === filter.value
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {filter.label}
          {activeFilter === filter.value && (
            <motion.div
              layoutId="project-filter-indicator"
              className="absolute inset-0 -z-10 rounded-full bg-[var(--border)]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

export type { FilterOption };
