import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useKiosk } from '../../../context/KioskContext';

export const useFloorNavigation = (
  floorId: string,
  predefinedPaths: Record<string, THREE.Vector3[]>
) => {
  const { navigation } = useKiosk();
  const [activePath, setActivePath] = useState<THREE.Vector3[] | null>(null);

  useEffect(() => {
    if (!navigation) {
      setActivePath(null);
      return;
    }

    if (navigation.floorId === floorId) {
      const normalizedId = navigation.officeId.toLowerCase();
      const pathKey = Object.keys(predefinedPaths).find(key => 
        key.toLowerCase() === normalizedId
      );
      setActivePath(pathKey ? predefinedPaths[pathKey] : null);
    } else if (floorId === 'first') {
      // Transition logic for first floor
      if (navigation.floorId === 'basement') {
        const leftSideOffices = ['daycare', 'sports', 'lounge', 'kit'];
        const targetOffice = navigation.officeId.toLowerCase().replace(/[^a-z]/g, '');
        
        if (leftSideOffices.includes(targetOffice)) {
          setActivePath(predefinedPaths['stairs_basement_left'] || null);
        } else {
          setActivePath(
            predefinedPaths['stairs_basement'] || 
            predefinedPaths['entrance'] || 
            predefinedPaths['stairs'] || 
            null
          );
        }
      } else {
        setActivePath(predefinedPaths['stairs'] || null);
      }
    } else {
      setActivePath(null);
    }
  }, [navigation, floorId, predefinedPaths]);

  return activePath;
};
