"use client";

import { motion } from "framer-motion";
import { type Filter, FILTERS } from "@/lib/tarefas";

interface FilterTabsProps {
  active: Filter;
  onChange: (filter: Filter) => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-black/5 p-1">
      {FILTERS.map((f) => {
        const isActive = f.id === active;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className="relative flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition"
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className={`relative ${isActive ? "text-accent" : "text-ink/50"}`}>
              {f.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
