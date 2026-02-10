import type { ComparisonData } from '@/types/driving-report';

interface ComparisonBarProps {
  data: ComparisonData;
}

export default function ComparisonBar({ data }: ComparisonBarProps) {
  return (
    <div className="bg-ivi-bg rounded-lg p-3 border border-white/[0.04]">
      <p className="text-[10px] text-gray-500 mb-2.5">📊 {data.title}</p>

      <div className="space-y-2.5">
        {data.bars.map((bar, i) => {
          const pct = Math.min((bar.value / bar.max) * 100, 100);

          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{bar.label}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: bar.color }}
                >
                  {bar.displayValue}
                </span>
              </div>

              {/* 바 트랙 */}
              <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: bar.color,
                    boxShadow: `0 0 8px ${bar.color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
