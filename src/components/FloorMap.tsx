import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { translations, cityHallFloors, type Office } from '@/data/kioskData';
import { floorColors, getFilters } from './floormap/constants';
import { FloorMapHeader } from './floormap/FloorMapHeader';
import { FloorMapFooter } from './floormap/FloorMapFooter';
import { FloorSlice } from './floormap/FloorSlice';

interface FloorMapProps {
  onBack: () => void;
  highlightOffice?: Office | null;
}

const FloorMap = ({ onBack, highlightOffice }: FloorMapProps) => {
  const { language } = useKiosk();
  const t = translations[language];
  const [activeFloor, setActiveFloor] = useState<number | null>(highlightOffice?.floor ?? null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = getFilters(t);

  const filteredFloors = selectedFilter === 'all' || selectedFilter === 'offices' || selectedFilter === 'amenities' || selectedFilter === 'exits'
    ? cityHallFloors
    : cityHallFloors.filter(f => f.floor === parseInt(selectedFilter));

  const pwdLabel = language === 'en' 
    ? 'PWD & Senior-Friendly Route Available (Elevator Access)' 
    : 'Ruta para sa PWD at Senior (Elevator)';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <FloorMapHeader 
        onBack={onBack} 
        title={t.floorMap} 
        youAreHereLabel={t.youAreHere} 
        groundFloorLabel={t.groundFloor} 
      />

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col-reverse gap-3">
          {filteredFloors.map((floor) => {
            const colors = floorColors[floor.floor - 1];
            const isActive = activeFloor === floor.floor;
            const isYouAreHere = floor.floor === 1;

            return (
              <FloorSlice
                key={floor.floor}
                floor={floor}
                colors={colors}
                isActive={isActive}
                isYouAreHere={isYouAreHere}
                language={language}
                t={t}
                highlightOfficeId={highlightOffice?.id}
                onClick={() => setActiveFloor(isActive ? null : floor.floor)}
              />
            );
          })}
        </div>

        <FloorMapFooter 
          filters={filters} 
          selectedFilter={selectedFilter} 
          setSelectedFilter={setSelectedFilter} 
          pwdLabel={pwdLabel} 
        />
      </div>
    </div>
  );
};

export default FloorMap;
