// components/LeafletMap.js
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ markerPosition }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([37.5665, 126.978], 13); // 서울 시청을 중심으로 지도 초기화
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (markerPosition) {
      L.marker(markerPosition).addTo(map)
        .bindPopup('중간 지점').openPopup();
    }

    return () => {
      map.remove();
    };
  }, [markerPosition]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default LeafletMap;