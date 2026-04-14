import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import FirstFloorBase, { FloorBaseProps } from './components/FirstFloorBase';

export const firstFloorLabels: Record<string, string> = {
  city_treasurers: 'City Treasurer',
  city_planning_office: 'Planning and\nDevelopment Office ',
  session_hall: 'Session Hall',
  clinic: 'Clinic',
  mitd: 'MITD',
  coop: 'Coop',
  sp_admin: 'SP Admin',
  cdcc: 'CDCC\nOffice',
  city_budget_office: 'City Budget\nOffice',
  city_accountant: 'City Accountant',
  city_auditors: 'commission \non\nAudits',
  city_treasurers_2: 'City Treasurers\nOffice',
  city_auditors_2: 'Commission \non Audits',
  cr_male: 'Male\nCR',
  cr_female: 'Female\nCR',
  licensing: 'Permits and \nLicensing\nOffice',
  one_stop_shop: 'One Stop Shop',
  cr_one_stop_shop: 'One Stop Shop\nCR',
};

function YouAreHere({ position }: { position: [number, number, number] }) {
  return (
    <Html position={position} center>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap animate-bounce">
          YOU ARE HERE
        </div>
        <div className="relative">
          <MapPin className="w-8 h-8 text-blue-600 filter drop-shadow-md" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>
    </Html>
  );
}

const firstFloorPaths: Record<string, THREE.Vector3[]> = {
  session_hall: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(5.72, 0.01, 0.96),
    new THREE.Vector3(5.72, 0.01, 1.15), 
  ],
    city_accountant: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(0.62, 0.01, 0.96),
    new THREE.Vector3(0.62, 0.01, 1.15), 
  ],
    city_auditors: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-1.35, 0.01, 0.96),
    new THREE.Vector3(-1.35, 0.01, 1.15), 
  ],
      city_auditors_2: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-0.75, 0.01, 0.96),
    new THREE.Vector3(-0.75, 0.01, 0.70), 
  ],
      licensing: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(1, 0.01, 0.96),
    new THREE.Vector3(1, 0.01, 0.70), 
  ], 
      cr_male: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(1.95, 0.01, 0.96),
    new THREE.Vector3(1.95, 0.01, 0.70), 
      ], 
      clinic: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(2.23, 0.01, 0.96),
    new THREE.Vector3(2.23, 0.01, -0.75),
    new THREE.Vector3(2.10, 0.01, -0.75), 
      ],    
      mitd: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(3.60, 0.01, 0.96),
    new THREE.Vector3(3.60, 0.01, -1), 
      ],    
      cr__female: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(3.90, 0.01, 0.96),
    new THREE.Vector3(3.90, 0.01, 0.72), 
      ],
      coop: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(4.45, 0.01, 0.96),
    new THREE.Vector3(4.45, 0.01, 0.72), 
      ],          
      sp_admin: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(6.25, 0.01, 0.96),
    new THREE.Vector3(6.25, 0.01, 0.72), 
      ],   
      cdcc: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(8.20, 0.01, 0.96),
    new THREE.Vector3(8.20, 0.01, 0.72), 
      ],   
      city_planning_office: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 0.72), 
      ],
      city_budget_office: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 1.20), 
      ],     
};

export default function FirstFloor(
  props: Omit<FloorBaseProps, 'url' | 'labels' | 'offset'>
) {
  return (
    <FirstFloorBase
      url="/models/first_floor.glb"
      offset={[0, 0, 0]}
      labels={firstFloorLabels}
      predefinedPaths={firstFloorPaths}
      {...props}
    >
      <YouAreHere position={[2.44, 0.5, 1.56]} />
    </FirstFloorBase>
  );
}
