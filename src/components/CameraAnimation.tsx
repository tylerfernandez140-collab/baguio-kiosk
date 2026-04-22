import { useEffect, useRef, useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useKiosk } from '../context/KioskContext';
import { getKioskSettings } from '../config/kioskConfig';

interface CameraAnimationProps {
  path?: THREE.Vector3[];
  animationDuration?: number;
  enabled?: boolean;
}

// Camera modes for the navigation experience
 type CameraMode = 'overview' | 'zoom-in' | 'walking' | 'arrived';

export function CameraAnimation({ 
  path, 
  animationDuration = 4000,
  enabled = true 
}: CameraAnimationProps) {
  const { camera, controls } = useThree();
  const { navigation, kioskId, completeCurrentStep } = useKiosk();
  
  const [cameraMode, setCameraMode] = useState<CameraMode>('overview');
  
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

  const walkingRef = useRef<{
    pathIndex: number;
    segmentProgress: number;
    lastUpdate: number;
    isActive: boolean;
  } | null>(null);

  // Eye level height for first-person walking
  const EYE_HEIGHT = 3.0; // Higher to clearly see arrows
  const WALKING_SPEED = 1.5; // Slower for smooth viewing

  // Easing function for smooth transitions
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Start a camera transition animation
  const startTransition = (
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
  };

  // Default camera position (overview of the floor)
  const DEFAULT_CAMERA_POS = useMemo(() => new THREE.Vector3(0, 20, 15), []);
  const DEFAULT_CAMERA_TARGET = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  // Reset camera to default position when navigation is cleared
  useEffect(() => {
    if (!navigation) {
      // Navigation was cleared - reset camera smoothly
      const currentPos = camera.position.clone();
      const currentTarget = controls ? (controls as any).target.clone() : new THREE.Vector3(0, 0, 0);
      
      startTransition(
        currentPos,
        currentTarget,
        DEFAULT_CAMERA_POS,
        DEFAULT_CAMERA_TARGET,
        2000, // 2 seconds to reset
        () => {
          setCameraMode('overview');
          animationRef.current = null;
          walkingRef.current = null;
        }
      );
    }
  }, [navigation, camera, controls, DEFAULT_CAMERA_POS, DEFAULT_CAMERA_TARGET]);

  // Initialize navigation sequence when active
  useEffect(() => {
    if (!navigation?.isActive || !enabled || !path || path.length < 2) {
      if (!navigation) {
        // Will be handled by the effect above
        return;
      }
      setCameraMode('overview');
      animationRef.current = null;
      walkingRef.current = null;
      return;
    }

    const settings = getKioskSettings(kioskId);
    const startPos = new THREE.Vector3(
      settings.firstFloorPosition[0],
      EYE_HEIGHT,
      settings.firstFloorPosition[2]
    );

    // STEP 1: Start with overview showing "You Are Here" and destination
    setCameraMode('zoom-in');
    
    // Calculate overview position (high above, showing full path)
    const pathCenter = new THREE.Vector3();
    path.forEach(p => pathCenter.add(p));
    pathCenter.divideScalar(path.length);
    
    // Calculate where the path goes - look at the destination
    const pathEnd = path[path.length - 1];
    const pathDirection = new THREE.Vector3().subVectors(pathEnd, startPos).normalize();
    
    // Overview position - high above start position
    const overviewPos = new THREE.Vector3(
      startPos.x,
      18,
      startPos.z + 8
    );
    
    // Keep look target consistent - always look toward the destination direction
    const lookTarget = new THREE.Vector3().copy(startPos).add(pathDirection);
    lookTarget.y = 0;

    // Walking position - at eye level, slightly behind start
    const walkPos = new THREE.Vector3(
      startPos.x - pathDirection.x * 2,
      EYE_HEIGHT,
      startPos.z - pathDirection.z * 2
    );

    // Set initial camera position
    camera.position.copy(overviewPos);
    if (controls) {
      (controls as any).target.copy(lookTarget);
      (controls as any).update();
    }

    // Zoom in while keeping the same look direction (no camera swing)
    startTransition(
      overviewPos,
      lookTarget, // Same target
      walkPos,
      lookTarget, // Same target - prevents camera from looking around
      2500,
      () => {
        // After zoom in, start walking
        setCameraMode('walking');
        walkingRef.current = {
          pathIndex: 0,
          segmentProgress: 0,
          lastUpdate: Date.now(),
          isActive: true,
        };
      }
    );

  }, [navigation?.isActive, path, camera, controls, enabled, kioskId]);

  // Handle transition animations
  useFrame(() => {
    if (!animationRef.current?.isPlaying) return;

    const now = Date.now();
    const elapsed = now - animationRef.current.startTime;
    const progress = Math.min(elapsed / animationRef.current.duration, 1);
    const easedProgress = easeInOutCubic(progress);

    // Interpolate camera position
    const newPos = new THREE.Vector3().lerpVectors(
      animationRef.current.startPos,
      animationRef.current.endPos,
      easedProgress
    );
    camera.position.copy(newPos);

    // Interpolate target
    if (controls) {
      const newTarget = new THREE.Vector3().lerpVectors(
        animationRef.current.startTarget,
        animationRef.current.endTarget,
        easedProgress
      );
      (controls as any).target.copy(newTarget);
      (controls as any).update();
    }

    // Animation complete
    if (progress >= 1) {
      animationRef.current.isPlaying = false;
      animationRef.current.onComplete?.();
    }
  });

  // Handle walking animation (VR-style first-person)
  useFrame(() => {
    if (cameraMode !== 'walking' || !walkingRef.current?.isActive || !path) return;

    const now = Date.now();
    const deltaTime = (now - walkingRef.current.lastUpdate) / 1000;
    walkingRef.current.lastUpdate = now;

    const { pathIndex, segmentProgress } = walkingRef.current;

    // Check if reached destination
    if (pathIndex >= path.length - 1) {
      setCameraMode('arrived');
      walkingRef.current.isActive = false;
      
      // Mark step complete when path ends - overlay will auto-advance (supports multi-floor)
      if (navigation?.isActive && !navigation.isTransitioning) {
        completeCurrentStep();
      }
      
      // Position camera to view destination clearly
      const endPoint = path[path.length - 1];
      const arrivalPos = new THREE.Vector3(
        endPoint.x,
        EYE_HEIGHT + 2,
        endPoint.z + 4 // Position in front of destination
      );
      
      camera.position.lerp(arrivalPos, 0.05);
      
      if (controls) {
        const arrivalTarget = new THREE.Vector3(endPoint.x, EYE_HEIGHT * 0.5, endPoint.z);
        (controls as any).target.lerp(arrivalTarget, 0.05);
        (controls as any).update();
      }
      return;
    }

    const startPoint = path[pathIndex];
    const endPoint = path[pathIndex + 1];
    const segmentLength = startPoint.distanceTo(endPoint);

    // Update progress along current segment
    const newProgress = segmentProgress + (WALKING_SPEED * deltaTime) / segmentLength;

    if (newProgress >= 1) {
      // Move to next segment
      walkingRef.current.pathIndex = pathIndex + 1;
      walkingRef.current.segmentProgress = 0;
    } else {
      walkingRef.current.segmentProgress = newProgress;

      // Calculate current position on the path
      const currentGroundPos = new THREE.Vector3().lerpVectors(
        startPoint,
        endPoint,
        newProgress
      );

      // Calculate direction of the entire path (more stable than segment direction)
      const overallDirection = new THREE.Vector3().subVectors(path[path.length - 1], path[0]).normalize();
      
      // Camera position: fixed offset from current position
      // This keeps camera stable without swinging
      const cameraPos = new THREE.Vector3(
        currentGroundPos.x - overallDirection.x * 4, // Behind
        EYE_HEIGHT + 1.5,
        currentGroundPos.z - overallDirection.z * 4  // Behind
      );

      // Smooth camera movement
      camera.position.lerp(cameraPos, 0.1);

      // Look target: look at current position, not ahead (more stable)
      if (controls) {
        const lookAtPos = currentGroundPos.clone();
        lookAtPos.y = EYE_HEIGHT * 0.2;

        // Very smooth target update
        const currentTarget = (controls as any).target.clone();
        const newTarget = currentTarget.lerp(lookAtPos, 0.08);
        (controls as any).target.copy(newTarget);
        (controls as any).update();
      }
    }
  });

  return null;
}

export default CameraAnimation;
