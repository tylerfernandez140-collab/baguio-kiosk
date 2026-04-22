import React, { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useKiosk } from '../../../context/KioskContext';
import CameraAnimation from '../../CameraAnimation';
import { Model } from './Model';
import { OfficeLabel } from './OfficeLabel';
import { OfficePopup } from './OfficePopup';
import { AnimatedPath } from './AnimatedPath';
import { CoordinateDetector } from './CoordinateDetector';
import { useFloorNavigation } from './useFloorNavigation';

export interface FloorBaseProps {
  floorId: string;
  url: string;
  labels: Record<string, string>;
  offset?: [number, number, number];
  children?: React.ReactNode;
  predefinedPaths?: Record<string, THREE.Vector3[]>;
  labelSize?: number;
  customLabelPositions?: Record<string, [number, number, number]>;
  hideLabels?: boolean;
}

export default function FloorBase({
  floorId,
  url,
  labels,
  offset = [0, 0, 0],
  children,
  predefinedPaths = {},
  labelSize = 5,
  customLabelPositions = {},
  hideLabels = false,
}: FloorBaseProps) {
  const { navigation, startNavigation } = useKiosk();
  const [officeMarkers, setOfficeMarkers] = useState<{ name: string; position: THREE.Vector3 }[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<{ name: string; position: THREE.Vector3 } | null>(null);
  const activePath = useFloorNavigation(floorId, predefinedPaths);

  useEffect(() => {
    setOfficeMarkers([]);
    setSelectedOffice(null);
  }, [url]);

  const getOfficeLabel = useCallback((name: string) => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const exactMatch = labels[name.toLowerCase().replace(/[._]\d+$/, "")] || labels[name.toLowerCase()];
    if (exactMatch) return String(exactMatch).replace(/\\n/g, '\n');

    const matchingKey = Object.keys(labels).find(key => 
      key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedName
    );
    return matchingKey ? String(labels[matchingKey]).replace(/\\n/g, '\n') : name.replace(/[_+]/g, '\n');
  }, [labels]);

  return (
    <>
      <Model
        url={url}
        offset={offset}
        onSelectOffice={(name, position) => setSelectedOffice({ name, position })}
        onLoadMarkers={setOfficeMarkers}
      />
      
      {!hideLabels && officeMarkers.map((office, index) => (
        <OfficeLabel
          key={`${url}-label-${index}`}
          office={office}
          label={getOfficeLabel(office.name)}
          labelSize={labelSize}
          customPosition={customLabelPositions[office.name]}
        />
      ))}
      
      {!hideLabels && selectedOffice && !navigation?.isActive && (
        <OfficePopup
          name={selectedOffice.name}
          label={getOfficeLabel(selectedOffice.name)}
          position={selectedOffice.position}
          hasPath={!!Object.keys(predefinedPaths).find(k => k.toLowerCase() === selectedOffice.name.toLowerCase())}
          onGetDirection={(name) => startNavigation(floorId, name)}
        />
      )}
      
      {activePath && <AnimatedPath points={activePath} />}
      
      <CameraAnimation 
        path={activePath || undefined}
        enabled={!!navigation?.isActive}
        animationDuration={2000}
      />
      
      {children}
      <CoordinateDetector />
    </>
  );
}
