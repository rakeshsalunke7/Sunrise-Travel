const styles: Record<string, string> = {
  PENDING:
    "bg-warning-muted text-warning-foreground border-warning/30",

  APPROVED:
    "bg-success-muted text-success-foreground border-success/30",

  REJECTED:
    "bg-destructive/10 text-destructive border-destructive/30",

  TICKETED:
    "bg-primary/10 text-primary border-primary/25",

  CANCELLED:
    "bg-muted text-muted-foreground border-border",
};

const dotStyles: Record<string, string> = {
  PENDING: "bg-warning",
  APPROVED: "bg-success",
  REJECTED: "bg-destructive",
  TICKETED: "bg-primary",
  CANCELLED: "bg-muted-foreground",
};

export function StatusBadge({ status }: { status?: string }) {
  const key = (status ?? "").toUpperCase();

  const className =
    styles[key] ?? "bg-muted text-muted-foreground border-border";

  const dotClassName =
    dotStyles[key] ?? "bg-muted-foreground";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${className}`}
    >
      <span
        className={`size-1.5 rounded-full ${dotClassName}`}
        aria-hidden="true"
      />

      {key || "UNKNOWN"}
    </span>
  );
}