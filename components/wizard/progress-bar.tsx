export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <div className="space-y-2">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        className="h-0.5 w-full overflow-hidden bg-border"
      >
        <div
          className="h-full bg-primary motion-safe:transition-[width] motion-safe:duration-300 motion-safe:ease-out"
          style={{ width: `${clamped * 100}%` }}
        />
      </div>
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
