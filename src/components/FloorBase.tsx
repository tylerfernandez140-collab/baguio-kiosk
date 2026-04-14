import { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html, useGLTF, Line } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';

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
  const isLoadedRef = useRef(false);
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    const clickedObject = event.object;
    
    // Ignore base geometry
    const name = clickedObject.name.toLowerCase();
    const isBase = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor'].some(ignored => name.includes(ignored));
    
    if (isBase) return;
    
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

  // Memoize the processed scene to prevent recreation on every render
  const wrapper = useMemo(() => {
    isLoadedRef.current = false; // Reset loaded flag on url/offset change
    const clonedScene = scene.clone(true);

    clonedScene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const isBase = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor'].some(ignored => name.includes(ignored));
        
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.clickable = !isBase;

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

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    
    const group = new THREE.Group();
    group.add(clonedScene);
    clonedScene.position.set(-center.x, -center.y, -center.z);
    group.position.set(...offset);
    group.scale.set(5.5, 5.5, 5.5);
    
    return group;
  }, [scene, url, JSON.stringify(offset)]);

  // Detect markers whenever the scene/url changes
  useEffect(() => {
    if (!onLoadMarkers) return;
    
    const scanMarkers = () => {
      const detectedMarkers: { 
        name: string; 
        position: THREE.Vector3; 
        size: THREE.Vector3; 
        center: THREE.Vector3; 
      }[] = [];

      wrapper.updateMatrixWorld(true);
      
      wrapper.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const name = child.name.toLowerCase();
          const isIgnored = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor'].some(ignored => name.includes(ignored));

          if (!isIgnored) {
            const childBox = new THREE.Box3().setFromObject(child);
            const localCenter = new THREE.Vector3();
            childBox.getCenter(localCenter);
            const size = new THREE.Vector3();
            childBox.getSize(size);
            
            const markerPos = new THREE.Vector3(
              localCenter.x,
              childBox.max.y + 0.3,
              localCenter.z
            );
            
            detectedMarkers.push({
              name: child.name,
              position: markerPos,
              size: size,
              center: localCenter,
            });
          }
        }
      });

      if (detectedMarkers.length > 0) {
        console.log(`Scan Complete for: ${url}`, detectedMarkers.length, "markers found");
        onLoadMarkers(detectedMarkers);
        isLoadedRef.current = true;
      }
    };

    // Initial scan
    scanMarkers();

    // Re-scan after a short delay to ensure everything is settled
    const timeout = setTimeout(scanMarkers, 100);
    return () => clearTimeout(timeout);
  }, [url, wrapper, onLoadMarkers]);

  return (
    <primitive
      object={wrapper}
      onClick={handleClick}
    />
  );
}

