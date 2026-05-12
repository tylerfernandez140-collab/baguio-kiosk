import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { MapPin } from 'lucide-react';
import { useKiosk } from '../../context/KioskContext';
import { getKioskSettings } from '../../config/kioskConfig';
import FirstFloorBase, { FloorBaseProps } from './components/FirstFloorBase';

function YouAreHere({ position, label = 'YOU ARE HERE', isStairs = false }: { position: [number, number, number] | THREE.Vector3, label?: string, isStairs?: boolean }) {
  const pos = Array.isArray(position) ? position : [position.x, position.y, position.z];
  return (
    <Html position={pos as [number, number, number]} center transform sprite distanceFactor={8}>
      <div className="flex flex-col items-center">
        <div className={`text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap animate-bounce ${isStairs ? 'bg-green-600' : 'bg-blue-600'}`}>
          {label}
        </div>
        <div className="relative">
          <MapPin className={`w-8 h-8 filter drop-shadow-md ${isStairs ? 'text-green-600' : 'text-blue-600'}`} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>
    </Html>
  );
}

// Kiosk "You Are Here" starting position
const KIOSK_POSITION = new THREE.Vector3(3.20, 0.001, 2.5);

const HALLWAY_Z = 0.96; // Main hallway Z coordinate

const firstFloorPaths: Record<string, THREE.Vector3[]> = {

  sh: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(6.1, 0.01, 0.96),
    new THREE.Vector3(6.1, 0.01, 2), 
  ],
  aimd: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(8.4, 0.01, 0.96),
    new THREE.Vector3(8.4, 0.01, 2), 
  ],
    city_accountant: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(1.6, 0.01, 0.96),
    new THREE.Vector3(1.6, 0.01, 2),
  ],
    city_auditors: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(-0.4, 0.01, 0.96),
    new THREE.Vector3(-0.4, 0.01, 2),

  ],
      city_auditors_2: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(0.18, 0.01, 0.96),
    new THREE.Vector3(0.18, 0.01, 0.18),
  ],
      licensing: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2, 0.01, 0.96),
    new THREE.Vector3(2, 0.01, 0.18),
  ], 
      cr_male: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(2.86, 0.01, 0.96),
    new THREE.Vector3(2.86, 0.01, 0.18), 
      ], 
      clinic: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(3.15, 0.01, 0.96),
    new THREE.Vector3(3.15, 0.01, -1.47),
      ],    
      mitd: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(4.52, 0.01, 0.96),
    new THREE.Vector3(4.52, 0.01, -1.47),
      ],    
      cr__female: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(4.84, 0.01, 0.96),
    new THREE.Vector3(4.84, 0.01, 0.18),
      ],
      coop: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(4.45, 0.01, 0.96),
    new THREE.Vector3(4.45, 0.01, 0.72), 
      ],          
      sp_admin: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(6.8, 0.01, 0.96),
    new THREE.Vector3(6.8, 0.01, 0.18), 
      ],   
      cdcco: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(8.95, 0.01, 0.96),
    new THREE.Vector3(8.95, 0.01, 0.18), 
      ],   
      city_planning_office: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(10.52, 0.01, 0.96),
    new THREE.Vector3(10.52, 0.01, 0.18), 
      ],
      city_budget_office: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(10.52, 0.01, 0.96),
    new THREE.Vector3(10.52, 0.01, 2), 
      ],     
      city_treasurers: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-1.72, 0.01, 0.96),
    new THREE.Vector3(-1.72, 0.01, -1.92), 
    new THREE.Vector3(-2.65, 0.01, -1.92), 
      ],  
      city_treasurers_2: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 0.96),
    new THREE.Vector3(-3.50, 0.01, 1.9), 
      ],  
      one_stop_shop: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(-7.13, 0.01, 0.96),
    new THREE.Vector3(-7.13, 0.01, 0.15), 
    new THREE.Vector3(-7.90, 0.01, 0.15),
    new THREE.Vector3(-7.90, 0.01, 0.11), 
      ],  
      'cr_one_stop+shop': [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(-7.75, 0.01, 0.96),
    new THREE.Vector3(-7.75, 0.01, -0.70),
    new THREE.Vector3(-9.65, 0.01, -0.70),
      ],
  stairs: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(2.96, 0.01, 0.5),
  ],
  stairs_basement_left: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 0.96),
    new THREE.Vector3(2.90, 0.01, 0.96),
    new THREE.Vector3(-5.75, 0.01, 0.96),
    new THREE.Vector3(-5.75, 0.01, 0.74), 
  ],
  entrance: [
    new THREE.Vector3(3.20, 0.001, 2.5), 
    new THREE.Vector3(3.20, 0.001, 3.65),
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
    new THREE.Vector3(-7.8, 0.01, 0.96),
    new THREE.Vector3(2.93, 0.01, 0.96),
    new THREE.Vector3(2.93, 0.01, 2.98), // Basement stairwell entrance
  ],
  stairs_basement_left: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.8, 0.01, 0.96),
    new THREE.Vector3(2.93, 0.01, 0.96),
    new THREE.Vector3(2.93, 0.01, 2.98), // Basement stairwell entrance
  ],
  entrance: [
    new THREE.Vector3(-7.8, 0.01, 1.55), 
    new THREE.Vector3(-7.8, 0.01, 0.96),
    new THREE.Vector3(2.93, 0.01, 0.96),
    new THREE.Vector3(2.93, 0.01, 2.98), // Basement stairwell entrance
  ],
};

interface FirstFloorProps extends Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'> {
  onOfficeClick?: (officeId: string, floorId: string, displayName?: string) => void;
  selectedOffice?: string | null;
}

export default function FirstFloor({
  onOfficeClick,
  selectedOffice,
  ...props
}: FirstFloorProps) {
  const { kioskId, labels, navigation } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths = kioskId === 'kiosk_2' ? firstFloorPathsKiosk2 : firstFloorPaths;

  return (
    <FirstFloorBase
      floorId="first"
      url="/models/first_floor.glb"
      offset={[0, 0, 0]}
      labels={labels.first}
      customLabelPositions={{
        clinic: [3.15, 0.35, -1.65]
      }}
      predefinedPaths={settings.showPaths ? paths : {}}
      onOfficeClick={onOfficeClick}
      selectedOffice={selectedOffice}
      {...props}
    >
      <YouAreHere position={settings.firstFloorPosition} />
      
      {/* Show Stairs Marker when navigation requires taking stairs from this floor */}
      {(() => {
        if (!navigation?.isActive) return null;
        const stairsStep = navigation.steps.find(step => step.type === 'stairs' && step.floorId === 'first' && !step.completed);
        if (!stairsStep) return null;
        
        // Determine position and label based on direction
        const isGoingUp = ['second', 'third'].includes(navigation.floorId);
        const label = isGoingUp ? 'TO NEXT FLOOR' : 'TO BASEMENT';
        
        // Different stairs locations:
        // - UP to 2nd/3rd floor: main center stairs
        // - DOWN to basement: basement stairwell entrance (black area on right side)
        const stairsPosition: [number, number, number] = isGoingUp 
          ? [2.96, 0.5, 0.5]      // Main stairs UP
          : [2.93, 0.5, 2.98];     // Exact position at basement stairwell entrance
        
        return <YouAreHere label={label} position={stairsPosition} isStairs />;
      })()}
    </FirstFloorBase>
  );
}
