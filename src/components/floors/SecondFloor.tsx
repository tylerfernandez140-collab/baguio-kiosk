import * as THREE from "three";
import { Html } from "@react-three/drei";
import { MapPin } from "lucide-react";
import SecondFloorBase, { FloorBaseProps } from "./components/SecondFloorBase";
import { useKiosk } from "../../context/KioskContext";
import { getKioskSettings } from "../../config/kioskConfig";

function YouAreHere({
  position,
  label = "TO NEXT FLOOR",
}: {
  position: [number, number, number] | THREE.Vector3;
  label?: string;
}) {
  const pos = Array.isArray(position)
    ? position
    : [position.x, position.y, position.z];
  return (
    <Html
      position={pos as [number, number, number]}
      center
      transform
      sprite
      distanceFactor={8}
    >
      <div className="flex flex-col items-center">
        <div
          className={`text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg mb-1 whitespace-nowrap animate-bounce ${label.includes("LANDING") ? "bg-blue-600" : "bg-green-600"}`}
        >
          {label}
        </div>
        <div className="relative">
          <MapPin
            className={`w-8 h-8 filter drop-shadow-md ${label.includes("LANDING") ? "text-blue-600" : "text-green-600"}`}
          />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
        </div>
      </div>
    </Html>
  );
}

// Comprehensive labels for all detected second floor office meshes

const secondFloorPaths: Record<string, THREE.Vector3[]> = {
  CMO: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(1.57, 0.01, 0.6),
    new THREE.Vector3(1.57, 0.01, 1.33),
  ],
  CRM: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(1.76, 0.01, 0.6),
    new THREE.Vector3(1.76, 0.01, -0.16),
  ],
  COUN4: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(1.15, 0.01, 0.6),
    new THREE.Vector3(1.15, 0.01, -0.16),
  ],
  COUN3: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(0.35, 0.01, 0.6),
    new THREE.Vector3(0.35, 0.01, -0.16),
  ],
  COUN2: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(0.44, 0.01, 0.6),
    new THREE.Vector3(0.44, 0.01, -0.16),
  ],
  COUN1: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-1.2, 0.01, 0.6),
    new THREE.Vector3(-1.2, 0.01, -0.16),
  ],
  OOTVM: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-2.2, 0.01, 0.6),
    new THREE.Vector3(-2.2, 0.01, -0.16),
  ],
  CLO: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-3.6, 0.01, 0.6),
    new THREE.Vector3(-3.6, 0.01, -0.16),
  ],
  PIO: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, -1.33),
    new THREE.Vector3(-5.7, 0.01, -1.33),
  ],
  CRM002: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, -3.12),
    new THREE.Vector3(-5.24, 0.01, -3.12),
  ],
  CRF002: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, -2.58),
    new THREE.Vector3(-5.7, 0.01, -2.58),
  ],
  CANTEEN: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-7.6, 0.01, 0.06),
    new THREE.Vector3(-7.6, 0.01, -0.76),
    new THREE.Vector3(-8.3, 0.01, -0.76),
  ],
  CADO: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-5.75, 0.01, 0.08),
    new THREE.Vector3(-5.75, 0.01, 0.73),
  ],
  PESO: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-2.62, 0.01, 0.6),
    new THREE.Vector3(-2.62, 0.01, 1.33),
  ],
  COUN13: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-1.88, 0.01, 0.6),
    new THREE.Vector3(-1.88, 0.01, 1.33),
  ],
  OFTC: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-0.65, 0.01, 0.6),
    new THREE.Vector3(-0.65, 0.01, 1.33),
  ],
  CRF: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(3.9, 0.01, 0.6),
    new THREE.Vector3(3.9, 0.01, -0.16),
  ],
  CAO: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(6.35, 0.01, 0.6),
    new THREE.Vector3(6.35, 0.01, -0.16),
  ],
  MITD: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(9.15, 0.01, 0.6),
    new THREE.Vector3(9.15, 0.01, -0.16),
  ],
  DILG: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -2.79),
    new THREE.Vector3(9.77, 0.01, -2.79),
  ],
  CRM001: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -2.9),
    new THREE.Vector3(10.9, 0.01, -2.9),
    new THREE.Vector3(10.9, 0.01, -3.3),
  ],
  CRF001: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -3),
    new THREE.Vector3(11.05, 0.01, -3),
  ],
  CSO: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -2),
    new THREE.Vector3(11.05, 0.01, -2),
  ],
  RR: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -0.87),
    new THREE.Vector3(11.05, 0.01, -0.87),
  ],
  STENO: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -0.1),
    new THREE.Vector3(11.05, 0.01, -0.1),
  ],
  COUN5: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.84),
    new THREE.Vector3(11.05, 0.01, 0.84),
  ],
  COUN6: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 1.61),
    new THREE.Vector3(11.05, 0.01, 1.61),
  ],
  COUN7: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 2.55),
    new THREE.Vector3(11.05, 0.01, 2.55),
  ],
  POSD: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 3.45),
    new THREE.Vector3(11.05, 0.01, 3.45),
  ],
  COUN12: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(4.24, 0.01, 0.6),
    new THREE.Vector3(4.24, 0.01, 1.33),
  ],
  COUN11: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(5.14, 0.01, 0.6),
    new THREE.Vector3(5.14, 0.01, 1.33),
  ],
  COUN10: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(6.02, 0.01, 0.6),
    new THREE.Vector3(6.02, 0.01, 1.33),
  ],
  COUN9: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(6.8, 0.01, 0.6),
    new THREE.Vector3(6.8, 0.01, 1.33),
  ],
  COUN8: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(7.57, 0.01, 0.6),
    new THREE.Vector3(7.57, 0.01, 1.33),
  ],
  MITD001: [
    new THREE.Vector3(3.4, 0.01, -0.76),
    new THREE.Vector3(3.4, 0.01, 0.6),
    new THREE.Vector3(8.35, 0.01, 0.6),
    new THREE.Vector3(8.35, 0.01, 1.33),
  ],
  stairs: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-7.56, 0.01, -1.57),
  ],
  stairs_hr: [
    new THREE.Vector3(2.3, 0.01, -0.76),
    new THREE.Vector3(2.3, 0.01, 0.6),
    new THREE.Vector3(-1.5, 0.01, 0.6),
    new THREE.Vector3(-1.5, 0.01, 1.5),
  ],
};

