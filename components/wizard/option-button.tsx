import { cn } from "@/lib/utils";

export function OptionButton({
  name,
  value,
  label,
  description,
  index,
  selected = false,
  multi = false,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  description?: string;
  index: number;
  selected?: boolean;
  multi?: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "group flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-md border px-4 py-3 text-left transition-colors duration-150 ease-out touch-manipulation",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
        selected
          ? "border-primary bg-accent text-foreground"
          : "border-border bg-card text-foreground hover:border-primary/50",
      )}
    >
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className="font-mono text-xs text-muted-foreground group-hover:text-primary"
      >
        {index}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-base font-medium tracking-tight">{label}</span>
        {description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </span>
      {multi ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 rounded-sm border",
            selected
              ? "border-primary bg-primary"
              : "border-border bg-transparent",
          )}
        />
      ) : null}
    </label>
  );
}
