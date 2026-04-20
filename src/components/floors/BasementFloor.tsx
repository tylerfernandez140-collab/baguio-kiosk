import * as THREE from 'three';
import BasementFloorBase, { FloorBaseProps } from './components/BasementFloorBase';

export const basementFloorLabels: Record<string, string> = {
  gso: 'Persons with\nDisabilities Affairs Office',
  c_auditors_o: 'City\nLegal Office',
  ba: 'Brgy\nAffairs',
  pr: 'Power\nRoom',
  councilor: 'Councilor',
  ofortod: 'Office of the\nRegistry of Deeds',
  ceapmo: 'City Environment and Park\nManagement Office',
  stairs: 'Stairs',
  kit: 'Kitchen',
  lounge: 'Lounge',
  daycare: 'Daycare',
  sports: 'Sports',
  cube: 'Cube',
};

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
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-2.90, 0.01, 3.09),
  ],
  councilor: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-4.00, 0.01, 0.96),
  ],
  ofortod: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-6.00, 0.01, 0.96),
  ],
  ceapmo: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-8.00, 0.01, 0.96),
  ],
  kit: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(5.00, 0.01, 0.96),
  ],
  lounge: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(7.00, 0.01, 0.96),
  ],
  daycare: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(9.00, 0.01, 0.96),
  ],
  sports: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 1.50),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(10.00, 0.01, 0.96),
  ],
  cube: [
    new THREE.Vector3(2.40, 0.01, 1.74),
    new THREE.Vector3(2.40, 0.01, 1.50),
  ],
};

export default function BasementFloor(
  props: Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset' | 'predefinedPaths'>
) {
  return (
    <BasementFloorBase
      floorId="basement"
      url="/models/basement.glb"
      offset={[0, 0, 0]}
      labels={basementFloorLabels}
      predefinedPaths={basementPaths}
      {...props}
    />
  );
}
