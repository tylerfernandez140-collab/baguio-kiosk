import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const useCameraTransitions = () => {
  const { camera, controls } = useThree();
  const animationRef = useRef<{
    startTime: number;
    startPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endPos: THREE.Vector3;
    endTarget: THREE.Vector3;
    duration: number;
    isPlaying: boolean;
    onComplete?: () => void;
  } | null>(null);

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const startTransition = useCallback((
    fromPos: THREE.Vector3,
    fromTarget: THREE.Vector3,
    toPos: THREE.Vector3,
    toTarget: THREE.Vector3,
    duration: number,
    onComplete?: () => void
  ) => {
    animationRef.current = {
      startTime: Date.now(),
      startPos: fromPos.clone(),
      startTarget: fromTarget.clone(),
      endPos: toPos.clone(),
      endTarget: toTarget.clone(),
      duration,
      isPlaying: true,
      onComplete,
    };
  }, []);

  useFrame(() => {
    if (!animationRef.current?.isPlaying) return;

    const now = Date.now();
    const elapsed = now - animationRef.current.startTime;
    const progress = Math.min(elapsed / animationRef.current.duration, 1);
    const easedProgress = easeInOutCubic(progress);

    const newPos = new THREE.Vector3().lerpVectors(
      animationRef.current.startPos,
      animationRef.current.endPos,
      easedProgress
    );
    camera.position.copy(newPos);

    if (controls) {
      const newTarget = new THREE.Vector3().lerpVectors(
        animationRef.current.startTarget,
        animationRef.current.endTarget,
        easedProgress
      );
      (controls as any).target.copy(newTarget);
      (controls as any).update();
    }

    if (progress >= 1) {
      animationRef.current.isPlaying = false;
      const callback = animationRef.current.onComplete;
      animationRef.current = null;
      callback?.();
    }
  });

  return { startTransition, isAnimating: !!animationRef.current?.isPlaying };
};
