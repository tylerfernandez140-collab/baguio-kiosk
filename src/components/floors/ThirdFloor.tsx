import * as THREE from 'three';
import ThirdFloorBase, { FloorBaseProps } from './components/ThirdFloorBase';
import { useKiosk } from '../../context/KioskContext';
import { getKioskSettings } from '../../config/kioskConfig';

// Detected mesh objects in attic.glb (from console logs):
// "outline", "city_mayor_office", "city_assessors_office", "center",
// "city__human_resource__management", "multipurpose_hall"
export const thirdFloorLabels: Record<string, string> = {
  // Offices
  city_mayor_office: "City Mayor's\nOffice",
  city_assessors_office: "City Assessor's\nOffice",
  city__human_resource__management: "Human Resource\nManagement",
  multipurpose_hall: "Multipurpose\nHall",
  center: "Center",
  plane: "CR",
  // Note: "outline" is the floor outline mesh — it is not an office and is styled separately.
};

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

export default function ThirdFloor(
  props: Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'>
) {
  const { kioskId } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths = kioskId === 'kiosk_2' ? thirdFloorPathsKiosk2 : thirdFloorPaths;

  return (
    <ThirdFloorBase
      floorId="third"
      url="/models/attic.glb"
      offset={[0, 0, 0]}
      labels={thirdFloorLabels}
      predefinedPaths={settings.showPaths ? paths : {}}
      {...props}
    />
  );
}
