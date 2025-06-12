import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper to get color by risk level in marker title
const getRiskColor = (title = "") => {
  if (title.includes("High")) return "red";
  if (title.includes("Medium")) return "orange";
  return "yellow";
};

const MapComponent = ({
  markers = [],
  center = { lat: 14.5176, lng: 121.0509 },
  zoom = 13,
  height = 400,
}) => (
  <div style={{ width: "100%", height }}>
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, idx) => (
        <React.Fragment key={idx}>
          <Circle
            center={[marker.lat, marker.lng]}
            radius={200}
            pathOptions={{
              color: getRiskColor(marker.title),
              fillColor: getRiskColor(marker.title),
              fillOpacity: 0.3,
            }}
          />
          <Marker position={[marker.lat, marker.lng]}>
            <Popup>
              <span style={{ whiteSpace: "pre-line" }}>{marker.title}</span>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
    {/* Legend */}
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        background: "rgba(255,255,255,0.9)",
        padding: 10,
        borderRadius: 6,
        fontSize: 13,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 5 }}>Risk Levels</div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <div style={{ width: 16, height: 16, background: "red", marginRight: 8, borderRadius: 3, border: "1px solid #ccc" }} />
        High Risk Areas
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <div style={{ width: 16, height: 16, background: "orange", marginRight: 8, borderRadius: 3, border: "1px solid #ccc" }} />
        Medium Risk Areas
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: 16, height: 16, background: "yellow", marginRight: 8, borderRadius: 3, border: "1px solid #ccc" }} />
        Low Risk Areas
      </div>
    </div>
  </div>
);

export default MapComponent;