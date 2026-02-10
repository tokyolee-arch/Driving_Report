import type { EventMetricItem } from '@/types/driving-report';

interface MetricsGridProps {
  metrics: EventMetricItem[];
}

export default function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {metrics.map((m, i) => (
        <div
          key={i}
          className="flex-1 min-w-[80px] bg-ivi-bg rounded-lg px-3 py-2.5 border border-white/[0.04]"
        >
          <p className="text-[10px] text-gray-500 mb-0.5">{m.label}</p>
          <p
            className="text-sm font-bold leading-tight"
            style={{ color: m.color ?? '#e5e7eb' }}
          >
            {m.value}
          </p>
          {m.sub && (
            <p className="text-[10px] text-gray-500 mt-0.5">{m.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
