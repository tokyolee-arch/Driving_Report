'use client';

import { useMemo } from 'react';
import { drivingEvents, weeklyTrips } from '@/data/mock-driving-data';

// ── 타입 ──────────────────────────────────────────────────────────────
type CheckupStatus = 'good' | 'low' | 'high';

interface CheckupItem {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  position: number;   // 0–100, 현재 bar 위치
  minGood: number;    // 적정구간 시작 (%)
  maxGood: number;    // 적정구간 끝 (%)
  status: CheckupStatus;
  displayValue: string;
  subNote?: string;   // bar 하단 보조 설명 (거리성향 기준값 등)
  tip?: string;       // status !== 'good' 일 때 표시
}

// ── CheckupBar (내부 컴포넌트) ──────────────────────────────────────
function CheckupBar({
  position,
  minGood,
  maxGood,
  status,
}: {
  position: number;
  minGood: number;
  maxGood: number;
  status: CheckupStatus;
}) {
  const clampedPos = Math.min(100, Math.max(0, position));

  const markerColor =
    status === 'good'
      ? '#00d4aa'
      : status === 'low'
      ? '#60a5fa'
      : '#f87171';

  const markerGlow =
    status === 'good'
      ? '0 0 8px rgba(0,212,170,0.7)'
      : status === 'low'
      ? '0 0 8px rgba(96,165,250,0.7)'
      : '0 0 8px rgba(248,113,113,0.7)';

  return (
    <div className="mt-3 mb-1">
      {/* ── Bar ── */}
      <div className="relative h-4 rounded-full overflow-visible">
        {/* 배경 바 (3구역) */}
        <div className="absolute inset-0 rounded-full flex overflow-hidden">
          {/* 미흡 구간 */}
          <div
            className="h-full"
            style={{
              width: `${minGood}%`,
              background: 'linear-gradient(90deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.4) 100%)',
            }}
          />
          {/* 적정 구간 */}
          <div
            className="h-full"
            style={{
              width: `${maxGood - minGood}%`,
              background: 'linear-gradient(90deg, rgba(0,212,170,0.4) 0%, rgba(0,212,170,0.6) 50%, rgba(0,212,170,0.4) 100%)',
              boxShadow: 'inset 0 0 8px rgba(0,212,170,0.3)',
            }}
          />
          {/* 과다 구간 */}
          <div
            className="h-full flex-1"
            style={{
              background: 'linear-gradient(90deg, rgba(239,68,68,0.3) 0%, rgba(239,68,68,0.5) 100%)',
            }}
          />
        </div>

        {/* 적정구간 테두리 강조선 */}
        <div
          className="absolute top-0 bottom-0 rounded-sm"
          style={{
            left: `${minGood}%`,
            width: `${maxGood - minGood}%`,
            border: '1px solid rgba(0,212,170,0.4)',
            borderRadius: 4,
          }}
        />

        {/* 현재 위치 마커 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[2.5px] border-gray-200 z-10 transition-all duration-500"
          style={{
            left: `${clampedPos}%`,
            backgroundColor: markerColor,
            boxShadow: `${markerGlow}, 0 2px 6px rgba(0,0,0,0.5)`,
          }}
        />
      </div>

      {/* ── 구간 라벨 ── */}
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-[10px] font-medium text-blue-400">미흡</span>
        <span
          className="text-[10px] font-semibold"
          style={{ color: '#00d4aa' }}
        >
          적정구간
        </span>
        <span className="text-[10px] font-medium text-red-600">과다</span>
      </div>
    </div>
  );
}

// ── 상태 뱃지 ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CheckupStatus }) {
  const config =
    status === 'good'
      ? { label: '✓ 양호', color: '#00d4aa', bg: 'rgba(0,212,170,0.15)', border: 'rgba(0,212,170,0.3)' }
      : status === 'low'
      ? { label: '↗ 미흡', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' }
      : { label: '↑ 과다', color: '#f87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.3)' };

  return (
    <span
      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.label}
    </span>
  );
}

