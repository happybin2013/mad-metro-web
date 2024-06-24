// components/LeafletMap.js

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon-2x.png'; // 사용자 정의 마커 아이콘 경로
import 'leaflet/dist/images/marker-shadow.png'; // 마커 그림자 경로 (필요한 경우)

// Leaflet의 기본 아이콘 설정 초기화
delete L.Icon.Default.prototype._getIconUrl;

// Leaflet 아이콘 설정
const customMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LeafletMap = ({ center = [37.5665, 126.9780], zoom = 13, markerPosition }) => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer style={{ height: '100%', width: '100%' }} center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markerPosition && (
          <Marker position={[markerPosition.lat, markerPosition.lng]} icon={customMarkerIcon}>
            <Popup>마커 위치</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
