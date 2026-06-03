export function ResultsPanel() {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Savings Results
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Your calculated savings results will appear here once you complete the
        calculator.
      </p>
    </div>
  );
}
