import type { DailyTrip } from '@/types/driving-report';
import Badge from '@/components/shared/Badge';

interface TripCardProps {
  trip: DailyTrip;
  isToday: boolean;
  dateLabel: string;
  dayLabel: string;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function TripCard({
  trip,
  isToday,
  dateLabel,
  dayLabel,
}: TripCardProps) {
  const noTrip = trip.distance === 0 && trip.duration === 0;

  return (
    <div className="bg-ivi-surfaceLight rounded-xl p-4 border border-white/[0.06]">
      {/* ── 상단: 제목 + Badge ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-100">
          {isToday
            ? '🚗 오늘 주행'
            : `🚗 ${dateLabel} (${dayLabel}) 주행`}
        </h3>
        {noTrip ? (
          <Badge text="주행 없음" color="#6b7280" />
        ) : (
          <Badge
            text={isToday ? '최근' : dateLabel}
            color={isToday ? '#00d4aa' : '#3b82f6'}
          />
        )}
      </div>

      {noTrip ? (
        /* ── 주행기록 없는 날 ── */
        <div className="py-6 flex flex-col items-center gap-2">
          <span className="text-2xl">🅿️</span>
          <p className="text-sm text-gray-500">이 날은 주행 기록이 없습니다</p>
          {trip.safetyScore > 0 && (
            <p className="text-[11px] text-gray-600">
              누적 안전점수 <span className="text-ivi-accent font-semibold">{trip.safetyScore}점</span>
            </p>
          )}
        </div>
      ) : (
        <>
          {/* ── 중단: 경로 표시 ── */}
          <div className="flex gap-3 mb-4">
            <div className="flex flex-col items-center py-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ivi-accent shadow-[0_0_6px_rgba(0,212,170,0.4)]" />
              <div className="w-px flex-1 my-1 bg-gradient-to-b from-ivi-accent/40 to-ivi-info/40" />
              <div className="w-2.5 h-2.5 rounded-full border-2 border-ivi-info shadow-[0_0_6px_rgba(59,130,246,0.3)]" />
            </div>
            <div className="flex flex-col justify-between min-h-[44px]">
              <span className="text-sm font-semibold text-gray-100">{trip.from}</span>
              <span className="text-sm font-semibold text-gray-100">{trip.to}</span>
            </div>
          </div>

          {/* ── 하단: 4칸 그리드 ── */}
          <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2">
            <MetricCell icon="📍" label="거리" value={`${trip.distance}`} unit="km" />
            <MetricCell icon="⏱" label="시간" value={formatDuration(trip.duration)} />
            <MetricCell icon="⚡" label="효율" value={`${trip.energyEfficiency}`} unit="kWh" />
            <MetricCell
              icon="🔋"
              label="소비"
              value={`${trip.energyConsumed}`}
              unit="kWh"
              sub={`₩${trip.estimatedCost.toLocaleString()}`}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ── 메트릭 셀 서브 컴포넌트 ── */

interface MetricCellProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}

function MetricCell({ icon, label, value, unit, sub }: MetricCellProps) {
  return (
    <div className="bg-ivi-bg rounded-lg p-2.5 flex flex-col items-center gap-1">
      <span className="text-xs">{icon}</span>
      <span className="text-[13px] font-bold text-gray-100 leading-tight">
        {value}
        {unit && (
          <span className="text-[10px] font-normal text-gray-500 ml-0.5">
            {unit}
          </span>
        )}
      </span>
      {sub ? (
        <span className="text-[10px] text-ivi-accent font-medium">{sub}</span>
      ) : (
        <span className="text-[10px] text-gray-600">{label}</span>
      )}
    </div>
  );
}
