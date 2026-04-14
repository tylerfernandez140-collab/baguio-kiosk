import SecondFloorBase, { FloorBaseProps } from './components/SecondFloorBase';

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

export default function SecondFloor(
  props: Omit<FloorBaseProps, 'url' | 'labels' | 'offset'>
) {
  return (
    <SecondFloorBase
      url="/models/second_floor.glb"
      offset={[0, 0, 0]}
      labels={secondFloorLabels}
      labelSize={6}
      customLabelPositions={{
        CANTEEN: [-8.56, 0.03, -1.56]
      }}
      {...props}
    />
  );
}
