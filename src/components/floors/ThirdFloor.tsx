import FloorBase, { FloorBaseProps } from '../FloorBase';

// Add and modify third floor specific labels here following the format below:
export const thirdFloorLabels: Record<string, string> = {
  engineering: 'City Engineering\nOffice',
  assessor: 'City Assessor\nOffice',
  bplo: 'Business Permits\n& Licensing',
  cr_male: 'Male\nCR',
  cr_female: 'Female\nCR',
};

export default function ThirdFloor(
  props: Omit<FloorBaseProps, 'url' | 'labels' | 'offset'>
) {
  return (
    <FloorBase
      url="/models/attic.glb"
      offset={[0, 0, 0]}
      labels={thirdFloorLabels}
      {...props}
    />
  );
}
