import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import ThirdFloorBase, { FloorBaseProps } from './components/ThirdFloorBase';
import { useKiosk } from '../../context/KioskContext';
import { getKioskSettings } from '../../config/kioskConfig';

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

// Detected mesh objects in attic.glb (from console logs):
// "outline", "city_mayor_office", "city_assessors_office", "center",
// "city__human_resource__management", "multipurpose_hall"


// You can use the Coordinate Detector on the screen to fine-tune these endpoints!
const thirdFloorPaths: Record<string, THREE.Vector3[]> = {


  city__human_resource__management: [
    new THREE.Vector3(-0.95, 0.01, 0.66),
    new THREE.Vector3(-0.95, 0.1, 1.40),
    new THREE.Vector3(-0.6, 0.1, 1.40),
    new THREE.Vector3(-0.6, 0.5, 0.75),
  ],
  multipurpose_hall: [
    new THREE.Vector3(-5.37, 0.01, -2.75),
    new THREE.Vector3(-5.37, 0.5, -0.15),
    new THREE.Vector3(-5.65, 0.5, -0.15),
  ],


};

const thirdFloorPathsKiosk2: Record<string, THREE.Vector3[]> = {
  ...thirdFloorPaths
};

interface ThirdFloorProps extends Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'> {
  onOfficeClick?: (officeId: string, floorId: string, displayName?: string) => void;
  selectedOffice?: string | null;
}

export default function ThirdFloor({
  onOfficeClick,
  selectedOffice,
  ...props
}: ThirdFloorProps) {
  const { kioskId, labels, navigation } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths = kioskId === 'kiosk_2' ? thirdFloorPathsKiosk2 : thirdFloorPaths;

  return (
    <ThirdFloorBase
      floorId="third"
      url="/models/attic.glb"
      offset={[0, 0, 0]}
      labels={labels.third}
      predefinedPaths={settings.showPaths ? paths : {}}
      onOfficeClick={onOfficeClick}
      selectedOffice={selectedOffice}
      {...props}
    >
      {/* Show Stairs Marker when navigation requires taking stairs from this floor */}
      {navigation?.isActive && navigation.steps.some(step => step.type === 'stairs' && step.floorId === 'third' && !step.completed) && (
        <YouAreHere label="TO NEXT FLOOR" position={[-0.95, 0.5, 1.04]} />
      )}
    </ThirdFloorBase>
  );
}
