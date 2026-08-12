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
