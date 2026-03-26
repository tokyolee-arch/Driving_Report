interface ImpactCardProps {
  impact: string;
  typeColor: string;
}

export default function ImpactCard({ impact, typeColor }: ImpactCardProps) {
  return (
    <div
      className="rounded-lg px-3.5 py-3 border"
      style={{
        backgroundColor: `${typeColor}0D`,
        borderColor: `${typeColor}22`,
      }}
    >
      <p className="text-[10px] font-semibold mb-1" style={{ color: typeColor }}>
        💰 영향 분석
      </p>
      <p className="text-xs text-gray-700 leading-relaxed">{impact}</p>
    </div>
  );
}
