import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { translations, cityHallFloors, type Office } from '@/data/kioskData';
import { ArrowLeft, MapPin, Accessibility, DoorOpen, Bath, ArrowUpDown } from 'lucide-react';

interface FloorMapProps {
  onBack: () => void;
  highlightOffice?: Office | null;
}

const floorColors = [
  { bg: 'from-pine/20 to-pine/5', border: 'border-pine/30', accent: 'bg-pine' },
  { bg: 'from-secondary/20 to-secondary/5', border: 'border-secondary/30', accent: 'bg-secondary' },
  { bg: 'from-gold/20 to-gold/5', border: 'border-gold/30', accent: 'bg-gold' },
  { bg: 'from-pine-light/20 to-pine-light/5', border: 'border-pine-light/30', accent: 'bg-pine-light' },
];

const FloorMap = ({ onBack, highlightOffice }: FloorMapProps) => {
  const { language } = useKiosk();
  const t = translations[language];
  const [activeFloor, setActiveFloor] = useState<number | null>(highlightOffice?.floor ?? null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: t.allFloors },
    { id: '1', label: t.groundFloor },
    { id: '2', label: '2nd Floor' },
    { id: '3', label: '3rd Floor' },
    { id: '4', label: '4th Floor' },
    { id: 'offices', label: t.offices },
    { id: 'amenities', label: t.amenities },
    { id: 'exits', label: t.exitRoutes },
  ];

  const filteredFloors = selectedFilter === 'all' || selectedFilter === 'offices' || selectedFilter === 'amenities' || selectedFilter === 'exits'
    ? cityHallFloors
    : cityHallFloors.filter(f => f.floor === parseInt(selectedFilter));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">{t.floorMap}</h2>
        <div className="ml-auto flex items-center gap-2">
          <MapPin className="w-5 h-5 text-destructive animate-bounce" />
          <span className="text-sm font-medium text-foreground">{t.youAreHere}: {t.groundFloor}</span>
        </div>
      </div>

      {/* Floor Stack */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col-reverse gap-3">
          {filteredFloors.map((floor, idx) => {
            const colors = floorColors[floor.floor - 1];
            const isActive = activeFloor === floor.floor;
            const isYouAreHere = floor.floor === 1;

            return (
              <div
                key={floor.floor}
                className={`floor-slice rounded-2xl border-2 ${colors.border} bg-gradient-to-r ${colors.bg} overflow-hidden
                  ${isActive ? 'scale-[1.02] shadow-xl z-10 ring-2 ring-primary' : 'shadow-sm'}`}
                onClick={() => setActiveFloor(isActive ? null : floor.floor)}
              >
                {/* Floor header */}
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

                {/* Expanded offices */}
                {isActive && (
                  <div className="px-5 pb-4 space-y-2 animate-fade-in">
                    {floor.offices.map((office) => {
                      const isHighlighted = highlightOffice?.id === office.id;
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
                      {floor.amenities.map((a, i) => (
                        <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PWD Route Option */}
        <div className="mt-4 glass-card p-4 rounded-2xl flex items-center gap-3">
          <Accessibility className="w-6 h-6 text-secondary" />
          <span className="text-sm text-foreground font-medium">
            {language === 'en' ? 'PWD & Senior-Friendly Route Available (Elevator Access)' : 'Ruta para sa PWD at Senior (Elevator)'}
          </span>
        </div>
      </div>

      {/* Bottom filter bar */}
      <div className="sticky bottom-0 z-10 glass-card border-t border-border px-4 py-3">
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
    </div>
  );
};

export default FloorMap;
