'use client';

import { useMemo } from 'react';
import type { WeeklyDayData } from '@/types/driving-report';
import PillSelector from '@/components/shared/PillSelector';

// ── 메트릭 정의 ──────────────────────────────

interface MetricDef {
  label: string;
  unit: string;
  color: string;
  key: keyof WeeklyDayData;
  /** true면 낮을수록 좋은 값 (연비) */
  lowerBetter?: boolean;
  /** score 계열이면 등급별 색상 적용 */
  graded?: boolean;
}

const METRICS: MetricDef[] = [
  { label: '주행거리', unit: 'km', color: '#a78bfa', key: 'distance' },
  { label: '평균연비', unit: 'kWh', color: '#00d4aa', key: 'efficiency', lowerBetter: true },
  { label: '에너지 소모', unit: 'kWh', color: '#3b82f6', key: 'consumption' },
  { label: '에코드라이빙', unit: '%', color: '#10b981', key: 'ecoScore', graded: true },
  { label: '운전점수', unit: '점', color: '#f59e0b', key: 'safetyScore', graded: true },
];

const PILL_OPTIONS = METRICS.map((m) => m.label);
const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// ── 색상 유틸 ────────────────────────────────

function getBarColor(metric: MetricDef, value: number, allValues: number[]): string {
  if (metric.lowerBetter) {
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    const ratio = (value - min) / range;
    if (ratio <= 0.35) return '#00d4aa';
    if (ratio <= 0.65) return '#f59e0b';
    return '#ef4444';
  }
  if (metric.graded) {
    if (value >= 80) return '#00d4aa';
    if (value >= 70) return '#f59e0b';
    return '#ef4444';
  }
  return metric.color;
}

// ── Props ────────────────────────────────────

interface WeeklyChartProps {
  weeklyData: WeeklyDayData[];
  metricIndex: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  /** 주간 시작일 'YYYY-MM-DD' (월요일) */
  weekStart: string;
  /** 메트릭 pill 변경 핸들러 */
  onMetricChange: (index: number) => void;
}

// ── 컴포넌트 ─────────────────────────────────

