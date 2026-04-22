import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { LoadingFallback } from './LoadingFallback';

import FirstFloor from '../floors/FirstFloor';
import SecondFloor from '../floors/SecondFloor';
import ThirdFloor from '../floors/ThirdFloor';
import BasementFloor from '../floors/BasementFloor';

interface ThreeDViewerProps {
  currentFloorId?: string;
  isSearchOpen: boolean;
  autoRotate: boolean;
}

export const ThreeDViewer = ({ currentFloorId, isSearchOpen, autoRotate }: ThreeDViewerProps) => {
  const controlsRef = useRef<any>(null);

  const handleCanvasInteraction = (e: any) => {
    // console.log('Canvas interacted:', e);
  };

  return (
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
      onClick={(e) => handleCanvasInteraction(e)}
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
          {currentFloorId === 'first' && <FirstFloor hideLabels={isSearchOpen} />}
          {currentFloorId === 'second' && <SecondFloor hideLabels={isSearchOpen} />}
          {currentFloorId === 'third' && <ThirdFloor hideLabels={isSearchOpen} />}
          {currentFloorId === 'basement' && <BasementFloor hideLabels={isSearchOpen} />}
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
  );
};
