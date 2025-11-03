'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';
import type { PredictionInput } from '@/lib/schemas';

// Fix for default icon not showing in Next.js
const iconRetinaUrl = '/_next/image?url=https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png&w=64&q=75';
const iconUrl = '/_next/image?url=https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png&w=32&q=75';
const shadowUrl = '/_next/image?url=https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png&w=64&q=75';

const defaultIcon = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;


function LocationMarker() {
  const form = useFormContext<PredictionInput>();
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      form.setValue('latitude', parseFloat(lat.toFixed(6)));
      form.setValue('longitude', parseFloat(lng.toFixed(6)));
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationfound(e) {
      const { lat, lng } = e.latlng;
      form.setValue('latitude', parseFloat(lat.toFixed(6)));
      form.setValue('longitude', parseFloat(lng.toFixed(6)));
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Set initial position if form has values
  useState(() => {
    const lat = form.getValues('latitude');
    const lng = form.getValues('longitude');
    if (lat && lng) {
      const initialPos = new L.LatLng(lat, lng);
      setPosition(initialPos);
    } else {
        map.locate();
    }
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}


export function InteractiveMap() {
  const center: L.LatLngExpression = [-22.9068, -43.1729]; // Rio de Janeiro

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
