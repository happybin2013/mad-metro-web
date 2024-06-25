// components/LeafletMap.js

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet의 기본 아이콘 설정 초기화
delete L.Icon.Default.prototype._getIconUrl;

// Leaflet 아이콘 설정
const customMarkerIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LeafletMap = ({
  center = [37.5665, 126.978],
  zoom = 13,
  markerPosition,
}) => {
  debugger;
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={center}
        zoom={zoom}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markerPosition && (
          <Marker
            position={[markerPosition[0], markerPosition[1]]}
            icon={customMarkerIcon}
          >
            <Popup>마커 위치</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
