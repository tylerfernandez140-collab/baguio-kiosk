import React from 'react';
import { Accessibility } from 'lucide-react';

interface Filter {
  id: string;
  label: string;
}

interface FloorMapFooterProps {
  filters: Filter[];
  selectedFilter: string;
  setSelectedFilter: (id: string) => void;
  pwdLabel: string;
}

export const FloorMapFooter = ({ filters, selectedFilter, setSelectedFilter, pwdLabel }: FloorMapFooterProps) => (
  <>
    <div className="mt-4 glass-card p-4 rounded-2xl flex items-center gap-3">
      <Accessibility className="w-6 h-6 text-secondary" />
      <span className="text-sm text-foreground font-medium">{pwdLabel}</span>
    </div>
    
    <div className="sticky bottom-0 z-10 glass-card border-t border-border px-4 py-3 mt-auto">
      <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all kiosk-button
              ${selectedFilter === f.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  </>
);