function CoordinateDetector() {
  const { raycaster, scene, camera, gl } = useThree();
  const [data, setData] = useState<{ x: number; z: number; screenX: number; screenY: number; visible: boolean }>({
    x: 0,
    z: 0,
    screenX: 0,
    screenY: 0,
    visible: false
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      const floorIntersect = intersects.find(intersect => {
        const name = intersect.object.name.toLowerCase();
        return name.includes('floor') || name.includes('ground') || name.includes('base') || name.includes('slab');
      });

      if (floorIntersect) {
        const point = floorIntersect.point;
        setData({
          x: Number(point.x.toFixed(2)),
          z: Number(point.z.toFixed(2)),
          screenX: event.clientX,
          screenY: event.clientY,
          visible: true
        });
      } else {
        setData(prev => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, gl, raycaster, scene]);

  if (!data.visible) return null;

  return (
    <Html
      style={{
        position: 'fixed',
        left: data.screenX + 15,
        top: data.screenY + 15,
        pointerEvents: 'none',
        zIndex: 1000
      }}
      calculatePosition={() => [0, 0, 0]}
    >
      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-xl border border-white/20 backdrop-blur-sm min-w-[80px]">
        <div className="flex justify-between gap-4">
          <span className="text-blue-400">X:</span>
          <span>{data.x}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-green-400">Z:</span>
          <span>{data.z}</span>
        </div>
      </div>
    </Html>
  );
}

function AnimatedPath({ points }: { points: THREE.Vector3[] }) {
  const [arrows, setArrows] = useState<{ position: THREE.Vector3; rotation: THREE.Euler }[]>([]);
  const lineRef = useRef<any>(null);
  
  // Calculate segments and total length
  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const length = start.distanceTo(end);
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      
      // Calculate rotation for arrows
      const rotation = new THREE.Euler(0, Math.atan2(direction.x, direction.z) + Math.PI / 2, 0);
      
      segs.push({ start, end, length, direction, rotation });
    }
    return segs;
  }, [points]);

  const totalLength = useMemo(() => segments.reduce((sum, s) => sum + s.length, 0), [segments]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const arrowCount = Math.max(5, Math.floor(totalLength * 3)); // 3 arrows per unit length
    const speed = 1.5;
    
    const newArrows = [];
    for (let i = 0; i < arrowCount; i++) {
      // Progress from 0 to 1, offset by time and index
      const progress = ((time * speed + (i / arrowCount) * totalLength) % totalLength) / totalLength;
      const targetDist = progress * totalLength;
      
      // Find which segment the arrow is in
      let currentDist = 0;
      let found = false;
      for (const seg of segments) {
        if (targetDist >= currentDist && targetDist <= currentDist + seg.length) {
          const segProgress = (targetDist - currentDist) / seg.length;
          const pos = new THREE.Vector3().lerpVectors(seg.start, seg.end, segProgress);
          
          // Lift arrow slightly above the line
          pos.y += 0.05;
          
          newArrows.push({ position: pos, rotation: seg.rotation });
          found = true;
          break;
        }
        currentDist += seg.length;
      }
    }
    setArrows(newArrows);
  });

  return (
    <>
      <Line
        points={points}
        color="#3b82f6"
        lineWidth={6}
        transparent
        opacity={0.6}
      />
      {arrows.map((arrow, i) => (
        <mesh key={`arrow-${i}`} position={arrow.position} rotation={arrow.rotation}>
          <coneGeometry args={[0.08, 0.2, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </>
  );
}

export interface FloorBaseProps {
  url: string;
  labels: Record<string, string>;
  offset?: [number, number, number];
  children?: React.ReactNode;
  predefinedPaths?: Record<string, THREE.Vector3[]>;
}

export default function FloorBase({
  url,
  labels,
  offset = [0, 0, 0],
  children,
  predefinedPaths = {},
}: FloorBaseProps) {
  const [officeMarkers, setOfficeMarkers] = useState<{ name: string; position: THREE.Vector3 }[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<{
    name: string;
    position: THREE.Vector3;
  } | null>(null);

  const [activePath, setActivePath] = useState<THREE.Vector3[] | null>(null);

  // Clear markers and selection on url change to ensure a clean state
  useEffect(() => {
    setOfficeMarkers([]);
    setSelectedOffice(null);
    setActivePath(null);
  }, [url]);

  const handleGetDirection = (officeName: string) => {
    // Find matching path (case-insensitive and normalized)
    const normalizedName = officeName.toLowerCase();
    const pathKey = Object.keys(predefinedPaths).find(key => 
      key.toLowerCase() === normalizedName
    );
    
    if (pathKey) {
      setActivePath(predefinedPaths[pathKey]);
    }
  };

  const getOfficeLabel = (name: string) => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exactMatch = labels[name.toLowerCase().replace(/[._]\d+$/, "")] || labels[name.toLowerCase()];
    if (exactMatch) return exactMatch;

    const matchingKey = Object.keys(labels).find(key => 
      key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedName
    );
    
    if (matchingKey) return labels[matchingKey];
    return name.replace(/[_+]/g, '\n');
  };

  return (
    <>
      <Model
        url={url}
        offset={offset}
        onSelectOffice={(name, position) => setSelectedOffice({ name, position })}
        onLoadMarkers={setOfficeMarkers}
      />
      
      {officeMarkers.map((office, index) => (
        <Html
          key={`${url}-label-${index}`}
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
          <div className="text-black text-[8px] font-semibold tracking-tight whitespace-pre-line text-center leading-tight">
            {getOfficeLabel(office.name).toUpperCase()}
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
            <div className="bg-red-500 rounded relative shadow-lg flex flex-col items-center justify-center px-3 py-2 min-w-[120px]">
              <span className="text-white text-sm font-bold text-center leading-tight whitespace-pre-line mb-2">
                {getOfficeLabel(selectedOffice.name).toUpperCase()}
              </span>
              
              {predefinedPaths[Object.keys(predefinedPaths).find(key => key.toLowerCase() === selectedOffice.name.toLowerCase()) || ""] && (
                <button
                  onClick={() => handleGetDirection(selectedOffice.name)}
                  className="bg-white text-red-500 text-[10px] font-bold px-3 py-1 rounded-full hover:bg-red-50 hover:scale-105 transition-all w-full pointer-events-auto shadow-md"
                >
                  GET DIRECTION
                </button>
              )}
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-500"></div>
          </div>
        </Html>
      )}
      
      {activePath && (
        <AnimatedPath points={activePath} />
      )}
      {children}
      <CoordinateDetector />
    </>
  );
}
