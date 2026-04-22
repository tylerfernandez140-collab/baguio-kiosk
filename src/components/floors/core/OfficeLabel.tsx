import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface OfficeLabelProps {
  office: { name: string; position: THREE.Vector3 };
  label: string;
  labelSize: number;
  customPosition?: [number, number, number];
}

export function OfficeLabel({ office, label, labelSize, customPosition }: OfficeLabelProps) {
  return (
    <Html
      position={customPosition ? customPosition : [office.position.x, office.position.y + 0.03, office.position.z]}
      transform
      rotation={[-Math.PI / 2, 0, 0]}
      distanceFactor={8}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div 
        className="text-black font-semibold tracking-tight whitespace-pre-line text-center leading-tight"
        style={{ fontSize: `${labelSize}px` }}
      >
        {label.toUpperCase()}
      </div>
    </Html>
  );
}
