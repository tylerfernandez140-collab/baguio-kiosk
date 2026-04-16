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
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
  ],
  c_auditors_o: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
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
