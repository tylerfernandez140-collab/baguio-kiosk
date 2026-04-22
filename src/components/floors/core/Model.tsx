import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

interface ModelProps {
  url: string;
  offset?: [number, number, number];
  onSelectOffice?: (name: string, position: THREE.Vector3) => void;
  onLoadMarkers?: (
    markers: { 
      name: string; 
      position: THREE.Vector3;
      size: THREE.Vector3;
      center: THREE.Vector3;
    }[]
  ) => void;
}

export function Model({
  url,
  offset = [0, 0, 0],
  onSelectOffice,
  onLoadMarkers,
}: ModelProps) {
  const { scene } = useGLTF(url);
  const isLoadedRef = useRef(false);
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    const clickedObject = event.object;
    
    const name = clickedObject.name.toLowerCase();
    const isBase = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor', 'outline', 'center'].some(ignored => name.includes(ignored));
    
    if (isBase) return;
    
    const box = new THREE.Box3().setFromObject(clickedObject);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const popupPosition = new THREE.Vector3(
      center.x,
      box.max.y + 0.8,
      center.z
    );

    onSelectOffice?.(clickedObject.name, popupPosition);
  };

  const wrapper = useMemo(() => {
    isLoadedRef.current = false;
    const clonedScene = scene.clone(true);

    clonedScene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const isBase = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor', 'outline', 'center'].some(ignored => name.includes(ignored));
        
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.clickable = !isBase;

        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat: any) => mat.clone());
        } else if (child.material) {
          child.material = child.material.clone();
        }

        const materials = Array.isArray(child.material) ? child.material : [child.material];

        materials.forEach((mat: any) => {
          if (!mat) return;
          mat.transparent = false;
          mat.opacity = 1;
          mat.side = THREE.DoubleSide;
          mat.depthWrite = true;
          mat.depthTest = true;

          const isCube = name.includes('cube');
          const isStairs = name.includes('stairs');
          if (isCube) {
            mat.color?.setHex(0x8B4513);
            mat.polygonOffset = true;
            mat.polygonOffsetFactor = -1;
            mat.polygonOffsetUnits = -4;
          } else if (isStairs) {
            mat.color?.setHex(0x90EE90);
            mat.polygonOffset = true;
            mat.polygonOffsetFactor = -1;
            mat.polygonOffsetUnits = -2;
          } else if (isBase) {
            mat.color?.setHex(0x004700);
          } else {
            mat.color?.setHex(0xffffff);
          }
          mat.needsUpdate = true;
        });
      }
    });

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    
    const group = new THREE.Group();
    group.add(clonedScene);
    clonedScene.position.set(-center.x, -center.y, -center.z);
    group.position.set(...offset);
    group.scale.set(5.5, 5.5, 5.5);
    
    return group;
  }, [scene, url, JSON.stringify(offset)]);

  useEffect(() => {
    if (!onLoadMarkers) return;
    
    const scanMarkers = () => {
      const detectedMarkers: any[] = [];
      wrapper.updateMatrixWorld(true);
      
      wrapper.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const name = child.name.toLowerCase();
          const isIgnored = ['ground', 'plane', 'stairs', 'cube', 'base', 'floor', 'outline', 'center'].some(ignored => name.includes(ignored));

          if (!isIgnored) {
            const childBox = new THREE.Box3().setFromObject(child);
            const localCenter = new THREE.Vector3();
            childBox.getCenter(localCenter);
            const size = new THREE.Vector3();
            childBox.getSize(size);
            
            const markerPos = new THREE.Vector3(localCenter.x, childBox.max.y + 0.3, localCenter.z);
            
            detectedMarkers.push({
              name: child.name,
              position: markerPos,
              size: size,
              center: localCenter,
            });
          }
        }
      });

      if (detectedMarkers.length > 0) {
        onLoadMarkers(detectedMarkers);
        isLoadedRef.current = true;
      }
    };

    scanMarkers();
    const timeout = setTimeout(scanMarkers, 100);
    return () => clearTimeout(timeout);
  }, [url, wrapper, onLoadMarkers]);

  return <primitive object={wrapper} onClick={handleClick} />;
}
