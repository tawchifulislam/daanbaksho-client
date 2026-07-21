import Link from 'next/link';

export default function Logo({ size = 'default', withLink = true }) {
  const sizes = {
    sm: { badge: 30, text: 'text-base' },
    default: { badge: 38, text: 'text-xl' },
    lg: { badge: 46, text: 'text-2xl' },
  };
  const s = sizes[size];

  const content = (
    <span className="inline-flex items-center gap-2.5">
      <svg
        width={s.badge}
        height={s.badge}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient
            id="daanbaksho-logo-grad"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0f766e" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="url(#daanbaksho-logo-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="88 25"
          transform="rotate(-90 20 20)"
        />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontSize="17"
          fontWeight="800"
          fill="currentColor"
          fontFamily="var(--font-jakarta), sans-serif"
        >
          D
        </text>
      </svg>
      <span className={`font-extrabold ${s.text} tracking-tight`}>
        Daan<span className="text-primary">Baksho</span>
      </span>
    </span>
  );

  if (!withLink) return content;

  return <Link href="/">{content}</Link>;
}
