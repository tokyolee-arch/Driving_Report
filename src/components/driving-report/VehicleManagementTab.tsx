'use client';

import { useState } from 'react';
import ProgressBar from '@/components/shared/ProgressBar';

// ── 소모품 데이터 (배터리 SOH 제외) ──
const CONSUMABLES = [
  { label: '브레이크패드(전)', percent: 42, detail: '교체 4,200km 남음', color: '#f59e0b' },
  { label: '브레이크패드(후)', percent: 68, detail: '교체 11,500km 남음', color: '#00d4aa' },
  { label: '타이어마모도', percent: 55, detail: '교체 16,500km 남음', color: '#00d4aa' },
  { label: '에어컨필터', percent: 25, detail: '즉시 교체 권장', color: '#ef4444' },
  { label: '와이퍼블레이드', percent: 60, detail: '교체 6,000km 남음', color: '#00d4aa' },
];

// ── 서비스 퀵액션 버튼 ──
const SERVICE_ACTIONS = [
  {
    label: '차량진단',
    sub: 'OBD 스캔',
    color: '#3b82f6',
    bg: '#1e3a5f',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9h.01" /><path d="M15 9h.01" />
        <path d="M9 15h.01" /><path d="M15 15h.01" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    label: '와이퍼',
    sub: '정비모드',
    color: '#00d4aa',
    bg: '#0d3d30',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v6" />
        <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M3 20h18" />
        <path d="M8 20l4-8 4 8" />
      </svg>
    ),
  },
  {
    label: '카메라',
    sub: '보정',
    color: '#a78bfa',
    bg: '#2d2052',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    label: '휠 & 타이어',
    sub: '공기압 · 마모',
    color: '#f59e0b',
    bg: '#3d2e0f',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4" /><path d="M12 18v4" />
        <path d="M2 12h4" /><path d="M18 12h4" />
      </svg>
    ),
  },
];

// ── 정비 이력 데이터 ──
interface ServiceRecord {
  center: string;
  date: string;
  items: string[];
  totalCost: number;
  icon: string;
}

const SERVICE_RECORDS: ServiceRecord[] = [
  {
    center: '현대 강남 서비스센터',
    date: '2026-01-15',
    items: ['엔진오일 교체', '오일필터 교체', '차량 점검'],
    totalCost: 125000,
    icon: '🛢️',
  },
  {
    center: '현대 분당 서비스센터',
    date: '2025-11-22',
    items: ['에어컨 필터 교체', '실내 항균 세정'],
    totalCost: 55000,
    icon: '❄️',
  },
  {
    center: '현대 수원 서비스센터',
    date: '2025-09-10',
    items: ['종합점검', '엔진오일 교체', '브레이크액 보충', '타이어 공기압 조정'],
    totalCost: 185000,
    icon: '🔧',
  },
  {
    center: '현대 용인 서비스센터',
    date: '2025-07-05',
    items: ['타이어 로테이션', '휠 얼라인먼트'],
    totalCost: 60000,
    icon: '🛞',
  },
  {
    center: '현대 강남 서비스센터',
    date: '2025-05-18',
    items: ['와이퍼 블레이드 교체'],
    totalCost: 25000,
    icon: '🌧️',
  },
];

// 최근 3건만 표시
const RECENT_RECORDS = SERVICE_RECORDS.slice(0, 3);

// ── 유틸 ──
function formatDateLarge(dateStr: string): { month: string; day: string; year: string } {
  const d = new Date(dateStr);
  return {
    month: String(d.getMonth() + 1).padStart(2, '0'),
    day: String(d.getDate()).padStart(2, '0'),
    year: String(d.getFullYear()),
  };
}

function formatCost(cost: number): string {
  return `₩${cost.toLocaleString()}`;
}

