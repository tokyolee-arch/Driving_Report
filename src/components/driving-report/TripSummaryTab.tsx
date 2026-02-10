'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  weeklyTrips,
  weeklySummary,
  drivingEvents,
} from '@/data/mock-driving-data';
import TripCard from '@/components/trip-summary/TripCard';
import WeeklyChart from '@/components/trip-summary/WeeklyChart';
import EventTimeline from '@/components/trip-summary/EventTimeline';

// ── 상수 ──

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// ── 오늘 인덱스 계산 (weekStart 기준) ──

function getTodayIndex(): number {
  const start = new Date(weeklySummary.weekStart);
  const now = new Date();
  const diff = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff >= 0 && diff <= 6 ? diff : 6;
}

// ── 요일별 이벤트 그루핑 (미리 계산) ──

const eventsByDay: Record<number, typeof drivingEvents> = {};
for (let i = 0; i < 7; i++) {
  const date = weeklyTrips[i].date;
  eventsByDay[i] = drivingEvents.filter((e) => e.tripDate === date);
}

// ── 날짜 라벨 (MM.DD) ──

function getDateLabel(dayIndex: number): string {
  const d = new Date(weeklyTrips[dayIndex].date);
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// ── 컴포넌트 ──

export default function TripSummaryTab() {
  const todayIndex = useMemo(() => getTodayIndex(), []);

  // ─ State ─
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [weeklyMetric, setWeeklyMetric] = useState(0);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // ─ 파생 데이터 ─
  const trip = weeklyTrips[selectedDay];
  const dayEvents = eventsByDay[selectedDay] ?? [];
  const isToday = selectedDay === todayIndex;
  const dateLabel = getDateLabel(selectedDay);
  const dayLabel = DAY_LABELS[selectedDay];
  const tripRoute = `${trip.from} → ${trip.to}`;

  // ─ 핸들러 ─
  const handleSelectDay = useCallback(
    (day: number) => {
      setSelectedDay(day);
      setExpandedEvent(null); // 요일 변경 시 확장 리셋
    },
    []
  );

  const handleToggleEvent = useCallback((id: string) => {
    setExpandedEvent((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* 블록 1: 주행 정보 카드 */}
      <TripCard
        trip={trip}
        isToday={isToday}
        dateLabel={dateLabel}
        dayLabel={dayLabel}
      />

      {/* 블록 2: 주간 주행 현황 차트 */}
      <WeeklyChart
        weeklyData={weeklySummary.days}
        metricIndex={weeklyMetric}
        selectedDay={selectedDay}
        onSelectDay={handleSelectDay}
        weekStart={weeklySummary.weekStart}
        onMetricChange={setWeeklyMetric}
      />

      {/* 블록 3: 주행 이벤트 타임라인 */}
      <EventTimeline
        events={dayEvents}
        tripRoute={tripRoute}
        dateLabel={dateLabel}
        dayLabel={dayLabel}
        expandedId={expandedEvent}
        onToggleEvent={handleToggleEvent}
      />
    </div>
  );
}
