import * as THREE from 'three';

export interface KioskSettings {
  firstFloorPosition: [number, number, number];
  showPaths: boolean;
}

export const KIOSK_SETTINGS: Record<string, KioskSettings> = {
  kiosk_1: {
    firstFloorPosition: [2.44, 0.1, 1.56],
    showPaths: true,
  },
  kiosk_2: {
    firstFloorPosition: [-7.8, 0.1, 1.55],
    showPaths: true,
  },
};

export const getKioskSettings = (id: string): KioskSettings => {
  return KIOSK_SETTINGS[id] || KIOSK_SETTINGS.kiosk_1;
};
