export function SummaryPanel() {
  return (
    <div
      role="region"
      aria-label="Energy summary"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Energy Summary
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Your period-over-period energy savings summary will appear here.
      </p>
    </div>
  );
}
