import React, { useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { AlertTriangle } from 'lucide-react';
import { useKiosk } from '@/context/KioskContext';
import ErrorBoundary from './ErrorBoundary';
import { FloorTransitionOverlay, FloorTransitionIndicator } from './FloorTransition';
import { NavigationOverlay } from './NavigationOverlay';

import { floors } from './directory/constants';
import { LeftSidebar } from './directory/LeftSidebar';
import { BottomNav } from './directory/BottomNav';
import { SearchOverlay } from './directory/SearchOverlay';
import { ThreeDViewer } from './directory/ThreeDViewer';
import { NavigationCompletePopup } from './directory/NavigationCompletePopup';

// Preload all 3D models
useGLTF.preload('/models/first_floor.glb');
useGLTF.preload('/models/sekand_floor.glb');
useGLTF.preload('/models/attic.glb');
useGLTF.preload('/models/basement.glb');

interface CityHallDirectoryProps {
  onNavigate: (page: string) => void;
}

const CityHallDirectory = ({ onNavigate }: CityHallDirectoryProps) => {
  const { selectedFloor, setSelectedFloor, startNavigation, clearNavigation, navigation, labels } = useKiosk();
  const [selectedCategory, setSelectedCategory] = useState('maps');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const allOffices = useMemo(() => [
    ...Object.entries(labels.basement || {}).map(([id, name]) => ({ id, name: String(name), floor: 'basement', floorName: 'Basement' })),
    ...Object.entries(labels.first || {}).map(([id, name]) => ({ id, name: String(name), floor: 'first', floorName: 'First Floor' })),
    ...Object.entries(labels.second || {}).map(([id, name]) => ({ id, name: String(name), floor: 'second', floorName: 'Second Floor' })),
    ...Object.entries(labels.third || {}).map(([id, name]) => ({ id, name: String(name), floor: 'third', floorName: 'Third Floor' })),
  ], [labels]);

  const filteredOffices = allOffices.filter(office =>
    office.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOfficeSelect = (office: typeof allOffices[0]) => {
    setSelectedFloor(office.floor);
    startNavigation(office.floor, office.id, office.name.replace(/\n/g, ' '));
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const currentFloor = floors.find(f => f.id === selectedFloor);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left Sidebar - Floor Selection */}
      <LeftSidebar selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* 3D Model Viewer */}
        <div className="flex-1 relative">
          <ErrorBoundary fallback={
            <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  3D Viewer Error
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The 3D viewer could not initialize. This may be due to incompatible hardware or browser limitations.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Reload Page
                </button>
              </div>
            </div>
          }>
            <ThreeDViewer 
              currentFloorId={currentFloor?.id} 
              isSearchOpen={isSearchOpen} 
              autoRotate={false} 
            />
          </ErrorBoundary>
          
          {/* Floor Name Overlay */}
          <div className="absolute top-8 left-8 bg-white/90 dark:bg-gray-800/90 rounded-lg px-6 py-3 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentFloor?.name}
            </h2>
          </div>

          {/* Search Bar / Modal in Upper Right */}
          <SearchOverlay 
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredOffices={filteredOffices}
            handleOfficeSelect={handleOfficeSelect}
          />
        </div>

        {/* Bottom Navigation - Categories */}
        <BottomNav 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          onNavigate={onNavigate} 
        />
      </div>

      {/* Floor Transition Overlay */}
      <FloorTransitionOverlay 
        isActive={!!navigation?.isTransitioning}
        fromFloor={selectedFloor}
        toFloor={navigation?.floorId}
      />

      {/* Navigation Overlay - handles step progression */}
      <NavigationOverlay />

      {/* Floor Transition Indicator */}
      <FloorTransitionIndicator />

      {/* Navigation Complete Popup */}
      {navigation?.isActive && (
        <NavigationCompletePopup 
          navigation={navigation}
          onRepeat={() => startNavigation(navigation.floorId, navigation.officeId, navigation.officeName)}
          onDone={() => clearNavigation()}
        />
      )}
    </div>
  );
};

export default CityHallDirectory;
