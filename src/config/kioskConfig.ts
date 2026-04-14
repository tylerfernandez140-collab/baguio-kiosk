import * as THREE from 'three';

export interface KioskSettings {
  firstFloorPosition: [number, number, number];
  showPaths: boolean;
}

export const KIOSK_SETTINGS: Record<string, KioskSettings> = {
  kiosk_1: {
    firstFloorPosition: [2.44, 0.5, 1.56],
    showPaths: true,
  },
  kiosk_2: {
    firstFloorPosition: [-7.8, 1.55, 0.5],
    showPaths: false, // Paths for kiosk 2 being added later
  },
};

export const getKioskSettings = (id: string): KioskSettings => {
  return KIOSK_SETTINGS[id] || KIOSK_SETTINGS.kiosk_1;
};
