import React from 'react';
import { MapPin, Bath, ArrowUpDown, DoorOpen } from 'lucide-react';
import { type Office } from '@/data/kioskData';

interface FloorSliceProps {
  floor: any;
  colors: any;
  isActive: boolean;
  isYouAreHere: boolean;
  language: 'en' | 'fil';
  t: any;
  highlightOfficeId?: string;
  onClick: () => void;
}

export const FloorSlice = ({ 
  floor, 
  colors, 
  isActive, 
  isYouAreHere, 
  language, 
  t, 
  highlightOfficeId, 
  onClick 
}: FloorSliceProps) => (
  <div
    className={`floor-slice rounded-2xl border-2 ${colors.border} bg-gradient-to-r ${colors.bg} overflow-hidden
      ${isActive ? 'scale-[1.02] shadow-xl z-10 ring-2 ring-primary' : 'shadow-sm'}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${colors.accent} flex items-center justify-center`}>
          <span className="text-primary-foreground font-bold text-sm">
            {floor.floor === 1 ? 'G' : `${floor.floor}`}
          </span>
        </div>
        <span className="font-semibold text-foreground">
          {language === 'fil' ? floor.nameFil : floor.name}
        </span>
        {isYouAreHere && (
          <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full font-medium">
            {t.youAreHere}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        {floor.amenities.includes('Restrooms') && <Bath className="w-4 h-4" />}
        {floor.amenities.includes('Elevator') && <ArrowUpDown className="w-4 h-4" />}
        {floor.amenities.includes('Exit') && <DoorOpen className="w-4 h-4" />}
      </div>
    </div>

    {isActive && (
      <div className="px-5 pb-4 space-y-2 animate-fade-in">
        {floor.offices.map((office: Office) => {
          const isHighlighted = highlightOfficeId === office.id;
          return (
            <div
              key={office.id}
              className={`bg-card rounded-xl p-3 border flex items-center gap-3
                ${isHighlighted ? 'border-gold ring-2 ring-gold animate-pulse-glow' : 'border-border'}`}
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${isHighlighted ? 'text-gold' : 'text-primary'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {language === 'fil' ? office.nameFil : office.name}
                </p>
                <p className="text-xs text-muted-foreground">{t.room} {office.room}</p>
              </div>
              {isHighlighted && (
                <span className="px-2 py-0.5 bg-gold text-accent-foreground text-xs rounded-full font-medium flex-shrink-0">
                  Destination
                </span>
              )}
            </div>
          );
        })}
        <div className="flex flex-wrap gap-2 pt-1">
          {floor.amenities.map((a: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
              {a}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);
