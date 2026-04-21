import { useState, useRef, Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei';
import { Map, Building, Users, FileText, Calendar, Phone, Info, Home, AlertTriangle, Search, X } from 'lucide-react';
import { useKiosk } from '@/context/KioskContext';
import ErrorBoundary from './ErrorBoundary';
import * as THREE from 'three';

import FirstFloor from './floors/FirstFloor';
import SecondFloor from './floors/SecondFloor';
import ThirdFloor from './floors/ThirdFloor';
import BasementFloor from './floors/BasementFloor';

// Preload all 3D models
useGLTF.preload('/models/first_floor.glb');
useGLTF.preload('/models/sekand_floor.glb');
useGLTF.preload('/models/attic.glb');
useGLTF.preload('/models/basement.glb');

// Floor data for City Hall
const floors = [
  {
    id: 'first',
    name: 'FIRST FLOOR',
    model: '/models/first_floor.glb',
    description: 'Public Services & Reception',
    offset: [0, 0, 0],
  },
  {
    id: 'second',
    name: 'SECOND FLOOR',
    model: '/models/sekand_floor.glb',
    description: 'City Council & Chambers',
    offset: [0, 0, 0],
  },
  {
    id: 'third',
    name: 'THIRD FLOOR',
    model: '/models/attic.glb',
    description: 'Administrative Offices',
    offset: [0, 0, 0],
  },
  {
    id: 'basement',
    name: 'BASEMENT',
    model: '/models/basement.glb',
    description: 'Parking & Facilities',
    offset: [0, 0, 0],
  },
];

// Loading fallback component with minimum 2-second delay
function LoadingFallback() {
  const [showLoading, setShowLoading] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime.current;
      const remainingTime = Math.max(0, 2000 - elapsed);
      
      setTimeout(() => {
        setShowLoading(false);
      }, remainingTime);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!showLoading) return null;

  return (
    <Html center>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </Html>
  );
}

// Removed Model and PathfindingOverlay logic to FloorBase.tsx

// City Hall Services Categories
const categories = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'maps', name: 'Directory', icon: Map },
  { id: 'info', name: 'Info', icon: Info },
];

interface CityHallDirectoryProps {
  onNavigate: (page: string) => void;
}

const CityHallDirectory = ({ onNavigate }: CityHallDirectoryProps) => {
  const { language, theme, selectedFloor, setSelectedFloor, startNavigation, labels } = useKiosk();
  const [selectedCategory, setSelectedCategory] = useState('maps');
  const [autoRotate, setAutoRotate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const controlsRef = useRef<any>(null);

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
    startNavigation(office.floor, office.id);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const currentFloor = floors.find(f => f.id === selectedFloor);

  const handleUserInteraction = () => {
    // Rotation is now disabled by default
  };

  const handleCanvasInteraction = (event: any) => {
    handleUserInteraction();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left Sidebar - Floor Selection */}
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
            <Canvas 
              camera={{ position: [0, 15, 0], fov: 45, near: 0.1, far: 1000 }}
              gl={{ 
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false,
                precision: 'highp',
                stencil: false,
                depth: true,
                failIfMajorPerformanceCaveat: false
              }}
              shadows
              style={{ background: '#F5F5DC' }}
              dpr={Math.min(window.devicePixelRatio || 1, 2)}
              frameloop="demand"
              onMouseDown={handleCanvasInteraction}
              onMouseUp={handleCanvasInteraction}
              onTouchStart={handleCanvasInteraction}
              onTouchEnd={handleCanvasInteraction}
              onWheel={handleCanvasInteraction}
              onPointerMissed={() => {
                console.log('Pointer missed');
              }}
              onClick={(e) => {
                console.log('Canvas clicked directly:', e);
                // Force handleCanvasInteraction to be called
                handleCanvasInteraction(e);
              }}
            >
              <color attach="background" args={['#F5F5DC']} />
              <ambientLight intensity={0.4} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={0.9}
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                color="#ffffff"
              />
              <Suspense fallback={<LoadingFallback />}>
                <Stage 
                  intensity={0.3}
                  shadows
                  adjustCamera={false}
                >
                  {currentFloor?.id === 'first' && (
                    <FirstFloor hideLabels={isSearchOpen} />
                  )}
                  {currentFloor?.id === 'second' && (
                    <SecondFloor hideLabels={isSearchOpen} />
                  )}
                  {currentFloor?.id === 'third' && (
                    <ThirdFloor hideLabels={isSearchOpen} />
                  )}
                  {currentFloor?.id === 'basement' && (
                    <BasementFloor hideLabels={isSearchOpen} />
                  )}
                </Stage>
                <OrbitControls 
                  ref={controlsRef}
                  key={autoRotate ? 'rotating' : 'static'}
                  enablePan={true}
                  panSpeed={1}
                  minDistance={1}
                  maxDistance={50}
                  autoRotate={autoRotate}
                  autoRotateSpeed={0.5}
                  enableDamping
                  dampingFactor={0.1}
                  enableZoom={true}
                  zoomSpeed={1}
                  rotateSpeed={1}
                  target={[0, 1, 0]}
                  maxPolarAngle={Math.PI / 2}
                  makeDefault
                />
              </Suspense>
            </Canvas>
          </ErrorBoundary>
          
          {/* Floor Name Overlay */}
          <div className="absolute top-8 left-8 bg-white/90 dark:bg-gray-800/90 rounded-lg px-6 py-3 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentFloor?.name}
            </h2>
          </div>

          {/* Search Bar / Modal in Upper Right */}
          <div className="absolute top-8 right-8 z-50">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 text-green-600"
              >
                <Search className="w-6 h-6" />
              </button>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-80 max-h-[70vh] flex flex-col border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search first floor offices..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredOffices.length > 0 ? (
                    <div className="space-y-1">
                      {filteredOffices.map((office) => (
                        <button
                          key={`${office.floor}-${office.id}`}
                          onClick={() => handleOfficeSelect(office)}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                        >
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-green-600 transition-colors truncate">
                            {String(office.name).replace(/\\n/g, '\n').replace(/\n/g, ' ')}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {office.floorName}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500 text-sm">
                      No offices found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation - Categories */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around items-center py-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    if (category.id === 'home') {
                      onNavigate('hero'); // Navigate to home screen
                    } else {
                      setSelectedCategory(category.id);
                    }
                  }}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium text-center">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityHallDirectory;
