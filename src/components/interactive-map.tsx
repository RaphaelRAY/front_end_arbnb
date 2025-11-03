'use client';

import { useFormContext } from 'react-hook-form';
import { Map, Marker } from 'pigeon-maps';
import { useEffect, useState } from 'react';

import type { PredictionInput } from '@/lib/schemas';

export default function InteractiveMap() {
  const { watch, setValue } = useFormContext<PredictionInput>();
  const [lat, lon] = watch(['latitude', 'longitude']);

  // We need to keep track of the component mounting to avoid SSR issues
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center: [number, number] = [lat, lon];

  const handleMarkerDragEnd = ({ latLng }: { latLng: [number, number] }) => {
    setValue('latitude', parseFloat(latLng[0].toFixed(6)), { shouldValidate: true });
    setValue('longitude', parseFloat(latLng[1].toFixed(6)), { shouldValidate: true });
  };
  
  const handleMapClick = ({ latLng }: { latLng: [number, number] }) => {
     setValue('latitude', parseFloat(latLng[0].toFixed(6)), { shouldValidate: true });
    setValue('longitude', parseFloat(latLng[1].toFixed(6)), { shouldValidate: true });
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
