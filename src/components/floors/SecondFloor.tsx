import * as THREE from 'three';
import SecondFloorBase, { FloorBaseProps } from './components/SecondFloorBase';
import { useKiosk } from '../../context/KioskContext';
import { getKioskSettings } from '../../config/kioskConfig';

// Comprehensive labels for all detected second floor office meshes
export const secondFloorLabels: Record<string, string> = {
  OOTVM: 'Office of the\nVice Mayor',
  CMO: 'City Mayor Office',
  
  // Councilors
  COUN1: 'Committee\non\nPublic\nProtection',
  COUN2: 'Committee\non\nPublic\nUtilities',
  COUN3: 'Committee\non\nTourism',
  COUN4: 'Committee\non\nUrban\nPlanning',
  COUN5: 'Sangguniang\nKabataan\nPederasyon',
  COUN6: 'Committee\non\nEthics',
  COUN7: 'Comittee\non\nLaws and\nGovernance',
  COUN8: 'Committee\non\nHealth',
  COUN9: 'Committee\non\nPublic\nWorks',
  COUN10: 'Committee\non\nMarket',
  COUN11: 'Committee\non\nEmployment',
  COUN12: 'Receiving /\nReleasing',
  COUN13: 'Committee\non\nSocial Services',

  // Administrative & Departments
  CAO: 'City Assessors\nOffice',
  MITD: 'MITD',
  DILG: 'DILG',
  CSO: 'SP\nResearch\nDivision',
  POSD: 'POSD',
  PESO: 'PESO',
  CADO: 'City\nAdminstrator\nOffice',
  CLO: 'City Legal\nOffice',
  PIO: 'Public\nInformation\nOffice',
  MITD001: 'CTOC',
  
  // Facilities & Amenities
  CANTEEN: 'Canteen',
  KITCHEN: 'Kitchen',
  HE: 'HE',
  SHE: 'SHE',
  STENO: 'Stenographers',
  RR: 'Research Room',
  STO: 'Storage',
  OFTC: 'Congressman\nOffice',

  // Restrooms
  CRM: 'Male\nCR',
  CRF: 'Female\nCR',
  CRM001: 'Male\nCR',
  CRF001: 'Female\nCR',
  CRM002: 'Male\nCR',
  CRF002: 'Female\nCR',
};

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

export default function SecondFloor(
  props: Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'>
) {
  const { kioskId } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths = kioskId === 'kiosk_2' ? secondFloorPathsKiosk2 : secondFloorPaths;

  return (
    <SecondFloorBase
      floorId="second"
      url="/models/sekand_floor.glb"
      offset={[0, 0, 0]}
      labels={secondFloorLabels}
      labelSize={6}
      predefinedPaths={settings.showPaths ? paths : {}}
      customLabelPositions={{
        CANTEEN: [-8.56, 0.03, -1.56]
      }}
      {...props}
    />
  );
}
