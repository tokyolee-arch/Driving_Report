interface MiniMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
}

export default function MiniMap({ lat, lng, label, address }: MiniMapProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.06]">
      {/* 맵 영역 */}
      <div className="relative h-28 bg-ivi-surface flex items-center justify-center">
        {/* 도로 느낌 CSS grid 패턴 */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        {/* 추가 대각선 도로 패턴 */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* 핀 마커 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-ivi-danger flex items-center justify-center shadow-lg shadow-red-500/30">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="white"
              className="drop-shadow-sm"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="w-2 h-2 bg-ivi-danger/60 rounded-full mt-0.5 blur-[2px]" />
        </div>
      </div>

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
