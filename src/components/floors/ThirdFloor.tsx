import ThirdFloorBase, { FloorBaseProps } from './components/ThirdFloorBase';

// Detected mesh objects in attic.glb (from console logs):
// "outline", "city_mayor_office", "city_assessors_office", "center",
// "city__human_resource__management", "multipurpose_hall"
export const thirdFloorLabels: Record<string, string> = {
  // Offices
  city_mayor_office: "City Mayor's\nOffice",
  city_assessors_office: "City Assessor's\nOffice",
  city__human_resource__management: "Human Resource\nManagement",
  multipurpose_hall: "Multipurpose\nHall",
  center: "Center",
  plane:"CR",
  

  // Note: "outline" is the floor outline mesh — it is not an office and is styled separately.
};

export default function ThirdFloor(
  props: Omit<FloorBaseProps, 'floorId' | 'url' | 'labels' | 'offset'>
) {
  return (
    <ThirdFloorBase
      floorId="third"
      url="/models/attic.glb"
      offset={[0, 0, 0]}
      labels={thirdFloorLabels}
      {...props}
    />
  );
}
