import * as THREE from 'three';
import { useKiosk } from '../../context/KioskContext';



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

import FloorBase from './core/FloorBase';

export default function BasementFloor(
  props: any
) {
  const { labels } = useKiosk();

  return (
    <FloorBase
      floorId="basement"
      url="/models/basement.glb"
      offset={[0, 0, 0]}
      labels={labels.basement}
      predefinedPaths={basementPaths}
      {...props}
    />
  );
}
