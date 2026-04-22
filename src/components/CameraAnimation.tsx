import { useEffect, useState, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKiosk } from '../context/KioskContext';
import { getKioskSettings } from '../config/kioskConfig';
import { useCameraTransitions } from '../hooks/useCameraTransitions';
import { useCameraWalking } from '../hooks/useCameraWalking';

interface CameraAnimationProps {
  path?: THREE.Vector3[];
  animationDuration?: number;
  enabled?: boolean;
}

type CameraMode = 'overview' | 'zoom-in' | 'walking' | 'arrived';

const EYE_HEIGHT = 3.0;
const WALKING_SPEED = 1.5;

export function CameraAnimation({ 
  path, 
  enabled = true 
}: CameraAnimationProps) {
  const { camera, controls } = useThree();
  const { navigation, kioskId, completeCurrentStep } = useKiosk();
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview');
  
  const { startTransition } = useCameraTransitions();
  
  const { startWalking, stopWalking } = useCameraWalking(
    path,
    EYE_HEIGHT,
    WALKING_SPEED,
    () => setCameraMode('arrived'),
    () => {
      if (navigation?.isActive && !navigation.isTransitioning) {
        completeCurrentStep();
      }
    }
  );

  const DEFAULT_CAMERA_POS = useMemo(() => new THREE.Vector3(0, 20, 15), []);
  const DEFAULT_CAMERA_TARGET = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    if (!navigation) {
      const currentPos = camera.position.clone();
      const currentTarget = controls ? (controls as any).target.clone() : new THREE.Vector3(0, 0, 0);
      
      startTransition(
        currentPos,
        currentTarget,
        DEFAULT_CAMERA_POS,
        DEFAULT_CAMERA_TARGET,
        2000,
        () => {
          setCameraMode('overview');
          stopWalking();
        }
      );
    }
  }, [navigation, camera, controls, DEFAULT_CAMERA_POS, DEFAULT_CAMERA_TARGET, startTransition, stopWalking]);

  useEffect(() => {
    if (!navigation?.isActive || !enabled || !path || path.length < 2) {
      if (!navigation) return;
      setCameraMode('overview');
      stopWalking();
      return;
    }

    const settings = getKioskSettings(kioskId);
    const startPos = new THREE.Vector3(settings.firstFloorPosition[0], EYE_HEIGHT, settings.firstFloorPosition[2]);
    const pathEnd = path[path.length - 1];
    const pathDirection = new THREE.Vector3().subVectors(pathEnd, startPos).normalize();
    
    const overviewPos = new THREE.Vector3(startPos.x, 18, startPos.z + 8);
    const lookTarget = new THREE.Vector3().copy(startPos).add(pathDirection);
    lookTarget.y = 0;

    const walkPos = new THREE.Vector3(startPos.x - pathDirection.x * 2, EYE_HEIGHT, startPos.z - pathDirection.z * 2);

    camera.position.copy(overviewPos);
    if (controls) {
      (controls as any).target.copy(lookTarget);
      (controls as any).update();
    }

    setCameraMode('zoom-in');
    startTransition(
      overviewPos,
      lookTarget,
      walkPos,
      lookTarget,
      2500,
      () => {
        setCameraMode('walking');
        startWalking();
      }
    );

  }, [navigation?.isActive, path, camera, controls, enabled, kioskId, startTransition, startWalking, stopWalking]);

  return null;
}

export default CameraAnimation;
