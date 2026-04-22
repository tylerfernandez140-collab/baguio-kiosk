import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface OfficePopupProps {
  name: string;
  label: string;
  position: THREE.Vector3;
  hasPath: boolean;
  onGetDirection: (name: string) => void;
}

export function OfficePopup({ name, label, position, hasPath, onGetDirection }: OfficePopupProps) {
  return (
    <Html position={[position.x, position.y + 0.8, position.z]} center>
      <div className="relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-red-500 rounded relative shadow-lg flex flex-col items-center justify-center px-3 py-2 min-w-[120px]">
          <span className="text-white text-sm font-bold text-center leading-tight whitespace-pre-line mb-2">
            {label.toUpperCase()}
          </span>
          
          {hasPath && (
            <button
              onClick={() => onGetDirection(name)}
              className="bg-white text-red-500 text-[10px] font-bold px-3 py-1 rounded-full hover:bg-red-50 hover:scale-105 transition-all w-full shadow-md"
            >
              GET DIRECTION
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-500"></div>
      </div>
    </Html>
  );
}
