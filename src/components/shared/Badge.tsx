interface BadgeProps {
  text: string;
  color: string;
}

export default function Badge({ text, color }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: `${color}38`,
        border: `1px solid ${color}70`,
        color: color,
      }}
    >
      {text}
    </span>
  );
}
