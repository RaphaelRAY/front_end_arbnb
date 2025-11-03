'use client';

import { useFormContext } from 'react-hook-form';
import { Map, Marker } from 'pigeon-maps';
import { useEffect, useState } from 'react';

import type { PredictionInput } from '@/lib/schemas';
import { neighbourhoodCoords } from '@/lib/neighbourhood-coords';
import { haversineDistance } from '@/lib/utils';

export default function InteractiveMap() {
  const { watch, setValue } = useFormContext<PredictionInput>();
  const [lat, lon] = watch(['latitude', 'longitude']);

  // We need to keep track of the component mounting to avoid SSR issues
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center: [number, number] = [lat, lon];

  const findClosestNeighbourhood = (currentLat: number, currentLon: number) => {
    let closestNeighbourhood = '';
    let minDistance = Infinity;

    for (const neighbourhood in neighbourhoodCoords) {
      const { lat, lon } = neighbourhoodCoords[neighbourhood as keyof typeof neighbourhoodCoords];
      const distance = haversineDistance(currentLat, currentLon, lat, lon);
      if (distance < minDistance) {
        minDistance = distance;
        closestNeighbourhood = neighbourhood;
      }
    }
    return closestNeighbourhood;
  };

  const updateLocation = (latLng: [number, number]) => {
    const newLat = parseFloat(latLng[0].toFixed(6));
    const newLon = parseFloat(latLng[1].toFixed(6));
    
    setValue('latitude', newLat, { shouldValidate: true });
    setValue('longitude', newLon, { shouldValidate: true });

    const closest = findClosestNeighbourhood(newLat, newLon);
    if (closest) {
      setValue('neighbourhood_cleansed', closest, { shouldValidate: true });
    }
  };

  const handleMarkerDragEnd = ({ latLng }: { latLng: [number, number] }) => {
    updateLocation(latLng);
  };
  
  const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
    updateLocation(latLng);
  }

  if (!isMounted) {
    return <div className="h-[400px] w-full bg-muted rounded-md animate-pulse" />;
  }

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <Map 
            center={center} 
            zoom={12}
            onClick={handleMapClick}
        >
            <Marker 
                width={50}
                anchor={center} 
                color={'hsl(var(--primary))'}
                draggable
                onDragEnd={handleMarkerDragEnd}
            />
        </Map>
    </div>
  );
}
