interface TipCardProps {
  tip: string;
}

export default function TipCard({ tip }: TipCardProps) {
  return (
    <div
      className="rounded-lg px-3.5 py-3 border"
      style={{
        backgroundColor: 'rgba(0,212,170,0.08)',
        borderColor: 'rgba(0,212,170,0.15)',
      }}
    >
      <p className="text-[10px] font-semibold text-ivi-accent mb-1">
        💡 운전 습관 개선 팁
      </p>
      <p className="text-xs text-gray-700 leading-relaxed">{tip}</p>
    </div>
  );
}
