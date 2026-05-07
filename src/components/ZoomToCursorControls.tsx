import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ZoomToCursorControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableDamping?: boolean;
  dampingFactor?: number;
  rotateSpeed?: number;
  maxPolarAngle?: number;
  minDistance?: number;
  maxDistance?: number;
  makeDefault?: boolean;
}

export function ZoomToCursorControls({
  autoRotate = false,
  autoRotateSpeed = 0.5,
  enableDamping = true,
  dampingFactor = 0.1,
  rotateSpeed = 1,
  maxPolarAngle = Math.PI / 2,
  minDistance = 0.5,
  maxDistance = 100,
  makeDefault = false,
}: ZoomToCursorControlsProps) {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isZoomingRef = useRef(false);
  const targetRef = useRef(new THREE.Vector3(0, 1, 0));
  const sphericalRef = useRef(new THREE.Spherical());
  
  // Store camera state
  const stateRef = useRef({
    theta: 0,
    phi: Math.PI / 2,
    radius: 10,
    target: new THREE.Vector3(0, 1, 0),
  });

  useEffect(() => {
    // Initialize spherical coordinates from camera position
    const offset = new THREE.Vector3().subVectors(camera.position, stateRef.current.target);
    sphericalRef.current.setFromVector3(offset);
    stateRef.current.theta = sphericalRef.current.theta;
    stateRef.current.phi = sphericalRef.current.phi;
    stateRef.current.radius = sphericalRef.current.radius;
  }, []);

  // Handle mouse move to track cursor position
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl.domElement]);

  // Get point on the floor (y=0) that the mouse is pointing at
  const getMouseIntersection = useCallback(() => {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseRef.current.x, mouseRef.current.y), camera);
    
    // Create a plane at y=0 to intersect with
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const target = new THREE.Vector3();
    
    raycaster.ray.intersectPlane(plane, target);
    return target;
  }, [camera]);

  // Handle wheel zoom
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const zoomSpeed = 0.1;
    const delta = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
    
    // Get the point on the floor that the mouse is pointing at
    const mousePoint = getMouseIntersection();
    if (!mousePoint) return;
    
    // Calculate new radius
    const newRadius = Math.max(minDistance, Math.min(maxDistance, stateRef.current.radius * delta));
    
    // Calculate how much to move the target towards the mouse point
    const zoomFactor = 1 - (newRadius / stateRef.current.radius);
    const targetShift = new THREE.Vector3().subVectors(mousePoint, stateRef.current.target).multiplyScalar(zoomFactor * 0.3);
    
    // Update target
    stateRef.current.target.add(targetShift);
    stateRef.current.radius = newRadius;
    
    // Update camera position
    updateCameraPosition();
  }, [getMouseIntersection, minDistance, maxDistance]);

  const updateCameraPosition = useCallback(() => {
    const { theta, phi, radius, target } = stateRef.current;
    
    // Calculate new camera position in spherical coordinates
    const sinPhiRadius = Math.sin(phi) * radius;
    const x = sinPhiRadius * Math.sin(theta);
    const y = Math.cos(phi) * radius;
    const z = sinPhiRadius * Math.cos(theta);
    
    const newPosition = new THREE.Vector3(x, y, z).add(target);
    
    if (enableDamping) {
      // Smooth interpolation
      camera.position.lerp(newPosition, 1 - dampingFactor);
      targetRef.current.lerp(target, 1 - dampingFactor);
    } else {
      camera.position.copy(newPosition);
      targetRef.current.copy(target);
    }
    
    camera.lookAt(targetRef.current);
  }, [camera, enableDamping, dampingFactor]);

  // Handle drag/pan
  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (event.button === 1 || event.button === 2) {
      // Middle or right click for panning
      isZoomingRef.current = true;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    isZoomingRef.current = false;
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isZoomingRef.current) return;
    
    const deltaX = event.movementX * 0.01;
    const deltaY = event.movementY * 0.01;
    
    // Pan the target
    const right = new THREE.Vector3().crossVectors(camera.up, new THREE.Vector3().subVectors(camera.position, stateRef.current.target)).normalize();
    const up = new THREE.Vector3().copy(camera.up);
    
    stateRef.current.target.add(right.multiplyScalar(deltaX * stateRef.current.radius * 0.5));
    stateRef.current.target.add(up.multiplyScalar(-deltaY * stateRef.current.radius * 0.5));
    
    updateCameraPosition();
  }, [camera, updateCameraPosition]);

  // Auto rotate
  useEffect(() => {
    if (!autoRotate) return;
    
    const interval = setInterval(() => {
      stateRef.current.theta += autoRotateSpeed * 0.01;
      updateCameraPosition();
    }, 16);
    
    return () => clearInterval(interval);
  }, [autoRotate, autoRotateSpeed, updateCameraPosition]);

  // Set up event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointermove', handlePointerMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [gl.domElement, handleMouseMove, handleWheel, handlePointerDown, handlePointerUp, handlePointerMove]);

  // Animation frame update
  useFrame(() => {
    if (enableDamping) {
      updateCameraPosition();
    }
  });

  return null;
}

export default ZoomToCursorControls;