// ── 항목 카드 ───────────────────────────────────────────────────────
function CheckupCard({ item }: { item: CheckupItem }) {
  return (
    <div
      className="rounded-xl border border-gray-200 overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      <div className="px-4 pt-4 pb-3">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">{item.icon}</span>
            <div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.title}</h3>
              <p className="text-[10px] text-gray-400 leading-tight">{item.titleEn}</p>
            </div>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Bar */}
        <CheckupBar
          position={item.position}
          minGood={item.minGood}
          maxGood={item.maxGood}
          status={item.status}
        />

        {/* 보조 기준값 (거리성향 등) */}
        {item.subNote && (
          <p className="text-[9px] text-gray-400 text-center -mt-0.5 mb-1">{item.subNote}</p>
        )}

        {/* 현재 값 */}
        <p className="text-[12px] text-gray-700 mt-2 font-medium">
          <span className="text-[10px] text-gray-500 mr-1">현재</span>
          {item.displayValue}
        </p>
      </div>

      {/* 팁 (미흡/과다일 때) */}
      {item.tip && item.status !== 'good' && (
        <div
          className="mx-4 mb-4 px-3 py-2 rounded-lg border-l-2 border-amber-500/70"
          style={{ background: 'rgba(245,158,11,0.06)' }}
        >
          <p className="text-[11px] text-amber-600 leading-relaxed">
            <span className="mr-1">💡</span>
            {item.tip}
          </p>
        </div>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function DriveCheckupTab() {
  const checkupItems = useMemo<CheckupItem[]>(() => {
    // 1. 속도성향: 과속 이벤트 횟수 기반
    const speedEvents = drivingEvents.filter(
      (e) => e.category === 'speed' && (e.type === 'warn' || e.type === 'danger'),
    ).length;
    // 0회 → position 10(미흡-너무 느림), 2회 이하 → 적정(25-70), 3회↑ → 과다
    // 단순 mock: 이번 주 3회 → position 55 (적정 내)
    const speedPos = Math.min(95, 20 + speedEvents * 8 + 15); // 0회→35, 3회→55, 7회→91
    const speedStatus: CheckupStatus =
      speedPos < 25 ? 'low' : speedPos > 70 ? 'high' : 'good';

    // 총 주행거리
    const totalKm = weeklyTrips.reduce((s, t) => s + t.distance, 0);
    const avgSpeedKmh = Math.round(
      (totalKm / (weeklyTrips.reduce((s, t) => s + t.duration, 0) / 60)) * 10,
    ) / 10;

    // 2. 거리성향: mock 데이터 (일반/고속 구분, 정체 제외)
    //    일반도로 기준: 22m (적정 30–60m → 미흡)
    //    고속도로 기준: 65m (적정 80–120m → 미흡)
    const normalDist = 22;  // m (일반도로, 40–80 km/h 구간)
    const highwayDist = 65; // m (고속도로, 80 km/h↑ 구간)
    // 종합 점수: 일반도로 적정 30m 하한에 대해 22/30 = 0.73, 고속 65/80 = 0.81
    // weighted (7:3) → 0.73*0.7 + 0.81*0.3 = 0.754 → position ≈ 20% (미흡 하단)
    const distPos = 20;
    const distStatus: CheckupStatus = 'low';

    // 3. 주행집중도: 차선유지율 + 급이벤트 수 기반
    const totalDurMin = weeklyTrips.reduce((s, t) => s + t.duration, 0);
    const laneKeepHrs = (totalDurMin / 60) * 0.84;
    const laneKeepPct = Math.round((laneKeepHrs / (totalDurMin / 60)) * 100);
    const suddenEvents = drivingEvents.filter(
      (e) => e.type === 'warn' || e.type === 'danger',
    ).length;
    // 높은 차선유지율 + 적은 급이벤트 → 높은 집중도
    // position = laneKeepPct - (suddenEvents * 2) + offset
    const focusPos = Math.min(90, Math.max(10, laneKeepPct - suddenEvents * 1.5 + 5));
    const focusStatus: CheckupStatus =
      focusPos < 35 ? 'low' : focusPos > 80 ? 'high' : 'good';

    // 4. 경제운전: 에너지 소비율 (Wh/km) — mock 248 Wh/km
    //    적정 구간: 160–230 Wh/km → position 30–75%
    //    현재 248 Wh/km → position 82% (과다)
    const ecoWh = 248;
    // 100 Wh/km → pos 5, 160 → pos 30, 230 → pos 75, 300 → pos 95
    const ecoPos = Math.round(5 + ((ecoWh - 100) / (300 - 100)) * 90);
    const ecoStatus: CheckupStatus =
      ecoPos < 30 ? 'low' : ecoPos > 75 ? 'high' : 'good';

    return [
      {
        id: 'speed',
        icon: '🏎️',
        title: '속도성향',
        titleEn: 'Speed Pattern',
        position: speedPos,
        minGood: 25,
        maxGood: 70,
        status: speedStatus,
        displayValue: `평균 ${avgSpeedKmh} km/h · 과속 ${speedEvents}회/주`,
        tip: speedStatus === 'high'
          ? '크루즈 컨트롤을 활용해 제한속도를 자연스럽게 유지하세요.'
          : '도로 상황에 맞는 적절한 속도를 유지해 교통 흐름에 맞춰 주세요.',
      },
      {
        id: 'distance',
        icon: '🚗',
        title: '거리성향',
        titleEn: 'Following Distance',
        position: distPos,
        minGood: 30,
        maxGood: 75,
        status: distStatus,
        displayValue: `일반 ${normalDist}m · 고속 ${highwayDist}m (정체 제외)`,
        subNote: '일반도로 적정 30–60m / 고속도로 적정 80–120m',
        tip: '일반도로에서 앞 차와 30m 이상 거리를 유지하세요. (시속 60 km 기준 약 1.8초)',
      },
      {
        id: 'focus',
        icon: '👁️',
        title: '주행집중도',
        titleEn: 'Driving Focus',
        position: focusPos,
        minGood: 35,
        maxGood: 80,
        status: focusStatus,
        displayValue: `차선유지 ${laneKeepPct}% · 급이벤트 ${suddenEvents}회/주`,
        tip: focusStatus === 'low'
          ? '장시간 주행 시 2시간마다 10분 이상 휴식을 취하세요.'
          : '운전 중 스마트폰 사용을 삼가고 전방 주시에 집중하세요.',
      },
      {
        id: 'eco',
        icon: '🌿',
        title: '경제운전',
        titleEn: 'Eco Driving',
        position: ecoPos,
        minGood: 30,
        maxGood: 75,
        status: ecoStatus,
        displayValue: `평균 ${ecoWh} Wh/km`,
        tip: ecoStatus === 'high'
          ? '급가속·급제동을 줄이고 회생제동을 적극 활용하면 에너지를 20% 절약할 수 있습니다.'
          : '전기차의 특성상 적절한 가속이 에너지 효율에 도움이 됩니다.',
      },
    ];
  }, []);

  const goodCount = checkupItems.filter((i) => i.status === 'good').length;

  // 날짜 범위 (mock 주간: Feb 9–15, 2026)
  const weekRange = 'Feb 9 – 15, 2026';

  return (
    <div className="flex flex-col gap-3">
      {/* ── 헤더 카드 ── */}
      <div
        className="rounded-xl px-5 py-4 border border-gray-200 flex items-center justify-between"
        style={{ background: '#ffffff' }}
      >
        <div>
          <p className="text-[9px] text-gray-400 tracking-[0.2em] font-medium mb-0.5">
            DRIVE CHECKUP
          </p>
          <h2 className="text-base font-bold text-gray-800">주행 습관 건강검진</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">{weekRange}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center border-2"
            style={{
              borderColor: goodCount >= 3 ? '#00d4aa' : goodCount >= 2 ? '#f59e0b' : '#ef4444',
              background: goodCount >= 3
                ? 'rgba(0,212,170,0.1)'
                : goodCount >= 2
                ? 'rgba(245,158,11,0.1)'
                : 'rgba(239,68,68,0.1)',
            }}
          >
            <span className="text-xl font-extrabold text-gray-900 leading-none">{goodCount}</span>
            <span className="text-[9px] text-gray-500 leading-tight">/ 4 양호</span>
          </div>
          <p className="text-[9px] text-gray-400">4개 항목 분석</p>
        </div>
      </div>

      {/* ── 4개 항목 카드 ── */}
      {checkupItems.map((item) => (
        <CheckupCard key={item.id} item={item} />
      ))}

      {/* ── 안내 문구 ── */}
      <p className="text-[10px] text-gray-400 text-center pb-2">
        * 정체 구간(40 km/h 미만)은 거리성향 계산에서 제외됩니다
      </p>
    </div>
  );
}