function summarizeItems(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items[0]} 외 ${items.length - 1}건`;
}

// ── 컴포넌트 ──
export default function VehicleManagementTab() {
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">

      {/* ── 1. 서비스 퀵액션 버튼 4개 ── */}
      <div className="grid grid-cols-4 gap-2">
        {SERVICE_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="rounded-xl border p-3 flex flex-col items-center gap-2
              transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              backgroundColor: action.bg,
              borderColor: `${action.color}30`,
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${action.color}15` }}
            >
              {action.icon}
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-gray-200 leading-tight">
                {action.label}
              </p>
              <p className="text-[9px] text-gray-500 leading-tight">
                {action.sub}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* ── 2. 소모품 상태 카드 ── */}
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

      {/* ── 3. 배터리 헬스 ── */}
      <div
        className="rounded-xl border border-white/[0.06] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2027 0%, #0d1a26 100%)' }}
      >
        <div className="p-5 flex items-center gap-4">
          {/* 배터리 아이콘 + 게이지 */}
          <div className="relative shrink-0">
            <svg width="52" height="52" viewBox="0 0 52 52">
              {/* 배경 원 */}
              <circle cx="26" cy="26" r="22" fill="none" stroke="#1e293b" strokeWidth="4" />
              {/* 진행 원 (94%) */}
              <circle
                cx="26" cy="26" r="22"
                fill="none" stroke="#22c55e" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22 * 0.94} ${2 * Math.PI * 22 * 0.06}`}
                transform="rotate(-90 26 26)"
              />
              {/* 배터리 심볼 */}
              <rect x="19" y="18" width="14" height="16" rx="2" fill="none" stroke="#22c55e" strokeWidth="1.5" />
              <rect x="22" y="16" width="8" height="2" rx="1" fill="#22c55e" />
              <rect x="21" y="24" width="10" height="8" rx="1" fill="#22c55e" opacity="0.3" />
              <rect x="21" y="27" width="10" height="5" rx="1" fill="#22c55e" opacity="0.7" />
            </svg>
          </div>

          {/* 텍스트 */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-500 mb-0.5">배터리 헬스</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-gray-100">94</span>
              <span className="text-sm font-semibold text-gray-400">%</span>
              <span className="text-[10px] text-emerald-400 font-medium ml-1">양호</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5">잔여 용량 72.8 kWh / 77.4 kWh</p>
          </div>

          {/* 배터리 점검 버튼 */}
          <button
            className="shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-lg
              bg-emerald-500/10 border border-emerald-500/20
              hover:bg-emerald-500/20 transition-colors duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-[10px] font-bold text-emerald-400 whitespace-nowrap">배터리 점검</span>
          </button>
        </div>
      </div>

      {/* ── 4. 방문 정비 이력 (최근 3건) ── */}
      <div className="bg-ivi-surfaceLight rounded-xl p-5 border border-white/[0.06]">
        <h3 className="text-sm font-bold text-gray-100 mb-3">
          📋 방문 정비 이력
        </h3>

        <div className="space-y-0">
          {RECENT_RECORDS.map((rec, i) => {
            const isLast = i === RECENT_RECORDS.length - 1;
            const isExpanded = expandedRecord === i;
            const dt = formatDateLarge(rec.date);

            return (
              <div
                key={`${rec.date}-${rec.center}`}
                className={!isLast ? 'border-b border-white/[0.04]' : ''}
              >
                {/* 메인 행 */}
                <button
                  onClick={() => setExpandedRecord(isExpanded ? null : i)}
                  className="w-full flex items-center gap-3 py-3 text-left"
                >
                  {/* 날짜 (크게) */}
                  <div className="w-12 shrink-0 flex flex-col items-center">
                    <span className="text-lg font-extrabold text-gray-100 leading-none">
                      {dt.month}.{dt.day}
                    </span>
                    <span className="text-[9px] text-gray-600 mt-0.5">
                      {dt.year}
                    </span>
                  </div>

                  {/* 교체항목 요약 + 서비스센터 (1행) */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200 truncate">
                      <span className="font-semibold">{summarizeItems(rec.items)}</span>
                      <span className="text-[10px] text-gray-500 ml-1.5">
                        · {rec.center}
                      </span>
                    </p>
                  </div>

                  {/* 비용 + 화살표 */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-gray-300">
                      {formatCost(rec.totalCost)}
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className={`text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </button>

                {/* 확장 영역 */}
                <div className="expand-panel" data-open={isExpanded}>
                  <div className="expand-inner">
                    <div className="pb-3 pl-[60px] pr-1">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {rec.items.map((item, j) => (
                          <span
                            key={j}
                            className="text-[10px] bg-white/[0.05] text-gray-400 px-2 py-0.5 rounded-full border border-white/[0.06]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <button
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                          bg-ivi-accent/10 border border-ivi-accent/20
                          text-[11px] font-semibold text-ivi-accent
                          hover:bg-ivi-accent/20 transition-colors duration-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        영수증 · 계산서 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. 정비 알림 + 정비예약 버튼 ── */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.04) 100%)',
          borderColor: 'rgba(245,158,11,0.18)',
        }}
      >
        <div className="p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-ivi-warning/15 flex items-center justify-center text-lg shrink-0">
            ⚠️
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ivi-warning mb-1">정비 알림</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              브레이크 패드(전) 점검 권장 · 에어컨 필터 교체 필요
            </p>
          </div>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 py-3
            bg-ivi-warning/15 border-t border-ivi-warning/20
            text-sm font-bold text-ivi-warning
            hover:bg-ivi-warning/25 transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4" /><path d="M8 2v4" />
            <path d="M3 10h18" />
            <path d="M12 14v4" /><path d="M10 16h4" />
          </svg>
          정비 예약하기
        </button>
      </div>

      {/* ── 6. 사용자 매뉴얼 버튼 ── */}
      <button
        className="w-full rounded-xl border border-white/[0.08] bg-ivi-surfaceLight
          flex items-center justify-center gap-2.5 py-4
          hover:bg-white/[0.06] transition-colors duration-200"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
        <span className="text-sm font-semibold text-gray-400">사용자 매뉴얼</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
