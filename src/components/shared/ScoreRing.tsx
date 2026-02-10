'use client';

import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size: number;
  color?: string;
}

export default function ScoreRing({ score, size, color }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const strokeWidth = Math.max(size * 0.07, 6);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // 점수에 따라 색상 자동 결정
  const resolvedColor =
    color ??
    (score >= 80 ? '#00d4aa' : score >= 60 ? '#f59e0b' : '#ef4444');

  useEffect(() => {
    const timer = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(timer);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* 배경 링 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* 점수 링 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            filter: `drop-shadow(0 0 6px ${resolvedColor}40)`,
          }}
        />
      </svg>

      {/* 중앙 점수 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-extrabold leading-none"
          style={{
            fontSize: size * 0.28,
            color: '#fff',
          }}
        >
          {animatedScore}
        </span>
        <span
          className="text-gray-500 font-medium"
          style={{ fontSize: size * 0.1 }}
        >
          /100
        </span>
      </div>
    </div>
  );
}
