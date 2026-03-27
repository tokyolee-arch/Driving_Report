'use client';

import { useMemo, useState } from 'react';
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

// ── 안전운전 레벨 시스템 ──────────────────────────────────────────────
interface LevelDef {
  level: number;
  label: string;
  icon: string;
  color: string;
  minScore: number;
}

const LEVELS: LevelDef[] = [
  { level: 1,  label: '새싹 드라이버',   icon: '🌱', color: '#a3e635', minScore: 0 },
  { level: 2,  label: '초보 드라이버',   icon: '🔰', color: '#86efac', minScore: 10 },
  { level: 3,  label: '일반 드라이버',   icon: '🚗', color: '#67e8f9', minScore: 20 },
  { level: 4,  label: '안전 드라이버',   icon: '🛡️', color: '#38bdf8', minScore: 30 },
  { level: 5,  label: '스마트 드라이버', icon: '⭐', color: '#818cf8', minScore: 40 },
  { level: 6,  label: '숙련 드라이버',   icon: '🏅', color: '#a78bfa', minScore: 50 },
  { level: 7,  label: '프로 드라이버',   icon: '💎', color: '#c084fc', minScore: 60 },
  { level: 8,  label: '엘리트 드라이버', icon: '🏆', color: '#f59e0b', minScore: 70 },
  { level: 9,  label: '마스터 드라이버', icon: '👑', color: '#f97316', minScore: 80 },
  { level: 10, label: '레전드 드라이버', icon: '🐉', color: '#ef4444', minScore: 90 },
];

function getLevel(score: number): LevelDef {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return LEVELS[i];
  }
  return LEVELS[0];
}

function getNextLevel(current: LevelDef): LevelDef | null {
  return LEVELS.find((l) => l.level === current.level + 1) ?? null;
}