const secondFloorPathsKiosk2: Record<string, THREE.Vector3[]> = {
  CMO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(1.57, 0.01, 0.6),
    new THREE.Vector3(1.57, 0.01, 1.33),
  ],
  CRM: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(1.76, 0.01, 0.6),
    new THREE.Vector3(1.76, 0.01, -0.16),
  ],
  COUN4: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(1.15, 0.01, 0.6),
    new THREE.Vector3(1.15, 0.01, -0.16),
  ],
  COUN3: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(0.35, 0.01, 0.6),
    new THREE.Vector3(0.35, 0.01, -0.16),
  ],
  COUN2: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(0.44, 0.01, 0.6),
    new THREE.Vector3(0.44, 0.01, -0.16),
  ],
  COUN1: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-1.2, 0.01, 0.6),
    new THREE.Vector3(-1.2, 0.01, -0.16),
  ],
  stairs_hr: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-1.5, 0.01, 0.6),
    new THREE.Vector3(-1.5, 0.01, 1.5),
  ],
  OOTVM: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-2.2, 0.01, 0.6),
    new THREE.Vector3(-2.2, 0.01, -0.16),
  ],
  CLO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-3.6, 0.01, 0.6),
    new THREE.Vector3(-3.6, 0.01, -0.21),

  ],
  PIO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, -1.33),
    new THREE.Vector3(-5.7, 0.01, -1.33),
  ],
  CRM002: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, -3.12),
    new THREE.Vector3(-5.24, 0.01, -3.12),
  ],
  CRF002: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, -2.58),
    new THREE.Vector3(-5.7, 0.01, -2.58),
  ],
  CANTEEN: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, -0.76),
    new THREE.Vector3(-8.32, 0.01, -0.76),
  ],
  CADO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-5.75, 0.01, 0.08),
    new THREE.Vector3(-5.75, 0.01, 0.73),
  ],
  PESO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-2.62, 0.01, 0.6),
    new THREE.Vector3(-2.62, 0.01, 1.33),
  ],
  COUN13: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-1.88, 0.01, 0.6),
    new THREE.Vector3(-1.88, 0.01, 1.33),
  ],
  OFTC: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(-0.65, 0.01, 0.6),
    new THREE.Vector3(-0.65, 0.01, 1.33),
  ],
  CRF: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(3.9, 0.01, 0.6),
    new THREE.Vector3(3.9, 0.01, -0.16),
  ],
  CAO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(6.35, 0.01, 0.6),
    new THREE.Vector3(6.35, 0.01, -0.16),
  ],
  MITD: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(9.15, 0.01, 0.6),
    new THREE.Vector3(9.15, 0.01, -0.16),
  ],
  DILG: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -2.79),
    new THREE.Vector3(9.77, 0.01, -2.79),
  ],
  CRM001: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -2.9),
    new THREE.Vector3(10.9, 0.01, -2.9),
    new THREE.Vector3(10.9, 0.01, -3.3),
  ],
  CRF001: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -3),
    new THREE.Vector3(11.05, 0.01, -3),
  ],
  CSO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -2),
    new THREE.Vector3(11.05, 0.01, -2),
  ],
  RR: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -0.87),
    new THREE.Vector3(11.05, 0.01, -0.87),
  ],
  STENO: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, -0.1),
    new THREE.Vector3(11.05, 0.01, -0.1),
  ],
  COUN5: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.84),
    new THREE.Vector3(11.05, 0.01, 0.84),
  ],
  COUN6: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 1.61),
    new THREE.Vector3(11.05, 0.01, 1.61),
  ],
  COUN7: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 2.55),
    new THREE.Vector3(11.05, 0.01, 2.55),
  ],
  POSD: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 0.6),
    new THREE.Vector3(10.5, 0.01, 3.45),
    new THREE.Vector3(11.05, 0.01, 3.45),
  ],
  COUN12: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(4.24, 0.01, 0.6),
    new THREE.Vector3(4.24, 0.01, 1.33),
  ],
  COUN11: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(5.14, 0.01, 0.6),
    new THREE.Vector3(5.14, 0.01, 1.33),
  ],
  COUN10: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(6.02, 0.01, 0.6),
    new THREE.Vector3(6.02, 0.01, 1.33),
  ],
  COUN9: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(6.8, 0.01, 0.6),
    new THREE.Vector3(6.8, 0.01, 1.33),
  ],
  COUN8: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(7.57, 0.01, 0.6),
    new THREE.Vector3(7.57, 0.01, 1.33),
  ],
  MITD001: [
    new THREE.Vector3(-7.56, 0.01, -1.57),
    new THREE.Vector3(-7.56, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.06),
    new THREE.Vector3(-4.7, 0.01, 0.6),
    new THREE.Vector3(8.35, 0.01, 0.6),
    new THREE.Vector3(8.35, 0.01, 1.33),
  ],
  stairs: [
    new THREE.Vector3(-7.85, 0.1, -1.5),
    new THREE.Vector3(-7.85, 0.01, -1),
    new THREE.Vector3(-7.3, 0.01, -1),
    new THREE.Vector3(-7.3, 0.01, -1.5),

  ],
};

