import React from "react";
import { MapContainer, TileLayer, Circle, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RadiusMap = ({
  center = { lat: 14.5176, lng: 121.0509 },
  radiusKm = 5,
  height = 300,
}) => {
  return (
    <div style={{ height: `${height}px`, width: "100%", borderRadius: "8px", overflow: "hidden" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {/* Marker at the center */}
        <Marker position={[center.lat, center.lng]} />

        {/* Circle around the center */}
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusKm * 1000} // Convert km to meters
          pathOptions={{
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  );
};

export default RadiusMap;