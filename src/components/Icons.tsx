/** Inline SVG icons, traced from the design source so stroke weights match. */

type IconProps = {
  size?: number;
  className?: string;
};

const stroke = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowRight({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M5 12h13M12 6l6 6-6 6" />
    </svg>
  );
}

export function Phone({ size = 15, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M5 3h3l2 5-2.5 1.5a12 12 0 006 6L15 13l5 2v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-3z" />
    </svg>
  );
}

export function Menu({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function WhatsApp({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.13c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.03.24-3.5-.72-2.98-1.17-4.86-4.25-5.01-4.45-.15-.2-1.19-1.58-1.19-3.02 0-1.43.75-2.14 1.02-2.43.27-.29.58-.36.78-.36.2 0 .39.01.56.01.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.29.15.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.13.07.75-.17 1.47z" />
    </svg>
  );
}

export function Star({ size = 17, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.7 1.2 6.7L12 17.9 6.1 20.9l1.2-6.7L2.5 9.5l6.6-.9z" />
    </svg>
  );
}

/**
 * The Google "G", in Google's four brand colours.
 *
 * Deliberately not built on the `stroke` preset every icon above shares: this is
 * a brand mark with fixed fills, not a line icon. It must not inherit
 * currentColor and must not be recoloured — a monochrome Google G breaches
 * Google's brand guidelines, and more practically it stops reading as Google,
 * which is the whole reason it is on the page.
 */
export function GoogleG({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.4 5.4 0 01-2.4 3.58v3h3.86c2.26-2.09 3.57-5.17 3.57-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0012 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 010-4.58V6.62H1.29a11.98 11.98 0 000 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function Check({ size = 15, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.4}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Drag({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M9 7l-4 5 4 5M15 7l4 5-4 5" />
    </svg>
  );
}

export function Clipboard({ size = 21, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M9 4h6M8 4H6a2 2 0 00-2 2v13a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
      <path d="M8 11h8M8 15h5" />
    </svg>
  );
}

export function Mail({ size = 19, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function Pin({ size = 19, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function Clock({ size = 19, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Commercial sector glyphs — one per card on /commercial.

   Same 24-box, same 1.7–1.9 stroke as everything above, so a sector card sits
   in the same visual family as the Clock and Check marks beside it. Each is a
   building or a tool, never an abstract mark: the grid is scanned, not read, and
   a facility manager should find their own building at a glance.
   ------------------------------------------------------------------ */

export function Office({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M4 21V4.6a.6.6 0 01.6-.6h8.8a.6.6 0 01.6.6V21M14 21V9.6a.6.6 0 01.6-.6h4.8a.6.6 0 01.6.6V21M2.5 21h19M7.5 8h3M7.5 12h3M7.5 16h3M16.5 13h1.5M16.5 17h1.5" />
    </svg>
  );
}

export function Medical({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M12 3.4l7.5 3.1v5.7c0 4.8-3.1 7.9-7.5 8.8-4.4-.9-7.5-4-7.5-8.8V6.5L12 3.4z" />
      <path d="M12 9.3v6M9 12.3h6" />
    </svg>
  );
}

export function School({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M2.4 8.2L12 4l9.6 4.2L12 12.5 2.4 8.2z" />
      <path d="M6.3 10.1v5.3c0 1.7 2.6 3.1 5.7 3.1s5.7-1.4 5.7-3.1v-5.3M21.6 8.2v5.6" />
    </svg>
  );
}

export function Retail({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M3.6 7.4h16.8l-1.1 12.5a1.2 1.2 0 01-1.2 1.1H5.9a1.2 1.2 0 01-1.2-1.1L3.6 7.4z" />
      <path d="M8.4 7.4V5.5a3.6 3.6 0 017.2 0v1.9" />
    </svg>
  );
}

export function Warehouse({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M2.5 20.5V9.7L12 4.4l9.5 5.3v10.8M2 20.5h20M7.4 20.5v-6.8h9.2v6.8M7.4 16.7h9.2" />
    </svg>
  );
}

export function Restaurant({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M6.8 3.3v5.1a2.3 2.3 0 004.6 0V3.3M9.1 10.7v10M16.6 3.3c1.4 1.2 2.1 2.8 2.1 4.6s-.7 3.4-2.1 4.6v8.2" />
    </svg>
  );
}

export function Gym({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M6.9 6.3v11.4M3.7 8.9v6.2M17.1 6.3v11.4M20.3 8.9v6.2M6.9 12h10.2" />
    </svg>
  );
}

export function Strata({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M9.4 21V3.6a.6.6 0 01.6-.6h8.4a.6.6 0 01.6.6V21M2.5 21v-9.4a.6.6 0 01.6-.6h6.3M2 21h20M12.4 7h3.6M12.4 11h3.6M12.4 15h3.6M5.4 15.5h1.6" />
    </svg>
  );
}

export function Keys({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      className={className}
      aria-hidden="true"
      {...stroke}
    >
      <path d="M20.6 3.4l-8.2 8.2M17.9 6.1l2.1 2.1" />
      <circle cx="8.6" cy="15.4" r="4.6" />
    </svg>
  );
}

export function Facebook({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 9h3V5.5h-3c-2.2 0-4 1.8-4 4V12H8v3.5h2V22h3.5v-6.5H16L16.5 12H13.5V9.5c0-.3.2-.5.5-.5z" />
    </svg>
  );
}

export function Instagram({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}
