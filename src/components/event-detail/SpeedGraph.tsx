import type { SpeedGraphData } from '@/types/driving-report';

interface SpeedGraphProps {
  data: SpeedGraphData;
  color: string;
}

export default function SpeedGraph({ data, color }: SpeedGraphProps) {
  return (
    <div className="bg-ivi-bg rounded-lg p-3 border border-white/[0.04]">
      <p className="text-[10px] text-gray-500 mb-2">⚡ 속도 변화 그래프</p>

      <div className="relative h-16">
        <svg
          viewBox="0 0 100 80"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* 그리드 가이드 라인 */}
          {[20, 40, 60].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
            />
          ))}

          {/* 그라데이션 fill */}
          <defs>
            <linearGradient id={`speed-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 영역 채우기 */}
          <path
            d={`${data.path} L100,80 L0,80 Z`}
            fill={`url(#speed-grad-${color.replace('#', '')})`}
          />

          {/* 라인 */}
          <path
            d={data.path}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 시작 도트 */}
          {data.line.length > 0 && (
            <circle
              cx={data.line[0].x}
              cy={data.line[0].y}
              r="2.5"
              fill={color}
            />
          )}

          {/* 끝 도트 */}
          {data.line.length > 1 && (
            <circle
              cx={data.line[data.line.length - 1].x}
              cy={data.line[data.line.length - 1].y}
              r="2.5"
              fill={color}
            />
          )}
        </svg>
      </div>

      {/* 시작/끝 라벨 */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-gray-500">{data.startLabel}</span>
        <span className="text-[10px] font-semibold" style={{ color }}>
          {data.endLabel}
        </span>
      </div>
    </div>
  );
}
