import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei';
import { Map, Building, Users, FileText, Calendar, Phone, Info, Home, AlertTriangle } from 'lucide-react';
import { useKiosk } from '@/context/KioskContext';
import ErrorBoundary from './ErrorBoundary';
import * as THREE from 'three';

// Floor data for City Hall
const floors = [
  { id: 'first', name: 'FIRST FLOOR', model: '/models/first_floor.glb', description: 'Public Services & Reception' },
  { id: 'second', name: 'SECOND FLOOR', model: '/models/second_floor.glb', description: 'City Council & Chambers' },
  { id: 'third', name: 'THIRD FLOOR', model: '/models/attic.glb', description: 'Administrative Offices' },
  { id: 'basement', name: 'BASEMENT', model: '/models/basement.glb', description: 'Parking & Facilities' },
];

// 3D Model Component with proper material handling and centering
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Ensure proper material rendering - dark base, highly visible structures
  scene.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.needsUpdate = true;
        
        // Check if this is the floor/base vs structure based on object name
        const objectName = child.name.toLowerCase();
        const isFloorBase = objectName.includes('floor') || 
                           objectName.includes('base') || 
                           objectName.includes('ground') ||
                           objectName.includes('plane') ||
                           objectName.includes('slab') ||
                           objectName.includes('surface') ||
                           objectName.includes('terrain');
        
        if (isFloorBase) {
          // Make floor/base solid dark
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.color) mat.color.setHex(0x222222);
              if (mat.emissive) mat.emissive.setHex(0x000000);
              if (mat.roughness !== undefined) mat.roughness = 1.0;
              if (mat.metalness !== undefined) mat.metalness = 0.0;
              if (mat.transparent !== undefined) mat.transparent = false;
              if (mat.opacity !== undefined) mat.opacity = 1.0;
            });
          } else {
            if (child.material.color) child.material.color.setHex(0x222222);
            if (child.material.emissive) child.material.emissive.setHex(0x000000);
            if (child.material.roughness !== undefined) child.material.roughness = 1.0;
            if (child.material.metalness !== undefined) child.material.metalness = 0.0;
            if (child.material.transparent !== undefined) child.material.transparent = false;
            if (child.material.opacity !== undefined) child.material.opacity = 1.0;
          }
        } else {
          // Make all other objects white - force override
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat.color) mat.color.setHex(0xffffff);
              if (mat.emissive) mat.emissive.setHex(0x444444);
              if (mat.roughness !== undefined) mat.roughness = 0.1;
              if (mat.metalness !== undefined) mat.metalness = 0.0;
              if (mat.transparent !== undefined) mat.transparent = false;
              if (mat.opacity !== undefined) mat.opacity = 1.0;
            });
          } else {
            if (child.material.color) child.material.color.setHex(0xffffff);
            if (child.material.emissive) child.material.emissive.setHex(0x444444);
            if (child.material.roughness !== undefined) child.material.roughness = 0.1;
            if (child.material.metalness !== undefined) child.material.metalness = 0.0;
            if (child.material.transparent !== undefined) child.material.transparent = false;
            if (child.material.opacity !== undefined) child.material.opacity = 1.0;
          }
        }
      }
    }
  });
  
  // Robust centering - reset everything first
  scene.position.set(0, 0, 0);
  scene.rotation.set(0, 0, 0);
  scene.scale.set(1, 1, 1);
  
  // Calculate bounding box and center
  const box = new THREE.Box3().setFromObject(scene);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  // Center the scene by subtracting the center point
  scene.position.sub(center);
  
  // Update the scene matrix to apply transformations
  scene.updateMatrix();
  scene.updateMatrixWorld();
  
  // Group everything in a parent object for better control
  const group = new THREE.Group();
  group.add(scene.clone());
  group.position.set(0, 0, 0);
  
  return <primitive object={group} scale={6.0} />;
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
  const { language, theme } = useKiosk();

  const currentFloor = floors.find(f => f.id === selectedFloor);

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
                depth: true
              }}
              shadows
              style={{ background: '#FFFFFF' }}
              dpr={window.devicePixelRatio || 1}
            >
              <color attach="background" args={['#FFFFFF']} />
              <fog attach="fog" args={['#FFFFFF', 10, 50]} />
              <ambientLight intensity={0.6} />
              <directionalLight 
                position={[10, 10, 5]} 
                intensity={1.5} 
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-far={50}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
                color="#ffffff"
              />
              <pointLight position={[-10, 10, -5]} intensity={0.3} color="#ffffff" />
              <pointLight position={[10, 5, -10]} intensity={0.3} color="#ffffff" />
              <Suspense fallback={null}>
                <Stage 
                  intensity={0.6}
                  environment="studio"
                  shadows
                  position={[0, 0, 0]}
                  scale={5.5}
                  adjustCamera={false}
                >
                  {currentFloor && <Model url={currentFloor.model} />}
                </Stage>
                <OrbitControls 
                  enablePan={false}
                  minDistance={8}
                  maxDistance={25}
                  autoRotate
                  autoRotateSpeed={0.5}
                  enableDamping
                  dampingFactor={0.1}
                  enableZoom={true}
                  zoomSpeed={0.5}
                  rotateSpeed={0.5}
                  target={[0, -1, 0]}
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
