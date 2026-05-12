import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import SecondFloorBase, { FloorBaseProps } from './components/SecondFloorBase';
import { useKiosk } from '../../context/KioskContext';
import { getKioskSettings } from '../../config/kioskConfig';

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

// Comprehensive labels for all detected second floor office meshes


const secondFloorPaths: Record<string, THREE.Vector3[]> = {
  CMO: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(0.39, 0.01, 1.07),
    new THREE.Vector3(0.43, 0.01, 1.74),
  ],
    CRM: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(1.6, 0.01, 1.04),
    new THREE.Vector3(1.6, 0.01, 0.3),
  ],
    COUN4: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(1, 0.01, 1.04),
    new THREE.Vector3(1, 0.01, 0.3),
  ],
    COUN3: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(0.15, 0.01, 1.04),
    new THREE.Vector3(0.15, 0.01, 0.3),
  ],
    COUN2: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-0.60, 0.01, 1.04),
    new THREE.Vector3(-0.60, 0.01, 0.3),
  ],
    COUN1: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-1.35, 0.01, 1.04),
    new THREE.Vector3(-1.35, 0.01, 0.3),
  ],
    OOTVM: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-2.30, 0.01, 1.04),
    new THREE.Vector3(-2.30, 0.01, 0.3),
  ],
    CLO: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-3.70, 0.01, 1.04),
    new THREE.Vector3(-3.70, 0.01, 0.3),
  ],
    PIO: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-5.55, 0.01, 0.70),
    new THREE.Vector3(-5.55, 0.01, 0.10),
  ],
    CRM002: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.7, 0.01, 1.04),
    new THREE.Vector3(-4.7, 0.01, -2.40),
  ],
    CRF002: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.7, 0.01, 1.04),
    new THREE.Vector3(-4.7, 0.01, -2),
    new THREE.Vector3(-4.9, 0.01, -2),
  ],
    CANTEEN: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01,-0.3),
    new THREE.Vector3(-7.6, 0.01, -0.3),
  ],
    HE: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01,-0.3),
    new THREE.Vector3(-10.2, 0.01, -0.3),
    new THREE.Vector3(-10.2, 0.01, -0.8),
    new THREE.Vector3(-10.35, 0.01, -0.8),
  ],
    SHE: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01,-0.3),
    new THREE.Vector3(-10.2, 0.01, -0.3),
    new THREE.Vector3(-10.2, 0.01, -1.25),
    new THREE.Vector3(-10.35, 0.01, -1.25),
  ],
    KITCHEN: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01,-0.3),
    new THREE.Vector3(-9.60, 0.01, -0.3),
    new THREE.Vector3(-9.60, 0.01, -1.33),
  ],
    STO: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01,-0.3),
    new THREE.Vector3(-9.60, 0.01, -0.3),
    new THREE.Vector3(-9.60, 0.01, -2.1),
    new THREE.Vector3(-9.75, 0.01, -2.1),
    new THREE.Vector3(-9.75, 0.01, -2.5),
  ],
    CADO: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-5.8, 0.01, 0.70),
    new THREE.Vector3(-5.8, 0.01, 1.25),
  ],
    PESO: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-2.75, 0.01, 1.04),
    new THREE.Vector3(-2.75, 0.01, 1.9),
  ],
    COUN13: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-2.05, 0.01, 1.04),
    new THREE.Vector3(-2.05, 0.01, 1.9),
  ],
    OFTC: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-0.75, 0.01, 1.04),
    new THREE.Vector3(-0.75, 0.01, 1.9),
  ],
    CRF: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(3.8, 0.01, 1.04),
    new THREE.Vector3(3.8, 0.01, 0.3),
  ],
    CAO: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(6.2, 0.01, 1.04),
    new THREE.Vector3(6.2, 0.01, 0.3),
  ],
      MITD: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(8.97, 0.01, 1.04),
    new THREE.Vector3(8.97, 0.01, 0.3),
  ],
      DILG: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, -2.4),
    new THREE.Vector3(9.6, 0.01, -2.4),
  ],
      CRM001: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, -3.07),
    new THREE.Vector3(10.18, 0.01, -3.07),
  ],
      CRF001: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, -2.4),
    new THREE.Vector3(10.5, 0.01, -2.4),
  ],
      CSO: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, -1.45),
    new THREE.Vector3(10.5, 0.01, -1.45),
  ],
      RR: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, -0.38),
    new THREE.Vector3(10.5, 0.01, -0.38),
  ],
      STENO: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 0.38),
    new THREE.Vector3(10.5, 0.01, 0.38),
  ],
      COUN5: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.25),  
    new THREE.Vector3(10.5, 0.01, 1.25),
  ],  
      COUN6: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 2.15),
    new THREE.Vector3(10.5, 0.01, 2.15),
  ],
      COUN7: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 3.1),
    new THREE.Vector3(10.5, 0.01, 3.1),
  ],
      POSD: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 1.04),
    new THREE.Vector3(9.95, 0.01, 3.96),
    new THREE.Vector3(10.5, 0.01, 3.96),
  ],
      COUN12: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(4, 0.01, 1.04),
    new THREE.Vector3(4, 0.01, 1.8),
  ],
      COUN11: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(5, 0.01, 1.04),
    new THREE.Vector3(5, 0.01, 1.8),
  ],
      COUN10: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(5.88, 0.01, 1.04),
    new THREE.Vector3(5.88, 0.01, 1.8),
  ],
      COUN9: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(6.65, 0.01, 1.04),
    new THREE.Vector3(6.65, 0.01, 1.8),
  ],
      COUN8: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(7.5, 0.01, 1.04),
    new THREE.Vector3(7.5, 0.01, 1.8),
  ],
      MITD001: [
    new THREE.Vector3(3.25, 0.01, -0.14),
    new THREE.Vector3(3.25, 0.01, 1.04),
    new THREE.Vector3(8.18, 0.01, 1.04),
    new THREE.Vector3(8.18, 0.01, 1.8),
  ],
  stairs: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 1.04),
    new THREE.Vector3(-4.55, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01, 0.70),
    new THREE.Vector3(-6.9, 0.01,-1.09),
  ],
  stairs_hr: [
    new THREE.Vector3(2.14, 0.01, -0.14),
    new THREE.Vector3(2.13, 0.01, 1.04),
    new THREE.Vector3(-1.65, 0.01, 1.04),
    new THREE.Vector3(-1.65, 0.01, 1.96),
  ],
};


