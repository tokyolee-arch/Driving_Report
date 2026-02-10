'use client';

import ScoreRing from '@/components/shared/ScoreRing';
import Badge from '@/components/shared/Badge';

// ── 핵심 지표 데이터 ──

const KEY_METRICS = [
  { label: '총 주행거리', value: '35,820', unit: 'km', icon: '📍' },
  { label: '차량 연식', value: '1년 4개월', unit: '', icon: '📅' },
  { label: '사고이력', value: '0', unit: '건', icon: '🛡️' },
  { label: '정비이행률', value: '100', unit: '%', icon: '🔧' },
  { label: '배터리 SOH', value: '94', unit: '%', icon: '🔋' },
  { label: '평균안전점수', value: '82', unit: '점', icon: '⭐' },
];

// ── 가치 상승 요인 ──

const VALUE_FACTORS = [
  { factor: '무사고 이력 인증', impact: '+150만원' },
  { factor: '정비이행률 100%', impact: '+95만원' },
  { factor: '배터리 SOH 94%', impact: '+120만원' },
  { factor: '안전점수 A등급', impact: '+50만원' },
];

// ── 컴포넌트 ──

export default function VehicleValueTab() {
  return (
    <div className="flex flex-col gap-3">
      {/* ── 1. Vehicle Trust Score 히어로 ── */}
      <div
        className="rounded-xl p-6 border border-white/[0.06] flex flex-col items-center"
        style={{
          background: 'linear-gradient(180deg, #111d33 0%, #0f1a2e 100%)',
        }}
      >
        <p className="text-[10px] text-gray-500 tracking-[0.25em] font-semibold mb-4">
          VEHICLE TRUST SCORE
        </p>

        <ScoreRing score={91} size={140} color="#3b82f6" />

        <div className="mt-4">
          <Badge text="CERTIFIED EXCELLENT" color="#3b82f6" />
        </div>

        <p className="mt-2 text-[10px] text-gray-600">
          블록체인 인증 완료 · 데이터 무결성 검증됨
        </p>
      </div>

      {/* ── 2. 핵심 지표 Grid (2×3) ── */}
      <div className="grid grid-cols-2 gap-2">
        {KEY_METRICS.map((m) => (
          <div
            key={m.label}
            className="bg-ivi-surfaceLight rounded-xl px-4 py-3 border border-white/[0.06]"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{m.icon}</span>
              <span className="text-[10px] text-gray-500">{m.label}</span>
            </div>
            <p className="text-lg font-bold text-gray-100 leading-tight">
              {m.value}
              {m.unit && (
                <span className="text-[10px] font-normal text-gray-500 ml-0.5">
                  {m.unit}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* ── 3. 예상 시세 카드 ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-4">
          💎 예상 시세
        </h3>

        {/* 중앙 적정가 */}
        <div className="text-center mb-2">
          <span
            className="text-3xl font-extrabold"
            style={{
              background: 'linear-gradient(135deg, #00d4aa, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ₩32,500,000
          </span>
        </div>

        <p className="text-center text-[11px] text-gray-500 mb-4">
          잔존 가치율{' '}
          <span className="text-gray-300 font-semibold">72%</span> · 동급 평균
          대비{' '}
          <span className="text-ivi-accent font-semibold">+8%</span>
        </p>

        {/* 3칸: 하한가 / 적정가 / 상한가 */}
        <div className="grid grid-cols-3 gap-2">
          <PriceCell label="하한가" value="₩30,200,000" muted />
          <PriceCell label="적정가" value="₩32,500,000" highlighted />
          <PriceCell label="상한가" value="₩34,800,000" muted />
        </div>
      </div>

      {/* ── 4. 가치 상승 요인 카드 ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-3">
          📈 가치 상승 요인
        </h3>

        <div className="space-y-2.5">
          {VALUE_FACTORS.map((f) => (
            <div
              key={f.factor}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-ivi-accent text-[10px]">✦</span>
                <span className="text-xs text-gray-300 truncate">
                  {f.factor}
                </span>
              </div>
              <span className="text-xs font-bold text-ivi-accent shrink-0 ml-2">
                {f.impact}
              </span>
            </div>
          ))}
        </div>

        {/* 합산 */}
        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-xs text-gray-500">총 가치 상승 효과</span>
          <span className="text-sm font-extrabold text-ivi-accent">+415만원</span>
        </div>
      </div>

      {/* ── 5. CTA 버튼 2개 ── */}
      <div className="flex gap-2">
        {/* 리포트 공유 (gradient) */}
        <button
          aria-label="차량 리포트 공유하기"
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white
                     transition-all duration-200 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #00d4aa, #3b82f6)',
            boxShadow: '0 4px 16px rgba(0,212,170,0.25)',
          }}
        >
          📄 리포트 공유
        </button>

        {/* 중고차 연동 (outline) */}
        <button
          aria-label="중고차 플랫폼 연동하기"
          className="flex-1 py-3 rounded-xl text-sm font-bold
                     border border-white/[0.12] text-gray-300
                     bg-white/[0.02] hover:bg-white/[0.06]
                     transition-all duration-200 active:scale-[0.98]"
        >
          🔗 중고차 연동
        </button>
      </div>
    </div>
  );
}

// ── 시세 셀 서브 컴포넌트 ──

interface PriceCellProps {
  label: string;
  value: string;
  highlighted?: boolean;
  muted?: boolean;
}

function PriceCell({ label, value, highlighted, muted }: PriceCellProps) {
  return (
    <div
      className={`rounded-lg p-2.5 text-center border ${
        highlighted
          ? 'bg-ivi-accent/[0.08] border-ivi-accent/20'
          : 'bg-ivi-bg border-white/[0.04]'
      }`}
    >
      <p className="text-[9px] text-gray-500 mb-1">{label}</p>
      <p
        className={`text-[11px] font-bold leading-tight ${
          muted ? 'text-gray-400' : 'text-ivi-accent'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
