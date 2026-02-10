interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  label: string;
  detail: string;
}

export default function ProgressBar({
  value,
  max,
  color,
  label,
  detail,
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  return (
    <div className="flex flex-col gap-1.5">
      {/* 라벨 행 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-200">{label}</span>
        <span className="text-xs text-gray-500">{detail}</span>
      </div>

      {/* 바 */}
      <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}33`,
          }}
        />
      </div>
    </div>
  );
}
