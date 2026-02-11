'use client';

import { useMemo, useState } from 'react';
import ScoreRing from '@/components/shared/ScoreRing';
import Badge from '@/components/shared/Badge';
import { drivingEvents, weeklyTrips } from '@/data/mock-driving-data';

// ── 지난 주 데이터 (비교용 mock) ──
const LAST_WEEK = {
  accel: 7,
  brake: 3,
  turn: 2,
  speed: 5,
  laneKeepHours: 3.8,
  safeDistanceM: 38,
};

// ── 항목별 추천 Tips ──
const TIPS: Record<string, { title: string; tips: string[] }> = {
  급가속: {
    title: '급가속 줄이기',
    tips: [
      '출발 시 3초간 천천히 페달을 밟아 부드럽게 가속하세요.',
      '신호가 바뀌어도 즉시 출발하지 말고, 1~2초 여유를 두세요.',
      '고속도로 합류 시 가속 차로를 충분히 활용하여 점진적으로 속도를 올리세요.',
      '에코 모드를 활용하면 급가속을 자연스럽게 억제할 수 있습니다.',
    ],
  },
  급제동: {
    title: '급제동 줄이기',
    tips: [
      '전방 차량과 최소 3초 이상의 안전거리를 유지하세요.',
      '교차로 접근 시 미리 속도를 줄이고 방어 운전을 실천하세요.',
      '전방 2~3대 차량의 브레이크등을 함께 주시하세요.',
      '비 오는 날이나 야간에는 평소보다 안전거리를 1.5배 확보하세요.',
    ],
  },
  급회전: {
    title: '급회전 줄이기',
    tips: [
      '커브 진입 전에 충분히 감속한 후 회전하세요.',
      '핸들을 급하게 돌리지 말고, 부드럽게 조향하세요.',
      '내비게이션의 경로 안내를 미리 확인하여 차선 변경을 일찍 준비하세요.',
      'U턴이나 좌회전 시 서행하며 주변 상황을 확인하세요.',
    ],
  },
  과속: {
    title: '과속 예방하기',
    tips: [
      '크루즈 컨트롤(정속 주행)을 적극 활용하세요.',
      '제한속도 알림 기능을 활성화하여 속도를 자연스럽게 인식하세요.',
      '여유 있는 출발 시간을 확보하면 과속 유혹이 줄어듭니다.',
      '스쿨존, 주거지역에서는 30km/h 이하로 서행하세요.',
    ],
  },
  차선유지: {
    title: '차선유지 개선하기',
    tips: [
      '운전 중 스마트폰 사용을 삼가고 전방 주시에 집중하세요.',
      '장시간 운전 시 2시간마다 10분 이상 휴식을 취하세요.',
      '차선이탈 경고 시스템(LDWS)을 항상 켜두세요.',
      '졸음이 올 때는 즉시 안전한 곳에 정차하고 휴식하세요.',
    ],
  },
  안전거리: {
    title: '안전거리 확보하기',
    tips: [
      '전방 차량이 특정 지점을 통과한 후 3초 뒤에 같은 지점을 지나는지 확인하세요.',
      '고속도로에서는 최소 100m 이상의 차간거리를 유지하세요.',
      '비·눈·안개 시에는 평소의 2배 이상 안전거리를 확보하세요.',
      '전방 충돌 방지 보조(FCA) 기능을 항상 활성화해 두세요.',
    ],
  },
};

// ── 보험사 데이터 ──
const INSURERS = [
  { name: '삼성화재', discount: 12, color: '#3b82f6', bg: '#1e3a5f' },
  { name: '현대해상', discount: 9, color: '#00d4aa', bg: '#0d3d30' },
  { name: 'DB손보', discount: 11, color: '#a78bfa', bg: '#2d2052' },
];

// ── 이벤트 횟수 → 점수 변환 (횟수가 적을수록 높은 점수) ──
function countToScore(count: number, max: number): number {
  return Math.round(Math.max(0, Math.min(100, 100 - (count / max) * 60)));
}

