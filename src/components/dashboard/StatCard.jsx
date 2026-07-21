import { Card, CardContent } from '@/components/ui/card';

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'primary',
}) {
  const accentClasses = {
    primary: 'bg-primary/10 text-primary',
    brand: 'bg-accent-brand/10 text-accent-brand',
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentClasses[accent]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
