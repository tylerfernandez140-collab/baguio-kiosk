import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { getKioskSettings } from '../../config/kioskConfig';
import FirstFloorBase, { FloorBaseProps } from './components/FirstFloorBase';



function YouAreHere({ position, label = 'YOU ARE HERE' }: { position: [number, number, number] | THREE.Vector3, label?: string }) {
  const pos = Array.isArray(position) ? position : [position.x, position.y, position.z];
  return (
    <Html position={pos as [number, number, number]} center>
      <div className="flex flex-col items-center">
        <div className={`text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap animate-bounce ${label.includes('HERE') ? 'bg-blue-600' : 'bg-green-600'}`}>
          {label}
        </div>
        <div className="relative">
          <MapPin className={`w-8 h-8 filter drop-shadow-md ${label.includes('HERE') ? 'text-blue-600' : 'text-green-600'}`} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>
    </Html>
  );
}

// Kiosk "You Are Here" starting position
const KIOSK_POSITION = new THREE.Vector3(2.44, 0.01, 1.56);

const HALLWAY_Z = 0.96; // Main hallway Z coordinate

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
      city_treasurers: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.7), 
      ],  
      city_treasurers_2: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 1.20), 
      ],  
      one_stop_shop: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-7.75, 0.01, 0.96),
    new THREE.Vector3(-7.75, 0.01, 0.47), 
      ],  
      'cr_one_stop+shop': [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-7.75, 0.01, 0.96),
    new THREE.Vector3(-7.75, 0.01, -0.70),
    new THREE.Vector3(-9.65, 0.01, -0.70),
      ],
  stairs: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.96, 0.01, 1.72),
    new THREE.Vector3(2.96, 0.01, 0.5),
  ],
  stairs_basement_left: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-5.75, 0.01, 0.96),
    new THREE.Vector3(-5.75, 0.01, 0.74), 
  ],
  entrance: [
    new THREE.Vector3(2.40, 0.01, 1.74), 
    new THREE.Vector3(2.90, 0.01, 1.74),
    new THREE.Vector3(2.90, 0.01, 3.65),
  ],

};

// Kiosk 2 "You Are Here" starting position
const KIOSK_2_POSITION = new THREE.Vector3(-7.8, 0.01, 1.55);
const HALLWAY_Z_K2 = 0.96;

const firstFloorPathsKiosk2: Record<string, THREE.Vector3[]> = {
  session_hall: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(5.72, 0.01, 0.96),
    new THREE.Vector3(5.72, 0.01, 1.15), 
  ],
  city_accountant: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(0.62, 0.01, 0.96),
    new THREE.Vector3(0.62, 0.01, 1.15), 
  ],
  city_auditors: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(-1.35, 0.01, 0.96),
    new THREE.Vector3(-1.35, 0.01, 1.15), 
  ],
  city_auditors_2: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(-0.75, 0.01, 0.96),
    new THREE.Vector3(-0.75, 0.01, 0.70), 
  ],
  licensing: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(1, 0.01, 0.96),
    new THREE.Vector3(1, 0.01, 0.70), 
  ], 
  cr_male: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(1.95, 0.01, 0.96),
    new THREE.Vector3(1.95, 0.01, 0.70), 
  ], 
  clinic: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(2.23, 0.01, 0.96),
    new THREE.Vector3(2.23, 0.01, -0.75),
    new THREE.Vector3(2.10, 0.01, -0.75), 
  ],    
  mitd: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(3.60, 0.01, 0.96),
    new THREE.Vector3(3.60, 0.01, -1), 
  ],    
  cr__female: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(3.90, 0.01, 0.96),
    new THREE.Vector3(3.90, 0.01, 0.72), 
  ],
  coop: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(4.45, 0.01, 0.96),
    new THREE.Vector3(4.45, 0.01, 0.72), 
  ],          
  sp_admin: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(6.25, 0.01, 0.96),
    new THREE.Vector3(6.25, 0.01, 0.72), 
  ],   
  cdcc: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(8.20, 0.01, 0.96),
    new THREE.Vector3(8.20, 0.01, 0.72), 
  ],   
  city_planning_office: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 0.72), 
  ],
  city_budget_office: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 0.96),
    new THREE.Vector3(9.65, 0.01, 1.20), 
  ],     
  city_treasurers: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.75, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.7), 
  ],  
  city_treasurers_2: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.75, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 1.20), 
  ],  
  one_stop_shop: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.75, 0.01, 0.47), 
  ],  
  'cr_one_stop+shop': [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.75, 0.01, -0.70),
    new THREE.Vector3(-9.65, 0.01, -0.70),
  ],
  stairs: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.80, 0.01, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.5),
  ],
  stairs_basement: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.8, 0.01, 2.50),
  ],
  stairs_basement_left: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.8, 0.01, 2.50),
  ],
  entrance: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.8, 0.01, 2.50),
  ],
};

export default function FirstFloor(
  props: Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'>
) {
  const { kioskId, labels, navigation } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths = kioskId === 'kiosk_2' ? firstFloorPathsKiosk2 : firstFloorPaths;

  return (
    <FirstFloorBase
      floorId="first"
      url="/models/first_floor.glb"
      offset={[0, 0, 0]}
      labels={labels.first}
      predefinedPaths={settings.showPaths ? paths : {}}
      {...props}
    >
      <YouAreHere position={settings.firstFloorPosition} />
      
      {/* Show Stairs Marker when going to another floor */}
      {navigation?.isActive && navigation.floorId !== 'first' && (
        <YouAreHere label="TO NEXT FLOOR" position={[2.96, 0.5, 0.5]} />
      )}
    </FirstFloorBase>
  );
}