const secondFloorPathsKiosk2: Record<string, THREE.Vector3[]> = {
  ...secondFloorPaths
};

interface SecondFloorProps extends Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'> {
  onOfficeClick?: (officeId: string, floorId: string, displayName?: string) => void;
  selectedOffice?: string | null;
}

export default function SecondFloor({
  onOfficeClick,
  selectedOffice,
  ...props
}: SecondFloorProps) {
  const { kioskId, labels, navigation } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths = kioskId === 'kiosk_2' ? secondFloorPathsKiosk2 : secondFloorPaths;

  return (
    <SecondFloorBase
      floorId="second"
      url="/models/sekand_floor.glb"
      offset={[0, 0, 0]}
      labels={labels.second}
      labelSize={6}
      predefinedPaths={settings.showPaths ? paths : {}}
      onOfficeClick={onOfficeClick}
      selectedOffice={selectedOffice}
      {...props}
    >
      {/* Show Stairs Marker when navigation requires taking stairs from this floor */}
      {(() => {
        if (!navigation?.isActive) return null;
        const hasStairsStep = navigation.steps.some(step => step.type === 'stairs' && step.floorId === 'second' && !step.completed);
        if (!hasStairsStep) return null;
        
        // Determine which stairs to use based on target office
        let stairsPosition: [number, number, number];
        const targetOffice = navigation.officeId.toLowerCase();
        
        // HR office uses HR stairs, others use back stairs
        if (targetOffice.includes('human_resource') || targetOffice.includes('hr')) {
          stairsPosition = [-1.65, 0.5, 1.96]; // HR stairs
        } else {
          stairsPosition = [-6.9, 0.5, -1.09]; // Back stairs to 3rd floor
        }
        
        return <YouAreHere label="TO NEXT FLOOR" position={stairsPosition} />;
      })()}
    </SecondFloorBase>
  );
}
