'use client';

import { useFormContext } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useMemo, useState } from 'react';
import type { LatLng } from 'leaflet';
import L from 'leaflet';

import type { PredictionInput } from '@/lib/schemas';

// Leaflet's default icon is not webpack-friendly out of the box with Next.js.
// We need to manually fix the icon path.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


function MapEvents({ onPositionChange }: { onPositionChange: (latlng: LatLng) => void }) {
  const map = useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
      onPositionChange(e.latlng);
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return null;
}

function MapUpdater({ center }: { center: LatLng }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}


export default function InteractiveMap() {
  const { watch, setValue } = useFormContext<PredictionInput>();
  const [lat, lon] = watch(['latitude', 'longitude']);
  
  const [isMounted, setIsMounted] = useState(false);

  const center: LatLng = useMemo(() => L.latLng(lat, lon), [lat, lon]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePositionChange = (latlng: LatLng) => {
    setValue('latitude', parseFloat(latlng.lat.toFixed(6)), { shouldValidate: true });
    setValue('longitude', parseFloat(latlng.lng.toFixed(6)), { shouldValidate: true });
  };
  
  const handleMarkerDrag = (e: L.DragEndEvent) => {
    handlePositionChange(e.target.getLatLng());
  };

  if (!isMounted) {
    return <div className="h-[400px] w-full bg-muted rounded-md animate-pulse" />;
  }

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker 
        position={center}
        draggable={true}
        eventHandlers={{
            dragend: handleMarkerDrag,
        }}
      />
      <MapEvents onPositionChange={handlePositionChange} />
      <MapUpdater center={center} />
    </MapContainer>
  );
}
