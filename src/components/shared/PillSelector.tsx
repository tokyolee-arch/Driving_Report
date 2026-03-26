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
              flex-1 px-2 py-1.5 rounded-full text-xs font-medium text-center
              transition-all duration-200 whitespace-nowrap
              ${
                isActive
                  ? 'bg-gray-900 text-white font-bold shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                  : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200 hover:text-gray-700'
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
