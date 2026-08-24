export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          className="size-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sunrise arc */}
          <path
            d="M7 19.5C8.8 14.7 13.3 11.5 18.5 11.5C21.2 11.5 23.7 12.4 25.5 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Travel route */}
          <path
            d="M6 22.5H26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Route points */}
          <circle cx="7" cy="22.5" r="1.5" fill="currentColor" />
          <circle cx="25" cy="22.5" r="1.5" fill="currentColor" />

          {/* Airplane */}
          <path
            d="M16.2 7.5L18.1 12.4L23.2 14.3C23.7 14.5 23.7 15.2 23.2 15.4L18.1 17.1L16.4 23.2C16.2 23.8 15.4 23.8 15.2 23.2L13.8 17.1L8.7 15.4C8.2 15.2 8.2 14.5 8.7 14.3L13.8 12.4L15.3 7.5C15.4 7 16 7 16.2 7.5Z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
      </span>

      {!compact && (
        <span className="leading-tight">
          <span className="block text-[16px] font-semibold tracking-tight text-foreground">
            Sunrise Travel
          </span>

          <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Corporate Travel
          </span>
        </span>
      )}
    </span>
  );
}