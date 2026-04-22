import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export function CoordinateDetector() {
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
      const floorIntersect = intersects[0];

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
