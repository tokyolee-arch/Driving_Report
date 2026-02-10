'use client';

import { useState } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

interface MiniMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

export default function MiniMap({ lat, lng, label, address }: MiniMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY!,
  });
  const [markerOpen, setMarkerOpen] = useState(false);

  // 로딩 중 스켈레톤
  if (loading) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/[0.06]">
        <div className="h-[140px] bg-ivi-surface animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-600">지도 로딩 중...</span>
        </div>
        <div className="px-3 py-2.5 bg-ivi-surfaceLight space-y-0.5">
          <p className="text-sm font-semibold text-gray-200">{label}</p>
          <p className="text-xs text-gray-500">{address}</p>
        </div>
      </div>
    );
  }

  // 에러 시 폴백
  if (error) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/[0.06]">
        <div className="h-[140px] bg-ivi-surface flex items-center justify-center">
          <span className="text-xs text-gray-600">지도를 불러올 수 없습니다</span>
        </div>
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

  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06]">
      {/* 카카오맵 */}
      <Map
        center={{ lat, lng }}
        style={{ width: '100%', height: '140px' }}
        level={4}
        draggable={false}
        zoomable={false}
      >
        <MapMarker
          position={{ lat, lng }}
          onClick={() => setMarkerOpen((prev) => !prev)}
        >
          {markerOpen && (
            <div
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                color: '#333',
              }}
            >
              {label}
            </div>
          )}
        </MapMarker>
      </Map>

      {/* 정보 영역 */}
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
