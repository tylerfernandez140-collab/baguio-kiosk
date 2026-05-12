import { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html, useGLTF, Line } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useKiosk } from '../../../context/KioskContext';
import CameraAnimation from '../../CameraAnimation';
import { getOfficeImageFilename } from '../../../data/floorLabels';

// Component to display office image from Supabase or fallback to local
function OfficeImage({ officeId, floorId, alt, offices, labels }: { officeId: string; floorId: string; alt: string; offices: any[]; labels: Record<string, string> }) {
  // Get the display label from floor_labels (label_text) using the 3D object name
  const displayLabel = labels[officeId] || labels[officeId.toLowerCase()];
  
  // Find office in Supabase data by matching offices.name with floor_labels.label_text
  const officeData = offices.find(o => {
    if (o.floor_id !== floorId) return false;
    // Match against the display label (label_text)
    if (displayLabel && o.name === displayLabel) return true;
    // Fallback: try direct match
    if (o.name?.toLowerCase() === officeId.toLowerCase()) return true;
    return false;
  });
  
  // Use Supabase image_url if available, otherwise fallback to local image
  const imageUrl = officeData?.image_url || `/${getOfficeImageFilename(officeId)}.jpg`;
  
  return (
    <img
      key={imageUrl}
      src={imageUrl}
      alt={alt}
      className="w-full h-24 object-cover rounded mb-2"
      style={{ display: 'block' }}
      onError={(e) => {
        console.error('Image failed to load:', imageUrl);
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

// 3D Model Component with proper material handling and centering
function Model({
  url,
  offset = [0, 0, 0],
  onSelectOffice,
  onLoadMarkers,
  selectedOfficeName,
}: {
  url: string;
  offset?: [number, number, number];
  onSelectOffice?: (name: string | null, position: THREE.Vector3) => void;
  onLoadMarkers?: (
    markers: { 
      name: string; 
      position: THREE.Vector3;
      size: THREE.Vector3;
      center: THREE.Vector3;
    }[]
  ) => void;
  selectedOfficeName?: string | null;
}) {
  const { scene } = useGLTF(url);
  const isLoadedRef = useRef(false);
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    const clickedObject = event.object;
    
    // Ignore base geometry
    const name = clickedObject.name.toLowerCase();
    const isBase = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor', 'outline', 'center'].some(ignored => name.includes(ignored));
    
    if (isBase) {
      onSelectOffice?.(null, new THREE.Vector3());
      return;
    }
    
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
        const isOutline = name.includes('outline');
        const isCenter = name.includes('center');
        const isCube = name.includes('cube');
        const isStairs = name.includes('stairs');
        const isFloorBase = ['ground', 'base', 'floor'].some(ignored => name.includes(ignored)) || name === 'plane001' || name === 'plane.001';
        const isBase = isOutline || isFloorBase || isStairs || isCube;

        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.clickable = !isBase;

        // Clone materials to prevent shared material color bleed between meshes
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat: any) => mat.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }

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

          if (isOutline) {
            mat.color?.setHex(0x000000); // Outline = Black
          } else if (isCube) {
            mat.color?.setHex(0x8B4513); // Cube = Brown
            mat.polygonOffset = true;
            mat.polygonOffsetFactor = -1;
            mat.polygonOffsetUnits = -4;
          } else if (isStairs) {
            mat.color?.setHex(0x90EE90); // Stairs = Light Green
          } else if (isFloorBase) {
            mat.color?.setHex(0x004700); // Base = Green
          } else if (isCenter) {
            mat.color?.setHex(0xFFFF00); // Center = Yellow
          } else {
            mat.color?.setHex(0xffffff); // Offices = White
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
          // plane001 is base (ignored), plane is office (detectable)
          const isIgnored = ['ground', 'stairs', 'base', 'floor', 'outline', 'cube', 'center'].some(ignored => name.includes(ignored)) || name === 'plane001' || name === 'plane.001';

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
            console.log(`Mesh: ${child.name} at Position:`, markerPos);
          }
        }
      });

      if (detectedMarkers.length > 0) {
        console.log(`Scan Complete for: ${url}`, detectedMarkers.length, "markers found");
        console.log("Mesh names found:", detectedMarkers.map(m => m.name));
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

  // Handle selected office highlighting
  useEffect(() => {
    wrapper.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const isSelected = selectedOfficeName && name === selectedOfficeName.toLowerCase();
        
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat: any) => {
          if (!mat) return;
          
          if (isSelected) {
            mat.color.setHex(0x38bdf8); // Highlight Light Blue
          } else {
            // Reset to original colors
            const isOutline = name.includes('outline');
            const isCenter = name.includes('center');
            const isCube = name.includes('cube');
            const isStairs = name.includes('stairs');
            const isFloorBase = ['ground', 'base', 'floor'].some(ignored => name.includes(ignored)) || name === 'plane001' || name === 'plane.001';
            
            if (isOutline) {
              mat.color.setHex(0x000000);
            } else if (isCube) {
              mat.color.setHex(0x8B4513);
            } else if (isStairs) {
              mat.color.setHex(0x90EE90);
            } else if (isFloorBase) {
              mat.color.setHex(0x004700);
            } else if (isCenter) {
              mat.color.setHex(0xFFFF00);
            } else {
              mat.color.setHex(0xffffff);
            }
          }
          mat.needsUpdate = true;
        });
      }
    });
  }, [selectedOfficeName, wrapper]);

  return (
    <primitive
      object={wrapper}
      onClick={handleClick}
      onPointerMissed={() => onSelectOffice?.(null, new THREE.Vector3())}
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
        return true;
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
  const [arrows, setArrows] = useState<{ position: THREE.Vector3; rotation: THREE.Euler; opacity: number }[]>([]);
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
      const rotation = new THREE.Euler(0, Math.atan2(direction.x, direction.z), 0);
      
      segs.push({ start, end, length, direction, rotation });
    }
    return segs;
  }, [points]);

  const totalLength = useMemo(() => segments.reduce((sum, s) => sum + s.length, 0), [segments]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const arrowSpacing = 1.5; 
    const speed = 1.5;
    const fadeZone = 0.6; // Distance for fade-in at start and fade-out at end
    
    // Calculate how many arrows fit without overlapping
    const arrowCount = Math.max(1, Math.floor(totalLength / arrowSpacing));
    
    const newArrows = [];
    for (let i = 0; i < arrowCount; i++) {
      // Improved distribution logic with a small starting offset
      const animatedDist = (i * arrowSpacing + time * speed) % totalLength;
      
      const targetDist = animatedDist;
      let opacity = 1;
      
      // Smooth fade-in at the beginning of the path
      if (targetDist < fadeZone) {
        opacity = Math.min(1, targetDist / fadeZone);
      }
      // Smooth fade-out at the end of the path
      else if (targetDist > totalLength - fadeZone) {
        opacity = Math.min(1, (totalLength - targetDist) / fadeZone);
      }
      
      // Find which segment the arrow is in and handle rotation smoothing
      let currentDist = 0;
      for (let j = 0; j < segments.length; j++) {
        const seg = segments[j];
        if (targetDist >= currentDist && targetDist <= currentDist + seg.length) {
          const segProgress = (targetDist - currentDist) / seg.length;
          const pos = new THREE.Vector3().lerpVectors(seg.start, seg.end, segProgress);
          
          // Rotation smoothing logic
          let targetRotationY = seg.rotation.y;
          const smoothingDist = 0.4; 
          
          if (seg.length - (targetDist - currentDist) < smoothingDist && j < segments.length - 1) {
            const nextSeg = segments[j + 1];
            const mix = (smoothingDist - (seg.length - (targetDist - currentDist))) / smoothingDist;
            
            let nextRot = nextSeg.rotation.y;
            while (nextRot - targetRotationY > Math.PI) nextRot -= Math.PI * 2;
            while (nextRot - targetRotationY < -Math.PI) nextRot += Math.PI * 2;
            
            targetRotationY = targetRotationY + (nextRot - targetRotationY) * mix;
          }
          
          pos.y += 0.07;
          
          newArrows.push({ 
            position: pos, 
            rotation: new THREE.Euler(0, targetRotationY, 0), 
            opacity 
          });
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
        color="#dc2626"
        lineWidth={2}
        transparent
        opacity={0.2}
      />
      {arrows.map((arrow, i) => (
        <group key={`arrow-${i}`} position={arrow.position} rotation={[0, arrow.rotation.y, 0]}>
          {/* Red arrow shaft - flat on ground pointing along Z */}
          <mesh position={[0, 0.01, 0.15]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.12, 0.02, 0.3]} />
            <meshBasicMaterial color="#dc2626" transparent opacity={0.95 * arrow.opacity} />
          </mesh>
          {/* Red arrow head - flat on ground, touching the shaft, pointing forward */}
          <mesh position={[0, 0.01, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.15, 0.28, 3]} />
            <meshBasicMaterial color="#dc2626" transparent opacity={0.95 * arrow.opacity} />
          </mesh>
          
          {/* Darker red inner arrow */}
          <mesh position={[0, 0.012, 0.15]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.09, 0.02, 0.26]} />
            <meshBasicMaterial color="#991b1b" transparent opacity={0.9 * arrow.opacity} />
          </mesh>
          <mesh position={[0, 0.012, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.11, 0.24, 3]} />
            <meshBasicMaterial color="#991b1b" transparent opacity={0.9 * arrow.opacity} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export interface FloorBaseProps {
  floorId: string;
  url: string;
  labels: Record<string, string>;
  offset?: [number, number, number];
  children?: React.ReactNode;
  predefinedPaths?: Record<string, THREE.Vector3[]>;
  labelSize?: number;
  customLabelPositions?: Record<string, [number, number, number]>;
  hideLabels?: boolean;
  onOfficeClick?: (officeId: string, floorId: string, displayName?: string) => void;
  selectedOffice?: string | null;
}

export default function FloorBase({
  floorId,
  url,
  labels,
  offset = [0, 0, 0],
  children,
  predefinedPaths = {},
  labelSize = 5,
  customLabelPositions = {},
  hideLabels = false,
  onOfficeClick,
  selectedOffice: selectedOfficeProp,
}: FloorBaseProps) {
  const { navigation, startNavigation, clearNavigation, offices } = useKiosk();
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

  // Sync active path with global navigation target
  useEffect(() => {
    if (!navigation) {
      setActivePath(null);
      return;
    }

    if (navigation.floorId === floorId) {
      // Find matching path on the current floor
      const normalizedName = navigation.officeId.toLowerCase();
      const pathKey = Object.keys(predefinedPaths).find(key => 
        key.toLowerCase() === normalizedName
      );
      if (pathKey) {
        setActivePath(predefinedPaths[pathKey]);
      } else {
        setActivePath(null);
      }
    } else if (floorId === 'first') {
      // If we are on first floor and target is elsewhere, show stairs
      if (predefinedPaths['stairs']) {
        setActivePath(predefinedPaths['stairs']);
      } else {
        setActivePath(null);
      }
    } else {
      setActivePath(null);
    }
  }, [navigation, floorId, predefinedPaths]);

  const handleGetDirection = (officeName: string) => {
    startNavigation(floorId, officeName, getOfficeLabel(officeName));
  };

  const getOfficeLabel = (name: string) => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 1. Try case-insensitive exact match first
    const exactKey = Object.keys(labels).find(key => key.toLowerCase() === name.toLowerCase());
    if (exactKey) return String(labels[exactKey]).replace(/\\n/g, '\n');

    // 2. Try removing numeric suffix (.001 or _001) only if no exact match found
    const baseName = name.toLowerCase().replace(/[._]\d+$/, "");
    const baseKey = Object.keys(labels).find(key => key.toLowerCase() === baseName);
    if (baseKey) return String(labels[baseKey]).replace(/\\n/g, '\n');

    // 3. Try normalized match (remove all special chars)
    const matchingKey = Object.keys(labels).find(key => 
      key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedName
    );
    
    if (matchingKey) return String(labels[matchingKey]).replace(/\\n/g, '\n');
    
    // 4. Fallback to raw name
    return name.replace(/[_+]/g, '\n');
  };

  const effectiveSelectedOfficeName = useMemo(() => {
    if (navigation?.isActive) return navigation.officeId;
    return selectedOffice?.name || selectedOfficeProp || null;
  }, [navigation, selectedOffice, selectedOfficeProp]);

  return (
    <>
      <Model
        url={url}
        offset={offset}
        selectedOfficeName={effectiveSelectedOfficeName}
        onSelectOffice={(name: string | null, position: THREE.Vector3) => {
        if (navigation?.isActive) {
          // If navigation is active, only allow clearing by clicking empty space
          if (!name) {
            setSelectedOffice(null);
          }
        } else {
          // If navigation is not active, allow selecting any office
          if (name) {
            setSelectedOffice({ name, position });
            // Call the onOfficeClick prop with raw object name and display label
            onOfficeClick?.(name, floorId, getOfficeLabel(name));
          } else {
            setSelectedOffice(null);
          }
        }
      }}
        onLoadMarkers={setOfficeMarkers}
      />
      
      {!hideLabels && officeMarkers.map((office, index) => (
        <Html
          key={`${url}-label-${index}`}
          position={
            customLabelPositions[office.name] 
              ? customLabelPositions[office.name] 
              : [
                  office.position.x,
                  office.position.y + 0.15,
                  office.position.z,
                ]
          }
          transform
          rotation={[-Math.PI / 2, 0, 0]}
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div 
            className="text-black font-semibold tracking-tight whitespace-pre-line text-center leading-tight"
            style={{ fontSize: `${labelSize}px` }}
          >
            {getOfficeLabel(office.name).toUpperCase()}
          </div>
        </Html>
      ))}
      
      {activePath && (
        <AnimatedPath points={activePath} />
      )}
      
      {/* Camera Animation - follows the active path during navigation */}
      <CameraAnimation 
        path={activePath || undefined}
        enabled={!!navigation?.isActive}
        animationDuration={2000}
      />
      
      {children}
    </>
  );
}
