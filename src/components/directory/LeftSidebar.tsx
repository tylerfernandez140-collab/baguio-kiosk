import React, { useState, useEffect } from 'react';
import { floors } from './constants';

interface LeftSidebarProps {
  selectedFloor: string;
  setSelectedFloor: (floor: string) => void;
}

export const LeftSidebar = ({ selectedFloor, setSelectedFloor }: LeftSidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date: Date) => date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  const formatDay = (date: Date) => date.toLocaleDateString([], { weekday: 'long' });

  return (
    <div className="w-24 bg-green-700 shadow-lg flex flex-col items-center py-4 space-y-3">
      {/* Time Display */}
      <div className="text-white text-xs text-center mb-4">
        <div className="font-bold uppercase">{formatTime(currentTime)}</div>
        <div className="text-[10px]">{formatDate(currentTime)}</div>
        <div className="text-[10px] opacity-80 uppercase">{formatDay(currentTime)}</div>
      </div>

      {/* Floor Buttons */}
      {floors.map((floor) => (
        <button
          key={floor.id}
          onClick={() => setSelectedFloor(floor.id)}
          className={`w-20 h-16 rounded-lg font-semibold text-sm transition-all ${
            selectedFloor === floor.id
              ? 'bg-green-800 text-white shadow-lg scale-105'
              : 'bg-green-600 text-white hover:bg-green-800'
          }`}
        >
          {floor.name.split(' ')[0]}
        </button>
      ))}
    </div>
  );
};