/** 각 항목의 적정구간 안에 얼마나 가까운지를 0–25점으로 환산 */
function itemScore(position: number, minGood: number, maxGood: number): number {
  const center = (minGood + maxGood) / 2;
  const halfRange = (maxGood - minGood) / 2;
  const dist = Math.abs(position - center);
  const ratio = Math.max(0, 1 - dist / (halfRange * 2));
  return Math.round(ratio * 25);
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

  // 종합 점수 계산 (0–100)
  const totalScore = checkupItems.reduce(
    (sum, item) => sum + itemScore(item.position, item.minGood, item.maxGood),
    0,
  );
  const currentLevel = getLevel(totalScore);
  const nextLevel = getNextLevel(currentLevel);
  const progressInLevel = nextLevel
    ? ((totalScore - currentLevel.minScore) / (nextLevel.minScore - currentLevel.minScore)) * 100
    : 100;

  // 날짜 범위 (mock 주간: Feb 9–15, 2026)
  const weekRange = 'Feb 9 – 15, 2026';

  return (
    <div className="flex flex-col gap-3">
      {/* ── 안전운전 레벨 카드 ── */}
      <div
        className="rounded-xl border border-gray-200 overflow-hidden"
        style={{ background: '#ffffff' }}
      >
        <div className="px-5 pt-5 pb-4">
          <p className="text-[9px] text-gray-400 tracking-[0.2em] font-medium mb-1">
            SAFE DRIVING LEVEL
          </p>
          <h2 className="text-base font-bold text-gray-800">안전운전 레벨</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">{weekRange}</p>

          {/* 레벨 뱃지 + 정보 */}
          <div className="mt-4 flex items-center gap-4">
            {/* 큰 레벨 뱃지 */}
            <div
              className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${currentLevel.color}20, ${currentLevel.color}08)`,
                border: `2px solid ${currentLevel.color}40`,
              }}
            >
              <span className="text-3xl leading-none">{currentLevel.icon}</span>
              <span
                className="text-[10px] font-extrabold mt-1"
                style={{ color: currentLevel.color }}
              >
                Lv.{currentLevel.level}
              </span>
            </div>

            {/* 레벨 정보 */}
            <div className="flex-1 min-w-0">
              <p
                className="text-lg font-extrabold leading-tight"
                style={{ color: currentLevel.color }}
              >
                {currentLevel.label}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                종합 점수 <span className="font-bold text-gray-800">{totalScore}</span>점
                · 양호 <span className="font-bold text-gray-800">{goodCount}</span>/4 항목
              </p>

              {/* 경험치 바 */}
              {nextLevel && (
                <div className="mt-2.5">
                  <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                    <span>다음 레벨까지</span>
                    <span className="font-semibold" style={{ color: nextLevel.color }}>
                      {nextLevel.icon} {nextLevel.label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progressInLevel}%`,
                        background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5 text-right">
                    {nextLevel.minScore - totalScore}점 남음
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 레벨 미니맵 (전체 단계 표시) */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {LEVELS.map((lv) => {
              const isActive = lv.level === currentLevel.level;
              const isPassed = lv.level < currentLevel.level;
              return (
                <div key={lv.level} className="flex flex-col items-center" style={{ width: '10%' }}>
                  <span
                    className={`text-sm leading-none ${isActive ? '' : 'grayscale'}`}
                    style={{ opacity: isPassed || isActive ? 1 : 0.3 }}
                  >
                    {lv.icon}
                  </span>
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full mt-0.5"
                      style={{ backgroundColor: lv.color }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4개 항목 카드 ── */}
      {checkupItems.map((item) => (
        <CheckupCard key={item.id} item={item} />
      ))}

      {/* ── 안내 문구 ── */}
      <p className="text-[10px] text-gray-400 text-center pb-1">
        * 정체 구간(40 km/h 미만)은 거리성향 계산에서 제외됩니다
      </p>

      {/* ── 드라이브 100길 ── */}
      <Drive100Card />
    </div>
  );
}

// ── 드라이브 100길 카드 ─────────────────────────────────────────────
function Drive100Card() {
  const [showCourse, setShowCourse] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* 헤더 */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-2xl">🛣️</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">드라이브 100길</h3>
            <p className="text-[10px] text-gray-400">DRIVE 100 ROADS</p>
          </div>
        </div>
        <p className="text-[12px] text-gray-600 leading-relaxed">
          해당 도로를 모델로 하여 <span className="font-semibold text-gray-800">Driving Performance</span>를 코칭해 드립니다.
          아름다운 도로 위에서 안전운전 레벨을 높여보세요.
        </p>

        {/* 추천코스 소개 버튼 */}
        <button
          onClick={() => setShowCourse(!showCourse)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500
            text-sm font-bold text-white
            hover:from-emerald-600 hover:to-teal-600
            active:scale-[0.98] transition-all duration-200"
          style={{ boxShadow: '0 4px 14px rgba(0,212,170,0.3)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          추천코스 소개
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-300 ${showCourse ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* 대관령 옛길 소개 콘텐츠 */}
      <div className="expand-panel" data-open={showCourse}>
        <div className="expand-inner">
          <div className="border-t border-gray-100">
            {/* 코스 히어로 이미지 영역 */}
            <div
              className="relative h-44 flex items-end"
              style={{
                background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 40%, #6ee7b7 100%)',
              }}
            >
              {/* 산 실루엣 SVG */}
              <svg viewBox="0 0 400 120" className="absolute bottom-0 w-full" preserveAspectRatio="none">
                <path d="M0,120 L0,80 Q50,20 100,60 Q140,85 180,45 Q220,10 260,50 Q300,80 340,35 Q370,15 400,55 L400,120 Z" fill="#065f46" opacity="0.15" />
                <path d="M0,120 L0,90 Q60,50 120,75 Q170,95 220,60 Q270,30 320,70 Q360,90 400,65 L400,120 Z" fill="#065f46" opacity="0.1" />
              </svg>
              {/* 텍스트 오버레이 */}
              <div className="relative z-10 px-5 pb-4">
                <p className="text-[10px] font-bold text-emerald-800 tracking-widest">RECOMMENDED COURSE</p>
                <h4 className="text-xl font-extrabold text-emerald-900 mt-0.5">대관령 옛길</h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">강원도 강릉시 · 평창군</p>
              </div>
            </div>

            {/* 코스 정보 */}
            <div className="px-5 py-4">
              {/* 코스 스펙 */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { icon: '📏', label: '거리', value: '28.4km' },
                  { icon: '⏱️', label: '소요', value: '약 45분' },
                  { icon: '⛰️', label: '고도차', value: '820m' },
                  { icon: '⭐', label: '난이도', value: '중급' },
                ].map((spec) => (
                  <div key={spec.label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg py-2">
                    <span className="text-base">{spec.icon}</span>
                    <span className="text-[11px] font-bold text-gray-800">{spec.value}</span>
                    <span className="text-[9px] text-gray-400">{spec.label}</span>
                  </div>
                ))}
              </div>

              {/* 코스 설명 */}
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-gray-800 mb-1">🏔️ 코스 소개</h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    대관령 옛길은 강릉에서 대관령 정상까지 이어지는 구불구불한 산악도로입니다.
                    해발 832m의 고도차를 오르내리며 연속 커브와 오르막·내리막이 반복되어
                    <span className="font-semibold text-gray-800"> 코너링, 가감속 제어, 회생제동 활용</span>을
                    종합적으로 훈련할 수 있는 최적의 코스입니다.
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-gray-800 mb-1">🎯 코칭 포인트</h5>
                  <div className="space-y-1.5">
                    {[
                      { tag: '커브 구간', desc: '연속 헤어핀에서 부드러운 조향과 일정 속도 유지' },
                      { tag: '오르막', desc: '급가속 없이 일정 출력으로 에너지 효율 극대화' },
                      { tag: '내리막', desc: '회생제동 레벨 조절로 배터리 충전 & 브레이크 부담 감소' },
                      { tag: '안전거리', desc: '산악 도로 특성상 앞차와 충분한 거리 확보' },
                    ].map((point) => (
                      <div key={point.tag} className="flex gap-2">
                        <span
                          className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50
                            border border-emerald-200 px-1.5 py-0.5 rounded-md"
                        >
                          {point.tag}
                        </span>
                        <p className="text-[11px] text-gray-600 leading-snug">{point.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    <span className="font-bold">💡 Tip</span> — 이 코스를 주행하면 코너링·가감속·회생제동 3개 항목의
                    퍼포먼스 리포트를 받아볼 수 있으며, 안전운전 레벨 경험치가 <span className="font-bold">2배</span> 적립됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
