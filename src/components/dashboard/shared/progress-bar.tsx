interface ProgressBarProps {
  value: number;
  colorClass?: string;
}

export function ProgressBar({
  value,
  colorClass = "bg-success-alt",
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

