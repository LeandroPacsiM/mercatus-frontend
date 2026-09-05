import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatsCard({ icon, value, label, trend = 'neutral' }: StatsCardProps) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-4 rounded-md border border-border bg-card p-5 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--bg-alt)] text-[var(--text)]"><Icon className="h-5 w-5" aria-hidden="true" /></div>
      <div className="flex flex-1 flex-col">
        <span className="text-2xl font-bold leading-tight text-primary">{value}</span>
        <span className="mt-0.5 text-[13px] text-[var(--text-light)]">{label}</span>
      </div>
      {trend !== 'neutral' && (
        <span className={`text-lg font-semibold ${trend === 'up' ? 'text-[var(--success-text)]' : 'text-[var(--danger-text)]'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </div>
  );
}
