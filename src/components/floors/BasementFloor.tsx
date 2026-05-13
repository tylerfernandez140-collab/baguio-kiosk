import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import BasementFloorBase, { FloorBaseProps } from './components/BasementFloorBase';
import { useKiosk } from '../../context/KioskContext';

function YouAreHere({ position, label = 'TO NEXT FLOOR' }: { position: [number, number, number] | THREE.Vector3, label?: string }) {
  const pos = Array.isArray(position) ? position : [position.x, position.y, position.z];
  return (
    <Html position={pos as [number, number, number]} center transform sprite distanceFactor={8}>
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
 daycare: [
    new THREE.Vector3(-6.7, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -3.5),
    new THREE.Vector3(-8.76, 0.01, -3.5),

  ],
  sports: [
    new THREE.Vector3(-6.7, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -2.15),
    new THREE.Vector3(-8.76, 0.01, -2.15),
  ],
  cube: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
  ],
};

const basementPathsKiosk2: Record<string, THREE.Vector3[]> = {
  gso: [
    new THREE.Vector3(-6.67, 0.9, 0.53),
    new THREE.Vector3(-8.56, 0.1, 0.53),
    new THREE.Vector3(-8.56, 0.01, 1.9),
    new THREE.Vector3(-6.67, 0.01, 1.9),
    new THREE.Vector3(-6.67, 0.01, 4.9),
    new THREE.Vector3(-5.2, 0.01, 4.9),
    new THREE.Vector3(-5.2, 0.01, 3.5),
  ],
  c_auditors_o: [
    new THREE.Vector3(-6.67, 0.9, 0.53),
    new THREE.Vector3(-8.56, 0.1, 0.53),
    new THREE.Vector3(-8.56, 0.01, 1.9),
    new THREE.Vector3(-6.67, 0.01, 1.9),
    new THREE.Vector3(-6.67, 0.01, 4.9),
    new THREE.Vector3(-2.55, 0.01, 4.9),
    new THREE.Vector3(-2.55, 0.01, 3.09),
  ],
  ba: [
    new THREE.Vector3(-6.67, 0.9, 0.53),
    new THREE.Vector3(-8.56, 0.1, 0.53),
    new THREE.Vector3(-8.56, 0.01, 1.9),
    new THREE.Vector3(-6.67, 0.01, 1.9),
    new THREE.Vector3(-6.67, 0.01, 4.9),
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
  daycare: [
    new THREE.Vector3(-6.7, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -3.5),
    new THREE.Vector3(-8.76, 0.01, -3.5),

  ],
  sports: [
    new THREE.Vector3(-6.7, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -0.8),
    new THREE.Vector3(-9.14, 0.01, -2.15),
    new THREE.Vector3(-8.76, 0.01, -2.15),
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
  const { labels, navigation, kioskId } = useKiosk();

  const paths = kioskId === 'kiosk_2' ? basementPathsKiosk2 : basementPaths;

  return (
    <BasementFloorBase
      floorId="basement"
      url="/models/basement.glb"
      offset={[0, 0, 0]}
      labels={labels.basement}
      predefinedPaths={paths}
      onOfficeClick={onOfficeClick}
      selectedOffice={selectedOffice}
      {...props}
    >
      {/* Show Stairs Marker when navigation requires taking stairs from this floor */}
      {navigation?.isActive && navigation.steps.some(step => step.type === 'stairs' && step.floorId === 'basement' && !step.completed) && (
        <YouAreHere 
          label="TO NEXT FLOOR" 
          position={kioskId === 'kiosk_2' ? [-6.7, 1.4, 0.98] : [2.6, 1.4, 4.9]} 
        />
      )}
    </BasementFloorBase>
  );
}
