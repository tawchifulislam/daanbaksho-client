import Link from 'next/link';
import { HandHeart } from 'lucide-react';

export default function Logo({ size = 'default', withLink = true }) {
  const sizes = {
    sm: { icon: 'w-5 h-5', text: 'text-base' },
    default: { icon: 'w-6 h-6', text: 'text-xl' },
    lg: { icon: 'w-8 h-8', text: 'text-2xl' },
  };

  const content = (
    <span
      className={`inline-flex items-center gap-2 font-bold ${sizes[size].text}`}
    >
      <HandHeart className={`${sizes[size].icon} text-primary`} />
      DaanBaksho
    </span>
  );

  if (!withLink) return content;

  return <Link href="/">{content}</Link>;
}
