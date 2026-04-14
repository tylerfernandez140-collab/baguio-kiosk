import FloorBase, { FloorBaseProps } from '../FloorBase';

// Add and modify basement floor specific labels here following the format below:
export const basementFloorLabels: Record<string, string> = {
  parking: 'City Parking',
  facilities: 'Facilities\nManagement',
  cr_male: 'Male\nCR',
  cr_female: 'Female\nCR',
};

export default function BasementFloor(
  props: Omit<FloorBaseProps, 'url' | 'labels' | 'offset'>
) {
  return (
    <FloorBase
      url="/models/basement.glb"
      offset={[0, 0, 0]}
      labels={basementFloorLabels}
      {...props}
    />
  );
}