export default function WeeklyChart({
  weeklyData,
  metricIndex,
  selectedDay,
  onSelectDay,
  weekStart,
  onMetricChange,
}: WeeklyChartProps) {
  const metric = METRICS[metricIndex];
  const values = weeklyData.map((d) => d[metric.key]);
  const maxVal = Math.max(...values) * 1.15 || 1;

  // 오늘 인덱스 계산
  const todayIndex = useMemo(() => {
    const start = new Date(weekStart);
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff >= 0 && diff <= 6 ? diff : -1;
  }, [weekStart]);

  // 날짜 라벨 (MM.DD)
  const dateLabels = useMemo(() => {
    const start = new Date(weekStart);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    });
  }, [weekStart]);

  // 하단 요약 계산 (주행 없는 날 0 값은 평균/최고에서 제외)
  const summary = useMemo(() => {
    const selected = values[selectedDay];
    const isNoTrip = metricIndex !== 4 && selected === 0; // 운전점수 제외, 0이면 주행 없음

    // 0이 아닌 값만 필터 (운전점수는 제외)
    const activeValues = metricIndex === 4
      ? values
      : values.filter((v) => v > 0);
    const total = activeValues.reduce((a, b) => a + b, 0);
    const avg = activeValues.length > 0 ? total / activeValues.length : 0;
    const best = activeValues.length > 0
      ? (metric.lowerBetter ? Math.min(...activeValues) : Math.max(...activeValues))
      : 0;

    const selStr = isNoTrip ? '-' : undefined;

    switch (metricIndex) {
      case 0:
        return [
          { label: '주간 총 거리', value: `${total.toFixed(1)}km` },
          { label: '일 평균', value: `${avg.toFixed(1)}km` },
          { label: '선택일', value: selStr ?? `${selected.toFixed(1)}km` },
        ];
      case 1:
        return [
          { label: '주간 평균', value: `${avg.toFixed(1)}kWh` },
          { label: '최고 효율', value: `${best.toFixed(1)}kWh` },
          { label: '선택일', value: selStr ?? `${selected.toFixed(1)}kWh` },
        ];
      case 2:
        return [
          { label: '주간 총 소비', value: `${total.toFixed(1)}kWh` },
          { label: '일 평균', value: `${avg.toFixed(1)}kWh` },
          { label: '선택일', value: selStr ?? `${selected.toFixed(1)}kWh` },
        ];
      case 3:
        return [
          { label: '주간 평균', value: `${avg.toFixed(0)}점` },
          { label: '최고 점수', value: `${best.toFixed(0)}점` },
          { label: '선택일', value: selStr ?? `${selected.toFixed(0)}점` },
        ];
      case 4:
        return [
          { label: '주간 평균', value: `${avg.toFixed(0)}점` },
          { label: '최고 점수', value: `${best.toFixed(0)}점` },
          { label: '선택일', value: `${selected.toFixed(0)}점` },
        ];
      default:
        return [];
    }
  }, [metricIndex, values, selectedDay, metric.lowerBetter]);

  const isIntMetric = metricIndex >= 3;

  return (
    <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
      {/* 제목 */}
      <h3 className="text-sm font-bold text-gray-100 mb-3">📊 주간 주행 현황</h3>

      {/* Pill Selector */}
      <PillSelector
        options={PILL_OPTIONS}
        active={metricIndex}
        onChange={onMetricChange}
      />

      {/* ── 막대 차트 ── */}
      <div className="mt-4 flex items-end justify-between gap-1" style={{ height: 115 }}>
        {values.map((val, i) => {
          const isSelected = selectedDay === i;
          const isToday = todayIndex === i;
          const barHeight = Math.max((val / maxVal) * 100, 4);
          const barColor = getBarColor(metric, val, values);
          const displayVal = isIntMetric ? val.toFixed(0) : val.toFixed(1);

          return (
            <button
              key={i}
              onClick={() => onSelectDay(i)}
              aria-label={`${DAY_LABELS[i]}요일 (${dateLabels[i]}) — ${displayVal}${metric.unit}`}
              aria-pressed={isSelected}
              className="flex-1 flex flex-col items-center justify-end h-full relative group"
            >
              {/* 수치 라벨 */}
              <span
                className={`text-[10px] font-semibold mb-1 transition-opacity duration-200 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
                }`}
                style={{ color: barColor }}
              >
                {displayVal}
              </span>

              {/* 막대 */}
              <div
                className="rounded-t-md transition-all duration-500 ease-out"
                style={{
                  width: isSelected ? '80%' : '60%',
                  height: `${barHeight}%`,
                  backgroundColor: isSelected ? barColor : `${barColor}70`,
                  boxShadow: isSelected
                    ? `0 0 12px ${barColor}50, 0 0 4px ${barColor}30`
                    : 'none',
                }}
              />

              {/* 선택 도트 */}
              {isSelected && (
                <div
                  className="w-1 h-1 rounded-full mt-1.5"
                  style={{
                    backgroundColor: barColor,
                    boxShadow: `0 0 4px ${barColor}80`,
                  }}
                />
              )}

              {/* 요일 + 날짜 */}
              <div className="mt-1 flex flex-col items-center">
                {isToday ? (
                  <span className="text-[9px] font-bold text-ivi-accent">오늘</span>
                ) : (
                  <span
                    className={`text-[10px] font-medium ${
                      isSelected ? 'text-gray-200' : 'text-gray-600'
                    }`}
                  >
                    {DAY_LABELS[i]}
                  </span>
                )}
                <span
                  className={`text-[8px] ${
                    isSelected ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {dateLabels[i]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── 하단 요약 3칸 ── */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-2">
        {summary.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-gray-600">{item.label}</span>
            <span className="text-sm font-bold text-gray-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
