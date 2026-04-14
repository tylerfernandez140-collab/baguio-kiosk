import FloorBase, { FloorBaseProps } from '../FloorBase';

// Comprehensive labels for all detected second floor office meshes
export const secondFloorLabels: Record<string, string> = {
  OOTVM: 'Office of the\nVice Mayor',
  CMO: 'Office of the\nCity Mayor',
  
  // Councilors
  COUN1: 'Councilor\nOffice 1',
  COUN2: 'Councilor\nOffice 2',
  COUN3: 'Councilor\nOffice 3',
  COUN4: 'Councilor\nOffice 4',
  COUN5: 'Councilor\nOffice 5',
  COUN6: 'Councilor\nOffice 6',
  COUN7: 'Councilor\nOffice 7',
  COUN8: 'Councilor\nOffice 8',
  COUN9: 'Councilor\nOffice 9',
  COUN10: 'Councilor\nOffice 10',
  COUN11: 'Councilor\nOffice 11',
  COUN12: 'Councilor\nOffice 12',
  COUN13: 'Councilor\nOffice 13',

  // Administrative & Departments
  CAO: 'City Accountant\nOffice',
  MITD: 'MITD',
  DILG: 'DILG',
  CSO: 'CSO',
  POSD: 'POSD',
  PESO: 'PESO',
  CTO: 'City Treasurer\nOffice',
  CADO: 'City Admin\nOffice',
  CLO: 'City Legal\nOffice',
  PIO: 'Public Info\nOffice',
  
  // Facilities & Amenities
  CANTEEN: 'Canteen',
  KITCHEN: 'Kitchen',
  HE: 'HE',
  SHE: 'SHE',
  STENO: 'Stenographers',
  RR: 'Rest Room',
  STO: 'Storage',
  OFTC: 'Office',

  // Restrooms
  CRM: 'Male\nCR',
  CRF: 'Female\nCR',
  CRM001: 'Male\nCR',
  CRF001: 'Female\nCR',
  CRM002: 'Male\nCR',
  CRF002: 'Female\nCR',
};

export default function SecondFloor(
  props: Omit<FloorBaseProps, 'url' | 'labels' | 'offset'>
) {
  return (
    <FloorBase
      url="/models/second_floor.glb"
      offset={[0, 0, 0]}
      labels={secondFloorLabels}
      {...props}
    />
  );
}