// ── 시간/거리 → 점수 변환 (값이 높을수록 높은 점수) ──
function valueToScore(value: number, target: number): number {
  return Math.round(Math.min(100, (value / target) * 100));
}

// ── 컴포넌트 ──

export default function SafetyScoreTab() {
  const [openTip, setOpenTip] = useState<string | null>(null);

  const safetyItems = useMemo(() => {
    // 이번 주 이벤트 횟수 집계
    const accelCount = drivingEvents.filter(
      (e) => e.category === 'accel' && (e.type === 'warn' || e.type === 'danger'),
    ).length;
    const brakeCount = drivingEvents.filter(
      (e) => e.category === 'brake' && (e.type === 'warn' || e.type === 'danger'),
    ).length;
    const speedCount = drivingEvents.filter(
      (e) => e.category === 'speed' && (e.type === 'warn' || e.type === 'danger'),
    ).length;
    // 급회전: 현재 mock 데이터에 별도 카테고리 없으므로 고정값
    const turnCount = 1;

    // 총 주행 시간(분) → 시간
    const totalDurationMin = weeklyTrips.reduce((sum, t) => sum + t.duration, 0);
    const totalDurationHrs = totalDurationMin / 60;
    // 차선유지 시간 (총 주행시간의 84% 수준)
    const laneKeepHours = Math.round(totalDurationHrs * 0.84 * 10) / 10;
    // 평균 안전거리 (m)
    const safeDistanceM = 42;

    return [
      {
        label: '급가속',
        icon: '⚡',
        value: accelCount,
        unit: '회',
        lastWeek: LAST_WEEK.accel,
        score: countToScore(accelCount, 10),
        lowerIsBetter: true,
      },
      {
        label: '급제동',
        icon: '🛑',
        value: brakeCount,
        unit: '회',
        lastWeek: LAST_WEEK.brake,
        score: countToScore(brakeCount, 10),
        lowerIsBetter: true,
      },
      {
        label: '급회전',
        icon: '↩️',
        value: turnCount,
        unit: '회',
        lastWeek: LAST_WEEK.turn,
        score: countToScore(turnCount, 10),
        lowerIsBetter: true,
      },
      {
        label: '과속',
        icon: '💨',
        value: speedCount,
        unit: '회',
        lastWeek: LAST_WEEK.speed,
        score: countToScore(speedCount, 10),
        lowerIsBetter: true,
      },
      {
        label: '차선유지',
        icon: '🛣️',
        value: laneKeepHours,
        unit: '시간',
        lastWeek: LAST_WEEK.laneKeepHours,
        score: valueToScore(laneKeepHours, 5),
        lowerIsBetter: false,
      },
      {
        label: '안전거리',
        icon: '📏',
        value: safeDistanceM,
        unit: 'm',
        lastWeek: LAST_WEEK.safeDistanceM,
        score: valueToScore(safeDistanceM, 50),
        lowerIsBetter: false,
      },
    ];
  }, []);

  // 종합 안전점수 (항목 평균)
  const overallScore = Math.round(
    safetyItems.reduce((s, item) => s + item.score, 0) / safetyItems.length,
  );

  return (
    <div className="flex flex-col gap-3">
      {/* ── 1. 종합 안전점수 카드 ── */}
      <div
        className="rounded-xl p-6 border border-white/[0.06] flex flex-col items-center"
        style={{
          background: 'linear-gradient(180deg, #1a2235 0%, #0f1a2e 100%)',
        }}
      >
        <ScoreRing score={overallScore} size={160} />

        <div className="mt-4">
          <Badge text="안전 운전자 등급" color="#00d4aa" />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          상위 <span className="text-gray-300 font-semibold">23%</span> ·
          지난주 대비{' '}
          <span className="text-ivi-accent font-semibold">+3점</span>
        </p>
      </div>

      {/* ── 2. 세부 항목 Grid (2×3) ── */}
      <div className="grid grid-cols-2 gap-2">
        {safetyItems.map((item) => {
          const diff = Math.round((item.value - item.lastWeek) * 10) / 10;
          const absDiff = Math.abs(diff);
          const isImproved = item.lowerIsBetter ? diff < 0 : diff > 0;
          const isWorse = item.lowerIsBetter ? diff > 0 : diff < 0;
          const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '−';

          let changeColor = 'text-gray-500';
          if (isImproved) changeColor = 'text-emerald-400';
          if (isWorse) changeColor = 'text-red-400';

          const needsTip = item.score <= 80;
          const tipData = TIPS[item.label];
          const isTipOpen = openTip === item.label;

          return (
            <div key={item.label} className="flex flex-col">
              <div
                className={`bg-ivi-surfaceLight rounded-xl p-4 border flex items-center gap-3 relative
                  ${isTipOpen ? 'border-amber-500/40 rounded-b-none' : 'border-white/[0.06]'}`}
              >
                {/* 미니 ScoreRing */}
                <ScoreRing score={item.score} size={48} />

                {/* 텍스트 */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] text-gray-500 leading-tight">
                    {item.icon} {item.label}
                  </span>

                  <span className="text-lg font-bold text-gray-100 leading-tight">
                    {item.value}
                    <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                      {item.unit}
                    </span>
                  </span>

                  <span className={`text-[10px] font-medium leading-tight ${changeColor}`}>
                    {arrow} {absDiff}
                    {item.unit}{' '}
                    <span className="text-gray-600 font-normal">vs 지난주</span>
                  </span>
                </div>

                {/* 추천 Tips 아이콘 (80점 이하) */}
                {needsTip && tipData && (
                  <button
                    onClick={() => setOpenTip(isTipOpen ? null : item.label)}
                    className={`absolute -top-1 -right-1 flex items-center gap-0.5 px-1.5 py-0.5
                      rounded-full text-[9px] font-bold transition-all duration-200 shadow-md
                      ${isTipOpen
                        ? 'bg-amber-500 text-gray-900 scale-110'
                        : 'bg-amber-500/90 text-gray-900 hover:bg-amber-400 hover:scale-105 animate-pulse'
                      }`}
                    aria-label={`${item.label} 추천 팁 보기`}
                  >
                    <span className="text-[10px]">💡</span>
                    Tips!
                  </button>
                )}
              </div>

              {/* ── 추천 Tips 패널 (펼침) ── */}
              {needsTip && tipData && (
                <div
                  className="expand-panel"
                  data-open={isTipOpen}
                >
                  <div className="expand-inner">
                    <div className="bg-gradient-to-b from-amber-500/10 to-amber-500/5
                      border border-t-0 border-amber-500/40 rounded-b-xl px-3 py-3">
                      <p className="text-[11px] font-bold text-amber-400 mb-1.5">
                        💡 {tipData.title}
                      </p>
                      <ul className="space-y-1.5">
                        {tipData.tips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex gap-1.5 text-[10px] text-gray-400 leading-relaxed"
                          >
                            <span className="text-amber-500/70 mt-0.5 shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 3. ADAS 사용시간 ── */}
      <div className="rounded-xl border border-white/[0.06] overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #141c2e 0%, #111827 100%)' }}
      >
        {/* 헤더 */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <span className="text-base">🛞</span>
          <h3 className="text-sm font-bold text-gray-100">ADAS 사용시간</h3>
          <span className="text-[10px] text-gray-600 ml-auto">이번 주 누적</span>
        </div>

        {/* 3-컬럼 카드 */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.04] mx-3 mb-4 rounded-lg overflow-hidden">
          {/* LFA */}
          <div className="bg-ivi-surface flex flex-col items-center py-4 px-2 gap-2">
            {/* 심볼: 차선유지 */}
            <div className="w-10 h-10 rounded-full bg-sky-500/15 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20 L8 4" />
                <path d="M16 20 L20 4" />
                <path d="M12 20 L12 8" />
                <circle cx="12" cy="5" r="2" fill="#38bdf8" stroke="none" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-sky-400 font-bold tracking-wide">LFA</p>
              <p className="text-[9px] text-gray-500 leading-tight">차선유지</p>
            </div>
            <p className="text-xl font-extrabold text-gray-100 leading-none">2.8
              <span className="text-[10px] font-normal text-gray-500">h</span>
            </p>
            <p className="text-[9px] text-emerald-400 font-medium">▲ 0.5h vs 지난주</p>
          </div>

          {/* HDA */}
          <div className="bg-ivi-surface flex flex-col items-center py-4 px-2 gap-2">
            {/* 심볼: 고속도로 */}
            <div className="w-10 h-10 rounded-full bg-violet-500/15 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18" />
                <path d="M7 7l5 5-5 5" />
                <path d="M14 7l5 5-5 5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-violet-400 font-bold tracking-wide">HDA</p>
              <p className="text-[9px] text-gray-500 leading-tight">고속도로 지원</p>
            </div>
            <p className="text-xl font-extrabold text-gray-100 leading-none">1.5
              <span className="text-[10px] font-normal text-gray-500">h</span>
            </p>
            <p className="text-[9px] text-emerald-400 font-medium">▲ 0.3h vs 지난주</p>
          </div>

          {/* 스마트 크루즈 */}
          <div className="bg-ivi-surface flex flex-col items-center py-4 px-2 gap-2">
            {/* 심볼: 크루즈 */}
            <div className="w-10 h-10 rounded-full bg-ivi-accent/15 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
                <path d="M5 12h1" />
                <path d="M18 12h1" />
                <path d="M12 5v-1" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-ivi-accent font-bold tracking-wide">SCC</p>
              <p className="text-[9px] text-gray-500 leading-tight">스마트 크루즈</p>
            </div>
            <p className="text-xl font-extrabold text-gray-100 leading-none">3.2
              <span className="text-[10px] font-normal text-gray-500">h</span>
            </p>
            <p className="text-[9px] text-red-400 font-medium">▼ 0.8h vs 지난주</p>
          </div>
        </div>

        {/* 총 사용시간 요약 바 */}
        <div className="mx-3 mb-4 rounded-lg bg-white/[0.03] px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">총 ADAS 사용시간</span>
          <span className="text-sm font-bold text-gray-200">
            7.5<span className="text-[10px] font-normal text-gray-500 ml-0.5">시간</span>
            <span className="text-[10px] font-normal text-gray-600 ml-1.5">
              / 주행시간의 <span className="text-ivi-accent font-semibold">150%</span>
            </span>
          </span>
        </div>
      </div>

      {/* ── 4. 보험 연계 혜택 카드 ── */}
      <div
        className="rounded-xl p-5 border border-white/[0.06]"
        style={{
          background: 'linear-gradient(135deg, #111d33 0%, #0f1a2e 100%)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-xl">🛡️</span>
          <div>
            <h3 className="text-sm font-bold text-gray-100">보험 연계 혜택</h3>
            <p className="text-[11px] text-gray-500">
              안전점수 기반 UBI 보험 할인
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 min-[0px]:grid-cols-3">
          {INSURERS.map((ins) => (
            <div
              key={ins.name}
              className="rounded-lg p-3 border flex flex-col items-center gap-2"
              style={{
                backgroundColor: ins.bg,
                borderColor: `${ins.color}22`,
              }}
            >
              <span
                className="text-xl font-extrabold leading-none"
                style={{ color: ins.color }}
              >
                -{ins.discount}%
              </span>
              <span className="text-[11px] text-gray-400 font-medium text-center leading-tight">
                {ins.name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-gray-600 text-center">
          * 할인율은 안전점수와 주행 이력에 따라 변동될 수 있습니다
        </p>
      </div>
    </div>
  );
}
