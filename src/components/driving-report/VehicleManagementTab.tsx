'use client';

import { maintenanceRecords } from '@/data/mock-driving-data';
import ProgressBar from '@/components/shared/ProgressBar';

// ── 소모품 데이터 (사양서 기준) ──

const CONSUMABLES = [
  { label: '브레이크패드(전)', percent: 42, detail: '교체 4,200km 남음', color: '#f59e0b' },
  { label: '브레이크패드(후)', percent: 68, detail: '교체 11,500km 남음', color: '#00d4aa' },
  { label: '타이어마모도', percent: 55, detail: '교체 16,500km 남음', color: '#00d4aa' },
  { label: '에어컨필터', percent: 25, detail: '즉시 교체 권장', color: '#ef4444' },
  { label: '와이퍼블레이드', percent: 60, detail: '교체 6,000km 남음', color: '#00d4aa' },
  { label: '배터리 SOH', percent: 94, detail: '양호 상태', color: '#00d4aa' },
];

// ── 날짜 포맷 유틸 ──

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatCost(cost: number): string {
  if (cost === 0) return '무상';
  return `₩${cost.toLocaleString()}`;
}

// ── 컴포넌트 ──

export default function VehicleManagementTab() {
  return (
    <div className="flex flex-col gap-3">
      {/* ── 1. 소모품 상태 카드 ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-4">
          🔧 소모품 상태
        </h3>

        <div className="space-y-3.5">
          {CONSUMABLES.map((c) => (
            <ProgressBar
              key={c.label}
              value={c.percent}
              max={100}
              color={c.color}
              label={c.label}
              detail={c.detail}
            />
          ))}
        </div>
      </div>

      {/* ── 2. 정비 이력 카드 ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-4">
          📋 정비 이력
        </h3>

        <div className="space-y-0">
          {maintenanceRecords.map((rec, i) => {
            const isFree = rec.cost === 0;
            const isLast = i === maintenanceRecords.length - 1;

            return (
              <div
                key={`${rec.date}-${rec.item}`}
                className={`flex items-center gap-3 py-3 ${
                  !isLast ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                {/* 아이콘 */}
                <div className="w-9 h-9 rounded-lg bg-ivi-bg flex items-center justify-center text-base shrink-0">
                  {rec.icon}
                </div>

                {/* 정비항목 + 날짜·주행거리 */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-200 truncate">
                    {rec.item}
                  </p>
                  <p className="text-[10px] text-gray-600">
                    {formatDate(rec.date)} · {rec.mileage.toLocaleString()}km
                  </p>
                </div>

                {/* 비용 */}
                <span
                  className={`text-xs font-bold shrink-0 ${
                    isFree ? 'text-ivi-accent' : 'text-gray-300'
                  }`}
                >
                  {formatCost(rec.cost)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. 정비 알림 배너 ── */}
      <div
        className="rounded-xl p-4 border flex items-start gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.04) 100%)',
          borderColor: 'rgba(245,158,11,0.18)',
        }}
      >
        {/* 아이콘 */}
        <div className="w-9 h-9 rounded-lg bg-ivi-warning/15 flex items-center justify-center text-lg shrink-0">
          ⚠️
        </div>

        {/* 텍스트 */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-ivi-warning mb-1">
            정비 알림
          </p>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            브레이크 패드(전) 점검 권장 · 에어컨 필터 교체 필요
          </p>
        </div>
      </div>
    </div>
  );
}
