import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei';
import { Map, Building, Users, FileText, Calendar, Phone, Info, Home, AlertTriangle } from 'lucide-react';
import { useKiosk } from '@/context/KioskContext';
import ErrorBoundary from './ErrorBoundary';
import * as THREE from 'three';

// Preload all 3D models
useGLTF.preload('/models/first_floor.glb');
useGLTF.preload('/models/second_floor.glb');
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
    model: '/models/second_floor.glb',
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

// 3D Model Component with proper material handling and centering
function Model({
  url,
  offset = [0, 0, 0],
  onSelectOffice,
  onLoadMarkers,
}: {
  url: string;
  offset?: [number, number, number];
  onSelectOffice?: (name: string, position: THREE.Vector3) => void;
  onLoadMarkers?: (
    markers: { 
      name: string; 
      position: THREE.Vector3;
      size: THREE.Vector3;
      center: THREE.Vector3;
    }[]
  ) => void;
}) {
  const { scene } = useGLTF(url);
  const handleClick = (event: any) => {
    event.stopPropagation();
    const clickedObject = event.object;
    console.log('Direct mesh click:', clickedObject.name);
    
    const box = new THREE.Box3().setFromObject(clickedObject);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const popupPosition = new THREE.Vector3(
      center.x,
      box.max.y + 0.8,
      center.z
    );

    onSelectOffice?.(clickedObject.name, popupPosition);
  };

  const clonedScene = scene.clone(true);

  clonedScene.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.userData.clickable = true;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((mat: any) => {
        if (!mat) return;

        mat.transparent = false;
        mat.opacity = 1;
        mat.side = THREE.DoubleSide;
        mat.depthWrite = true;
        mat.depthTest = true;

        const name = child.name.toLowerCase();
        const isBase =
          name.includes('floor') ||
          name.includes('base') ||
          name.includes('ground') ||
          name.includes('slab');
        const isCube = name === 'cube';

        if (isCube) {
          mat.color?.setHex(0x8B4513);
        } else if (isBase) {
          mat.color?.setHex(0x004700);
        } else {
          mat.color?.setHex(0xffffff);
        }

        mat.needsUpdate = true;
      });
    }
  });

  // Auto-center each model but apply offset for fine-tuning
  const box = new THREE.Box3().setFromObject(clonedScene);
  const center = box.getCenter(new THREE.Vector3());
  
  const wrapper = new THREE.Group();
  wrapper.add(clonedScene);
  clonedScene.position.set(-center.x, -center.y, -center.z);
  wrapper.position.set(...offset);
  wrapper.scale.set(5.5, 5.5, 5.5);

  // Collect static roof labels and structure dimensions
  const markers: { 
    name: string; 
    position: THREE.Vector3;
    size: THREE.Vector3;
    center: THREE.Vector3;
  }[] = [];

  // Now calculate marker positions in world space
  // Create a temporary world matrix to get accurate world positions
  wrapper.updateMatrixWorld(true);
  
  wrapper.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      const name = child.name.toLowerCase();

      const ignoreNames = ['ground', 'plane', 'stairs', 'cube', 'cube001'];

      if (!ignoreNames.includes(name)) {
        // Get bounding box in local space
        const childBox = new THREE.Box3().setFromObject(child);
        
        // Calculate marker position in local space
        const localCenter = new THREE.Vector3();
        childBox.getCenter(localCenter);
        
        const size = new THREE.Vector3();
        childBox.getSize(size);
        
        const markerPos = new THREE.Vector3(
          localCenter.x,
          childBox.max.y + 0.3,
          localCenter.z
        );
        
        markers.push({
          name: child.name,
          position: markerPos,
          size: size,
          center: localCenter,
        });
      }
    }
  });

    onLoadMarkers?.(markers);

  return (
    <>
      <primitive
        object={wrapper}
        onClick={handleClick}
      />
      {/* Create invisible clickable meshes for each office */}
      {markers.map((marker, index) => (
        <mesh
          key={`clickable-${index}`}
          position={[
            marker.center.x,
            marker.center.y,
            marker.center.z,
          ]}
          onClick={(e) => {
            e.stopPropagation();
            console.log('Invisible mesh clicked:', marker.name);
            
            const popupPosition = new THREE.Vector3(
              marker.center.x,
              marker.position.y + 0.1,
              marker.center.z
            );
            
            onSelectOffice?.(marker.name, popupPosition);
          }}
        >
          <boxGeometry args={[
            marker.size.x * 1.1, // Slightly larger for better click detection
            marker.size.y * 1.1,
            marker.size.z * 1.1
          ]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}
    </>
  );
}

// Error fallback component for 3D models
function ModelErrorFallback() {
  return (
    <Html center>
      <div className="bg-white/90 p-4 rounded-lg shadow-lg text-center">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        <p className="text-sm text-gray-600">3D model unavailable</p>
      </div>
    </Html>
  );
}

// City Hall Services Categories
const categories = [
  { id: 'maps', name: 'Directory', icon: Map },
  { id: 'offices', name: 'Offices', icon: Building },
  { id: 'services', name: 'Services', icon: Users },
  { id: 'documents', name: 'Documents', icon: FileText },
  { id: 'events', name: 'Events', icon: Calendar },
  { id: 'contacts', name: 'Contacts', icon: Phone },
  { id: 'info', name: 'Information', icon: Info },
  { id: 'home', name: 'Home', icon: Home },
];

interface CityHallDirectoryProps {
  onNavigate: (page: string) => void;
}

const CityHallDirectory = ({ onNavigate }: CityHallDirectoryProps) => {
  const [selectedFloor, setSelectedFloor] = useState('first');
  const [selectedCategory, setSelectedCategory] = useState('maps');
  const [selectedOffice, setSelectedOffice] = useState<{
    name: string;
    position: THREE.Vector3;
  } | null>(null);
  const [officeMarkers, setOfficeMarkers] = useState<
    { name: string; position: THREE.Vector3 }[]
  >([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const controlsRef = useRef<any>(null);
  const { language, theme } = useKiosk();

  const currentFloor = floors.find(f => f.id === selectedFloor);

  const officeLabels: Record<string, string> = {
    city_treasurers: 'City Treasurer',
    city_planning_office: 'City Planning Office',
    session_hall: 'Session Hall',
    clinic: 'Clinic',
    mitd: 'MITD',
    coop: 'Coop',
    sp_admin: 'SP Admin',
    cdcc: 'CDCC',
    city_budget_office: 'City Budget Office',
    city_accountant: 'City Accountant',
    city_auditors: 'City Auditors',
    city_treasurers_2: 'City Treasurers Office',
    city_auditors_2: 'City Auditors Office',
    cr_male: 'Male CR',
    cr_female: 'Female CR',
    licensing: 'Licensing Office',
    one_stop_shop: 'One Stop Shop',
    cr_one_stop_shop: 'One Stop Shop CR',
  };

  const handleUserInteraction = () => {
    console.log('User interaction detected - stopping rotation');
    
    // Clear existing interaction timeout to debounce
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    setAutoRotate(false);
    
    // Clear existing auto-resume timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Resume auto-rotation after 5 seconds of no interaction
    timeoutRef.current = setTimeout(() => {
      console.log('Resuming auto-rotation');
      setAutoRotate(true);
      // Force controls to update
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
      }
    }, 5000);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left Sidebar - Floor Selection */}
      <div className="w-24 bg-green-700 shadow-lg flex flex-col items-center py-4 space-y-3">
        {/* Time Display */}
        <div className="text-white text-xs text-center mb-4">
          <div className="font-bold">04:30 PM</div>
          <div>March 27, 2026</div>
          <div>Friday</div>
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
              camera={{ position: [0, 8, 15], fov: 45, near: 0.1, far: 1000 }}
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
                console.log('Pointer missed - deselecting office');
                setSelectedOffice(null);
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
                  {currentFloor && <Model
                    url={currentFloor.model}
                    offset={currentFloor.offset as [number, number, number]}
                    onSelectOffice={(name, position) => {
                      console.log('Office selected:', name, position);
                      setSelectedOffice({ name, position });
                    }}
                    onLoadMarkers={(markers) => {
                      console.log('Received markers in parent:', markers);
                      setOfficeMarkers(markers);
                    }}
                  />}
                  {officeMarkers.map((office, index) => (
                    <Html
                      key={index}
                      position={[
                        office.position.x,
                        office.position.y + 0.03,
                        office.position.z,
                      ]}
                      transform
                      rotation={[-Math.PI / 2, 0, 0]}
                      distanceFactor={8}
                      style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                      }}
                    >
                      <div className="text-black text-[8px] font-semibold tracking-tight whitespace-nowrap">
                        {(officeLabels[office.name] ||
                          office.name.replace(/_/g, ' ')).toUpperCase()}
                      </div>
                    </Html>
                  ))}
                  {selectedOffice && (
                    <Html
                      position={[
                        selectedOffice.position.x,
                        selectedOffice.position.y + 0.8,
                        selectedOffice.position.z,
                      ]}
                      center
                    >
                      <div className="relative">
                        {/* Location pin shape with text inside */}
                        <div className="bg-red-500 rounded relative shadow-lg flex items-center justify-center px-3 py-2 min-w-[80px]">
                          <span className="text-white text-sm font-bold text-center leading-none whitespace-nowrap">
                            {(officeLabels[selectedOffice.name] || selectedOffice.name.replace(/_/g, ' ')).toUpperCase()}
                          </span>
                        </div>
                        {/* Pin point */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-500"></div>
                      </div>
                    </Html>
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
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {currentFloor?.description}
            </p>
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
