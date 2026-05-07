import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import BasementFloorBase, { FloorBaseProps } from './components/BasementFloorBase';
import { useKiosk } from '../../context/KioskContext';

function YouAreHere({ position, label = 'TO NEXT FLOOR' }: { position: [number, number, number] | THREE.Vector3, label?: string }) {
  const pos = Array.isArray(position) ? position : [position.x, position.y, position.z];
  return (
    <Html position={pos as [number, number, number]} center>
      <div className="flex flex-col items-center">
        <div className={`text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap animate-bounce ${label.includes('LANDING') ? 'bg-blue-600' : 'bg-green-600'}`}>
          {label}
        </div>
        <div className="relative">
          <MapPin className={`w-8 h-8 filter drop-shadow-md ${label.includes('LANDING') ? 'text-blue-600' : 'text-green-600'}`} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>
    </Html>
  );
}

const basementPaths: Record<string, THREE.Vector3[]> = {
gso: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(-5.2, 0.01, 4.9),
    new THREE.Vector3(-5.2, 0.01, 3.5),
  ],
  c_auditors_o: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(-2.55, 0.01, 4.9),
    new THREE.Vector3(-2.55, 0.01, 3.09),
  ],
  ba: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(-0.4, 0.01, 4.9),
    new THREE.Vector3(-0.4, 0.01, 3.09),
  ],
  pr: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(3.97, 0.01, 4.9),
    new THREE.Vector3(3.97, 0.01, 2.65),
  ],
  councilor: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(3.97, 0.01, 4.9),
    new THREE.Vector3(3.97, 0.01, 3.06),
    new THREE.Vector3(5.3, 0.01, 3.06),
    new THREE.Vector3(5.3, 0.01, 2.44),

  ],
  ofortod: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(3.97, 0.01, 4.9),
    new THREE.Vector3(3.97, 0.01, 3.06),
    new THREE.Vector3(7.5, 0.01, 3.06),
    new THREE.Vector3(7.5, 0.01, 2.07),
  ],
  ceapmo: [
    new THREE.Vector3(2.6, 0.9, 3.8),
    new THREE.Vector3(2.6, 0.1, 4.9),
    new THREE.Vector3(3.97, 0.01, 4.9),
    new THREE.Vector3(3.97, 0.01, 3.06),
    new THREE.Vector3(9.5, 0.01, 3.06),
    new THREE.Vector3(9.5, 0.01, 1.55),
    new THREE.Vector3(10.33, 0.01, 1.55),

  ],
  kit: [
    new THREE.Vector3(-6.7, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.08),
    new THREE.Vector3(-9.07, 0.01, 0.08),
    new THREE.Vector3(-9.07, 0.01, -0.29),
    new THREE.Vector3(-9.86, 0.01, -0.29),

  ],
  lounge: [
    new THREE.Vector3(-6.7, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.08),
    new THREE.Vector3(-9.07, 0.01, 0.08),
    new THREE.Vector3(-9.07, 0.01, -0.29),
    new THREE.Vector3(-9.48, 0.01, -0.29),
    new THREE.Vector3(-9.48, 0.01, -0.54),

  ],
  daycare: [
    new THREE.Vector3(-6.7, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.08),
    new THREE.Vector3(-9.07, 0.01, 0.08),
    new THREE.Vector3(-9.07, 0.01, -1.67),
    new THREE.Vector3(-8.77, 0.01, -1.67),
  ],
  sports: [
    new THREE.Vector3(-6.7, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, 0.98),
    new THREE.Vector3(-8.15, 0.01, -0.03),
  ],
  cube: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
  ],
};

interface BasementFloorProps extends Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'> {
  onOfficeClick?: (officeId: string, floorId: string, displayName?: string) => void;
  selectedOffice?: string | null;
}

export default function BasementFloor({
  onOfficeClick,
  selectedOffice,
  ...props
}: BasementFloorProps) {
  const { labels, navigation } = useKiosk();

  return (
    <BasementFloorBase
      floorId="basement"
      url="/models/basement.glb"
      offset={[0, 0, 0]}
      labels={labels.basement}
      predefinedPaths={basementPaths}
      onOfficeClick={onOfficeClick}
      selectedOffice={selectedOffice}
      {...props}
    >
      {/* Show Stairs Marker when navigation requires taking stairs from this floor */}
      {navigation?.isActive && navigation.steps.some(step => step.type === 'stairs' && step.floorId === 'basement' && !step.completed) && (
        <YouAreHere label="TO NEXT FLOOR" position={[2.6, 1.4, 4.9]} />
      )}
    </BasementFloorBase>
  );
}
