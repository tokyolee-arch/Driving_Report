'use client';

import { useRef } from 'react';
import type { DrivingEvent } from '@/types/driving-report';
import MetricsGrid from '@/components/event-detail/MetricsGrid';
import SpeedGraph from '@/components/event-detail/SpeedGraph';
import ComparisonBar from '@/components/event-detail/ComparisonBar';
import ImpactCard from '@/components/event-detail/ImpactCard';
import TipCard from '@/components/event-detail/TipCard';
import MiniMap from '@/components/shared/MiniMap';

// ── type → 색상 매핑 ──

const TYPE_COLORS: Record<DrivingEvent['type'], string> = {
  good: '#00d4aa',
  warn: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
};

const TYPE_LABELS: Record<DrivingEvent['type'], string> = {
  good: '달성',
  warn: '주의',
  danger: '위험',
  info: '정보',
};

// ── Props ──

interface EventDetailPanelProps {
  event: DrivingEvent;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function EventDetailPanel({
  event,
  isExpanded,
  onToggle,
}: EventDetailPanelProps) {
  const typeColor = TYPE_COLORS[event.type];
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`transition-colors duration-200 rounded-xl ${
        isExpanded ? 'bg-ivi-surface' : ''
      }`}
    >
      {/* ── 접힌 헤더 (항상 표시) ── */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={`${event.time} ${event.title} (${TYPE_LABELS[event.type]}) — ${isExpanded ? '접기' : '펼치기'}`}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left group"
      >
        {/* 시간 */}
        <span className="text-xs text-gray-500 font-mono w-10 shrink-0">
          {event.time}
        </span>

        {/* 컬러 도트 */}
        <div
          className="w-2 h-2 rounded-full shrink-0"
          aria-hidden="true"
          style={{
            backgroundColor: typeColor,
            boxShadow: `0 0 6px ${typeColor}60`,
          }}
        />

        {/* 이벤트명 + 위치 */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-200 truncate">
            {event.title}
          </p>
          <p className="text-[10px] text-gray-600 truncate">{event.location}</p>
        </div>

        {/* 토글 화살표 */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`text-gray-600 shrink-0 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── 펼친 상세 (height transition via CSS grid) ── */}
      <div
        ref={panelRef}
        className="expand-panel"
        data-open={isExpanded}
      >
        <div className="expand-inner">
          <div className="pl-[52px] pr-3 pb-4 space-y-3">
            {/* 1. MetricsGrid */}
            <MetricsGrid metrics={event.metrics} />

            {/* 2. SpeedGraph */}
            {event.speedGraph && (
              <SpeedGraph data={event.speedGraph} color={typeColor} />
            )}

            {/* 3. ComparisonBar */}
            {event.comparison && <ComparisonBar data={event.comparison} />}

            {/* 4. MiniMap */}
            <MiniMap
              lat={event.gps.lat}
              lng={event.gps.lng}
              label={event.location}
              address={event.gps.address}
            />

            {/* 5. ImpactCard */}
            <ImpactCard impact={event.impact} typeColor={typeColor} />

            {/* 6. TipCard */}
            <TipCard tip={event.tip} />
          </div>
        </div>
      </div>
    </div>
  );
}
