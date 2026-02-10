'use client';

import ScoreRing from '@/components/shared/ScoreRing';
import Badge from '@/components/shared/Badge';

// ── 세부 항목 데이터 ──

const SAFETY_ITEMS = [
  { label: '급가속', score: 88, icon: '🚀' },
  { label: '급제동', score: 75, icon: '🛑' },
  { label: '급회전', score: 91, icon: '↩️' },
  { label: '과속', score: 78, icon: '💨' },
  { label: '차선유지', score: 85, icon: '🛣' },
  { label: '안전거리', score: 70, icon: '📏' },
];

// ── 보험사 데이터 ──

const INSURERS = [
  { name: '삼성화재', discount: 12, color: '#3b82f6', bg: '#1e3a5f' },
  { name: '현대해상', discount: 9, color: '#00d4aa', bg: '#0d3d30' },
  { name: 'DB손보', discount: 11, color: '#a78bfa', bg: '#2d2052' },
];

// ── 컴포넌트 ──

export default function SafetyScoreTab() {
  return (
    <div className="flex flex-col gap-3">
      {/* ── 1. 종합 안전점수 카드 ── */}
      <div
        className="rounded-xl p-6 border border-white/[0.06] flex flex-col items-center"
        style={{
          background: 'linear-gradient(180deg, #1a2235 0%, #0f1a2e 100%)',
        }}
      >
        {/* ScoreRing */}
        <ScoreRing score={82} size={160} />

        {/* Badge */}
        <div className="mt-4">
          <Badge text="안전 운전자 등급" color="#00d4aa" />
        </div>

        {/* 부가 텍스트 */}
        <p className="mt-2 text-xs text-gray-500">
          상위 <span className="text-gray-300 font-semibold">23%</span> ·
          지난달 대비{' '}
          <span className="text-ivi-accent font-semibold">+3점</span>
        </p>
      </div>

      {/* ── 2. 세부 항목 Grid (2×3) ── */}
      <div className="grid grid-cols-2 gap-2">
        {SAFETY_ITEMS.map((item) => (
          <div
            key={item.label}
            className="bg-ivi-surfaceLight rounded-xl p-4 border border-white/[0.06]
                       flex items-center gap-3"
          >
            {/* 미니 ScoreRing */}
            <ScoreRing score={item.score} size={48} />

            {/* 텍스트 */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-500">
                {item.icon} {item.label}
              </span>
              <span className="text-lg font-bold text-gray-100 leading-tight">
                {item.score}
                <span className="text-[10px] font-normal text-gray-600 ml-0.5">
                  점
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. 보험 연계 혜택 카드 ── */}
      <div
        className="rounded-xl p-5 border border-white/[0.06]"
        style={{
          background: 'linear-gradient(135deg, #111d33 0%, #0f1a2e 100%)',
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-xl">🛡️</span>
          <div>
            <h3 className="text-sm font-bold text-gray-100">보험 연계 혜택</h3>
            <p className="text-[11px] text-gray-500">
              안전점수 기반 UBI 보험 할인
            </p>
          </div>
        </div>

        {/* 보험사 카드 3개 */}
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
              {/* 할인율 */}
              <span
                className="text-xl font-extrabold leading-none"
                style={{ color: ins.color }}
              >
                -{ins.discount}%
              </span>

              {/* 보험사명 */}
              <span className="text-[11px] text-gray-400 font-medium text-center leading-tight">
                {ins.name}
              </span>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <p className="mt-3 text-[10px] text-gray-600 text-center">
          * 할인율은 안전점수와 주행 이력에 따라 변동될 수 있습니다
        </p>
      </div>
    </div>
  );
}
