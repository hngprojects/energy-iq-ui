interface ProgressBarProps {
  value: number;
  colorClass?: string;
}

export function ProgressBar({
  value,
  colorClass = "bg-[#17CC4E]",
}: ProgressBarProps) {
  return (
    <div className="progress-container">
      <div
        className={`progress-fill ${colorClass}`}
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

