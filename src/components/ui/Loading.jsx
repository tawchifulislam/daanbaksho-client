import { Loader2 } from 'lucide-react';

export default function Loading({
  size = 'default',
  label,
  fullHeight = false,
}) {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-muted-foreground ${
        fullHeight ? 'min-h-[40vh]' : 'py-10'
      }`}
    >
      <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
