'use client';

interface PillSelectorProps {
  options: string[];
  active: number;
  onChange: (index: number) => void;
}

export default function PillSelector({
  options,
  active,
  onChange,
}: PillSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="메트릭 선택"
      className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((label, i) => {
        const isActive = active === i;

        return (
          <button
            key={i}
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} 메트릭`}
            onClick={() => onChange(i)}
            className={`
              flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium
              transition-all duration-200 whitespace-nowrap
              ${
                isActive
                  ? 'bg-ivi-accent text-black font-semibold shadow-[0_2px_12px_rgba(0,212,170,0.25)]'
                  : 'bg-white/[0.04] text-gray-500 border border-white/[0.06] hover:bg-white/[0.08] hover:text-gray-300'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
