'use client';

import { useMemo } from 'react';
import type { DrivingEvent } from '@/types/driving-report';
import EventDetailPanel from './EventDetailPanel';
import Badge from '@/components/shared/Badge';

// ── Props ──

interface EventTimelineProps {
  events: DrivingEvent[];
  tripRoute: string;
  dateLabel: string;
  dayLabel: string;
  /** 외부에서 제어하는 확장 이벤트 ID */
  expandedId: string | null;
  /** 이벤트 토글 핸들러 */
  onToggleEvent: (id: string) => void;
}

export default function EventTimeline({
  events,
  tripRoute,
  dateLabel,
  dayLabel,
  expandedId,
  onToggleEvent,
}: EventTimelineProps) {

  const counts = useMemo(() => {
    let good = 0;
    let warn = 0;
    let danger = 0;

    for (const e of events) {
      if (e.type === 'good') good++;
      else if (e.type === 'warn') warn++;
      else if (e.type === 'danger') danger++;
    }

    return { good, warn, danger };
  }, [events]);

  const warnTotal = counts.warn + counts.danger;
  const hasEvents = events.length > 0;
  const isPerfect = hasEvents === false || (counts.warn === 0 && counts.danger === 0);

  return (
    <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-gray-100">
          📋 {dateLabel} ({dayLabel}) 주행 이벤트
        </h3>
        {warnTotal > 0 && (
          <Badge text={`주의 ${warnTotal}건`} color="#f59e0b" />
        )}
      </div>

      {/* 서브 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] text-gray-500">{tripRoute}</p>
        {hasEvents && (
          <p className="text-[10px] text-gray-600">항목을 눌러 상세 보기</p>
        )}
      </div>

      {/* ── 이벤트 목록 또는 빈 상태 ── */}
      {hasEvents ? (
        <div className="space-y-0.5">
          {events.map((ev) => (
            <EventDetailPanel
              key={ev.id}
              event={ev}
              isExpanded={expandedId === ev.id}
              onToggle={() => onToggleEvent(ev.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center gap-2">
          <span className="text-2xl">🚫</span>
          <p className="text-sm text-gray-500">
            이 날의 주행 기록이 없습니다.
          </p>
        </div>
      )}

      {/* ── 하단 뱃지 요약 ── */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-center gap-2 flex-wrap">
        {isPerfect && hasEvents ? (
          <Badge text="✨ 무결점 주행" color="#00d4aa" />
        ) : isPerfect && !hasEvents ? null : (
          <>
            {counts.good > 0 && (
              <Badge text={`달성 ${counts.good}건`} color="#00d4aa" />
            )}
            {counts.warn > 0 && (
              <Badge text={`주의 ${counts.warn}건`} color="#f59e0b" />
            )}
            {counts.danger > 0 && (
              <Badge text={`위험 ${counts.danger}건`} color="#ef4444" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
