'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import TripSummaryTab from '@/components/driving-report/TripSummaryTab';
import SafetyScoreTab from '@/components/driving-report/SafetyScoreTab';
import VehicleManagementTab from '@/components/driving-report/VehicleManagementTab';
import VehicleValueTab from '@/components/driving-report/VehicleValueTab';

// ── Tab 정의 ──

const TABS = [
  { icon: '🚗', label: '주행요약' },
  { icon: '🛡️', label: '안전점수' },
  { icon: '🔧', label: 'Service' },
  { icon: '💎', label: '차량가치' },
];

// ── 오늘 날짜 문자열 ──

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const w = weekdays[d.getDay()];
  return `${y}.${m}.${day} (${w})`;
}

// ── Tab 콘텐츠 렌더 ──

function TabContent({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <TripSummaryTab />;
    case 1:
      return <SafetyScoreTab />;
    case 2:
      return <VehicleManagementTab />;
    case 3:
      return <VehicleValueTab />;
    default:
      return null;
  }
}

// ── 컴포넌트 ──

export default function DrivingReportPage() {
  const [activeTab, setActiveTab] = useState(0);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Tab 키보드 네비게이션 (좌/우 화살표)
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = activeTab;
      if (e.key === 'ArrowRight') next = (activeTab + 1) % TABS.length;
      else if (e.key === 'ArrowLeft') next = (activeTab - 1 + TABS.length) % TABS.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = TABS.length - 1;
      else return;

      e.preventDefault();
      setActiveTab(next);
    },
    [activeTab]
  );

  // 포커스를 새 활성 탭 버튼으로 이동
  useEffect(() => {
    const list = tabListRef.current;
    if (!list) return;
    const btn = list.querySelectorAll<HTMLButtonElement>('[role="tab"]')[activeTab];
    btn?.focus();
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen bg-ivi-bg flex flex-col">
      {/* ── Header (sticky) ── */}
      <header className="sticky top-0 z-30 bg-ivi-bg/80 backdrop-blur-md border-b border-white/[0.04]">
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center justify-between">
            {/* 좌측 */}
            <div>
              <p className="text-[9px] text-gray-600 tracking-[0.2em] font-medium">
                DRIVING REPORT
              </p>
              <h1 className="text-base font-bold text-gray-100 -mt-0.5">
                주행 리포트
              </h1>
            </div>

            {/* 우측 */}
            <div className="text-right">
              <p className="text-[10px] text-gray-500">{getTodayString()}</p>
              <p className="text-[10px] font-semibold text-ivi-accent flex items-center justify-end gap-1 mt-0.5">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full bg-ivi-accent animate-pulse"
                  aria-hidden="true"
                />
                LIVE
              </p>
            </div>
          </div>
        </div>

        {/* ── Tab Bar (ARIA tablist) ── */}
        <div className="px-4 pb-3">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="주행 리포트 탭"
            onKeyDown={handleTabKeyDown}
            className="bg-ivi-surfaceLight rounded-xl p-1 flex"
          >
            {TABS.map((tab, i) => {
              const isActive = activeTab === i;
              return (
                <button
                  key={i}
                  role="tab"
                  id={`tab-${i}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${i}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(i)}
                  aria-label={`${tab.label} 탭`}
                  className={`
                    flex-1 py-2 rounded-lg text-[11px] font-semibold
                    transition-all duration-200 relative
                    ${
                      isActive
                        ? 'text-ivi-accent'
                        : 'text-gray-500 hover:text-gray-400'
                    }
                  `}
                  style={
                    isActive
                      ? {
                          background:
                            'linear-gradient(180deg, rgba(0,212,170,0.08) 0%, rgba(0,212,170,0.02) 100%)',
                        }
                      : undefined
                  }
                >
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="text-sm" aria-hidden="true">
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </span>

                  {/* 하단 accent 보더 */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-ivi-accent"
                      style={{
                        boxShadow: '0 0 6px rgba(0,212,170,0.4)',
                      }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Content (fade-in on tab switch) ── */}
      <main
        className="flex-1 min-h-0 overflow-y-auto px-4 py-3 animate-fade-in"
        key={activeTab}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <TabContent index={activeTab} />
      </main>

      {/* ── Footer ── */}
      <footer className="px-5 py-4 text-center">
        <p className="text-[9px] text-gray-700">
          차량 VIN: KMH●●●●●●●●35820 · Blockchain Verified
        </p>
      </footer>
    </div>
  );
}
