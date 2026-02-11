'use client';

import dynamic from 'next/dynamic';

interface MiniMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

const LeafletMapView = dynamic(() => import('./LeafletMapView'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl overflow-hidden border border-white/[0.06]">
      <div className="h-[140px] bg-ivi-surface animate-pulse flex items-center justify-center">
        <span className="text-xs text-gray-600">지도 로딩 중...</span>
      </div>
    </div>
  ),
});

export default function MiniMap({ lat, lng, label, address }: MiniMapProps) {
  return <LeafletMapView lat={lat} lng={lng} label={label} address={address} />;
}
