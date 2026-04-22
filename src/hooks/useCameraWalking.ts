import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface WalkingState {
  pathIndex: number;
  segmentProgress: number;
  lastUpdate: number;
  isActive: boolean;
}

export const useCameraWalking = (
  path: THREE.Vector3[] | undefined,
  eyeHeight: number,
  walkingSpeed: number,
  onArrived: () => void,
  onStepComplete: () => void
) => {
  const { camera, controls } = useThree();
  const walkingRef = useRef<WalkingState | null>(null);

  const startWalking = useCallback(() => {
    walkingRef.current = {
      pathIndex: 0,
      segmentProgress: 0,
      lastUpdate: Date.now(),
      isActive: true,
    };
  }, []);

  const stopWalking = useCallback(() => {
    walkingRef.current = null;
  }, []);

  useFrame(() => {
    if (!walkingRef.current?.isActive || !path) return;

    const now = Date.now();
    const deltaTime = (now - walkingRef.current.lastUpdate) / 1000;
    walkingRef.current.lastUpdate = now;

    const { pathIndex, segmentProgress } = walkingRef.current;

    if (pathIndex >= path.length - 1) {
      walkingRef.current.isActive = false;
      onArrived();
      onStepComplete();
      
      const endPoint = path[path.length - 1];
      const arrivalPos = new THREE.Vector3(endPoint.x, eyeHeight + 2, endPoint.z + 4);
      camera.position.lerp(arrivalPos, 0.05);
      
      if (controls) {
        const arrivalTarget = new THREE.Vector3(endPoint.x, eyeHeight * 0.5, endPoint.z);
        (controls as any).target.lerp(arrivalTarget, 0.05);
        (controls as any).update();
      }
      return;
    }

    const startPoint = path[pathIndex];
    const endPoint = path[pathIndex + 1];
    const segmentLength = startPoint.distanceTo(endPoint);

    const newProgress = segmentProgress + (walkingSpeed * deltaTime) / segmentLength;

    if (newProgress >= 1) {
      walkingRef.current.pathIndex = pathIndex + 1;
      walkingRef.current.segmentProgress = 0;
    } else {
      walkingRef.current.segmentProgress = newProgress;
      const currentGroundPos = new THREE.Vector3().lerpVectors(startPoint, endPoint, newProgress);
      const overallDirection = new THREE.Vector3().subVectors(path[path.length - 1], path[0]).normalize();
      
      const cameraPos = new THREE.Vector3(
        currentGroundPos.x - overallDirection.x * 4,
        eyeHeight + 1.5,
        currentGroundPos.z - overallDirection.z * 4
      );

      camera.position.lerp(cameraPos, 0.1);

      if (controls) {
        const lookAtPos = currentGroundPos.clone();
        lookAtPos.y = eyeHeight * 0.2;
        const currentTarget = (controls as any).target.clone();
        const newTarget = currentTarget.lerp(lookAtPos, 0.08);
        (controls as any).target.copy(newTarget);
        (controls as any).update();
      }
    }
  });

  return { startWalking, stopWalking, isWalking: !!walkingRef.current?.isActive };
};
