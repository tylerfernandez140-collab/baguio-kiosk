import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import FloorBase, { FloorBaseProps } from '../FloorBase';

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
  city_auditors: 'City\nAuditors',
  city_treasurers_2: 'City Treasurers\nOffice',
  city_auditors_2: 'Commission on Audit',
  cr_male: 'Male\nCR',
  cr_female: 'Female\nCR',
  licensing: 'Licensing\nOffice',
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
    new THREE.Vector3(2.44, 0.01, 1.56), // You Are Here
    new THREE.Vector3(3.21, 0.01, 1.6),
    new THREE.Vector3(3.26, 0.01, 0.77),
    new THREE.Vector3(6.23, 0.01, 0.82),
    new THREE.Vector3(6.26, 0.01, 1.15), // Session Hall
  ],
};

export default function FirstFloor(
  props: Omit<FloorBaseProps, 'url' | 'labels' | 'offset'>
) {
  return (
    <FloorBase
      url="/models/first_floor.glb"
      offset={[0, 0, 0]}
      labels={firstFloorLabels}
      predefinedPaths={firstFloorPaths}
      {...props}
    >
      <YouAreHere position={[2.44, 0.5, 1.56]} />
    </FloorBase>
  );
}
