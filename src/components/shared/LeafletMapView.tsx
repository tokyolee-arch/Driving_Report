'use client';

import { useEffect, useRef, useState } from 'react';

interface LeafletMapViewProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

export default function LeafletMapView({ lat, lng, label, address }: LeafletMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Leaflet을 dynamic import (SSR 방지)
        const L = await import('leaflet');

        // Leaflet CSS 주입 (한 번만)
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (cancelled || !containerRef.current) return;

        // 기존 맵 제거
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        const map = L.map(containerRef.current, {
          center: [lat, lng],
          zoom: 15,
          zoomControl: true,
          attributionControl: false,
          dragging: true,
          scrollWheelZoom: true,
        });

        // OpenStreetMap 타일 (무료, 키 불필요)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        // 마커용 커스텀 아이콘 (Leaflet 기본 아이콘 CDN 문제 우회)
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: 28px; height: 28px;
              background: #00d4aa;
              border: 3px solid #fff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              position: relative;
              top: -14px;
              left: -14px;
            "></div>
          `,
          iconSize: [0, 0],
        });

        L.marker([lat, lng], { icon }).addTo(map);

        mapRef.current = map;

        // 타일 로드 완료 대기
        map.whenReady(() => {
          if (!cancelled) setReady(true);
        });

        // 짧은 딜레이 후 invalidateSize (컨테이너 크기 보정)
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
        }
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06] w-full">
      {/* 지도 영역 */}
      <div className="relative w-full" style={{ height: '140px' }}>
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: '#1a1d23' }}
        />

        {/* 로딩 오버레이 */}
        {!ready && !error && (
          <div className="absolute inset-0 z-10 bg-ivi-surface flex flex-col items-center justify-center gap-1.5">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-ivi-accent rounded-full animate-spin" />
            <span className="text-xs text-gray-500">지도 로딩 중…</span>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="absolute inset-0 z-10 bg-ivi-surface flex flex-col items-center justify-center gap-1.5 px-4">
            <span className="text-xs text-gray-500">지도를 불러올 수 없습니다</span>
            <span className="text-[9px] text-red-400 text-center break-all">{error}</span>
          </div>
        )}
      </div>

      {/* 하단 정보 */}
      <div className="px-3 py-2.5 bg-ivi-surfaceLight space-y-0.5">
        <p className="text-sm font-semibold text-gray-200">{label}</p>
        <p className="text-xs text-gray-500">{address}</p>
        <p className="text-[10px] text-gray-600 font-mono">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