interface SecondFloorProps extends Omit<
  FloorBaseProps,
  "floorId" | "url" | "labels" | "offset"
> {
  onOfficeClick?: (
    officeId: string,
    floorId: string,
    displayName?: string,
  ) => void;
  selectedOffice?: string | null;
}

export default function SecondFloor({
  onOfficeClick,
  selectedOffice,
  ...props
}: SecondFloorProps) {
  const { kioskId, labels, navigation } = useKiosk();
  const settings = getKioskSettings(kioskId);

  const paths =
    kioskId === "kiosk_2" ? secondFloorPathsKiosk2 : secondFloorPaths;

  return (
    <SecondFloorBase
      floorId="second"
      url="/models/sekand_floor.glb"
      offset={[0, 0, 0]}
      labels={labels.second}
      labelSize={6}
      customLabelPositions={{
        CANTEEN: [-8.9, 0.35, -1.9],
      }}
      predefinedPaths={settings.showPaths ? paths : {}}
      onOfficeClick={onOfficeClick}
      selectedOffice={selectedOffice}
      {...props}
    >
      {/* Show Stairs Marker when navigation requires taking stairs from this floor */}
      {(() => {
        if (!navigation?.isActive) return null;
        const hasStairsStep = navigation.steps.some(
          (step) =>
            step.type === "stairs" &&
            step.floorId === "second" &&
            !step.completed,
        );
        if (!hasStairsStep) return null;

        // Determine which stairs to use based on target office
        let stairsPosition: [number, number, number];
        const targetOffice = navigation.officeId.toLowerCase();

        // HR office uses HR stairs, others use back stairs
        if (
          targetOffice.includes("human_resource") ||
          targetOffice.includes("hr")
        ) {
          stairsPosition = [-1.65, 0.5, 1.96]; // HR stairs
        } else {
          stairsPosition = [-6.9, 0.5, -1.09]; // Back stairs to 3rd floor
        }

        return <YouAreHere label="TO NEXT FLOOR" position={stairsPosition} />;
      })()}
    </SecondFloorBase>
  );
}
