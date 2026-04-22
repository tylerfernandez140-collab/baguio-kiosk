import React, { useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function AnimatedPath({ points }: { points: THREE.Vector3[] }) {
  const [arrows, setArrows] = useState<{ position: THREE.Vector3; rotation: THREE.Euler; opacity: number }[]>([]);
  
  const segments = useMemo(() => {
    const segs = [];
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const length = start.distanceTo(end);
      const direction = new THREE.Vector3().subVectors(end, start).normalize();
      const angle = Math.atan2(direction.x, direction.z);
      const rotation = new THREE.Euler(0, angle, 0);
      segs.push({ start, end, length, direction, rotation });
    }
    return segs;
  }, [points]);

  const totalLength = useMemo(() => segments.reduce((sum, s) => sum + s.length, 0), [segments]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const arrowSpacing = 0.8;
    const speed = 1.5;
    const fadeInDistance = 0.3;
    const arrowCount = Math.max(3, Math.floor(totalLength / arrowSpacing));
    
    const newArrows = [];
    for (let i = 0; i < arrowCount; i++) {
      const baseDist = i * arrowSpacing;
      const animatedDist = (baseDist + time * speed) % (totalLength + fadeInDistance);
      
      let targetDist = animatedDist;
      let opacity = 1;
      
      if (animatedDist > totalLength) {
        targetDist = animatedDist - totalLength;
        opacity = Math.min(1, targetDist / fadeInDistance);
      }
      
      let currentDist = 0;
      for (const seg of segments) {
        if (targetDist >= currentDist && targetDist <= currentDist + seg.length) {
          const segProgress = (targetDist - currentDist) / seg.length;
          const pos = new THREE.Vector3().lerpVectors(seg.start, seg.end, segProgress);
          pos.y += 0.05;
          newArrows.push({ position: pos, rotation: seg.rotation, opacity });
          break;
        }
        currentDist += seg.length;
      }
    }
    setArrows(newArrows);
  });

  return (
    <>
      {arrows.map((arrow, i) => (
        <group key={`arrow-${i}`} position={arrow.position} rotation={[0, arrow.rotation.y, 0]}>
          <mesh position={[0, 0.01, 0.1]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.16]} />
            <meshBasicMaterial color="#dc2626" transparent opacity={0.95 * arrow.opacity} />
          </mesh>
          <mesh position={[0, 0.01, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.12, 3]} />
            <meshBasicMaterial color="#dc2626" transparent opacity={0.95 * arrow.opacity} />
          </mesh>
          <mesh position={[0, 0.02, 0.1]}>
            <boxGeometry args={[0.04, 0.02, 0.14]} />
            <meshBasicMaterial color="#991b1b" transparent opacity={0.9 * arrow.opacity} />
          </mesh>
          <mesh position={[0, 0.02, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.04, 0.1, 3]} />
            <meshBasicMaterial color="#991b1b" transparent opacity={0.9 * arrow.opacity} />
          </mesh>
        </group>
      ))}
    </>
  );
}
