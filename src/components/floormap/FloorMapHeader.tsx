import React from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';

interface FloorMapHeaderProps {
  onBack: () => void;
  title: string;
  youAreHereLabel: string;
  groundFloorLabel: string;
}

export const FloorMapHeader = ({ onBack, title, youAreHereLabel, groundFloorLabel }: FloorMapHeaderProps) => (
  <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
    <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
      <ArrowLeft className="w-6 h-6 text-foreground" />
    </button>
    <h2 className="text-2xl font-display font-bold text-foreground">{title}</h2>
    <div className="ml-auto flex items-center gap-2">
      <MapPin className="w-5 h-5 text-destructive animate-bounce" />
      <span className="text-sm font-medium text-foreground">{youAreHereLabel}: {groundFloorLabel}</span>
    </div>
  </div>
);
