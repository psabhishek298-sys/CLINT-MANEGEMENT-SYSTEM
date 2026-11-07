import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorScheme: 'blue' | 'sky' | 'emerald' | 'amber' | 'violet' | 'indigo' | 'rose' | 'gray';
  subtext?: string;
  onClick?: () => void;
}

const accents: Record<StatCardProps['colorScheme'], string> = {
  blue: 'emerald', sky: 'emerald', emerald: 'emerald', amber: 'amber',
  violet: 'emerald', indigo: 'emerald', rose: 'rose', gray: 'slate',
};

export default function StatCard({ title, value, icon: Icon, colorScheme, subtext, onClick }: StatCardProps) {
  const accent = accents[colorScheme];
  const className = `stat-card stat-card-${accent} ${onClick ? 'cursor-pointer' : ''}`;

  return (
    <article onClick={onClick} onKeyDown={event => { if (onClick && (event.key === 'Enter' || event.key === ' ')) onClick(); }}
      role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} className={className}>
      <div className="stat-card-icon"><Icon size={23} strokeWidth={2.2} /></div>
      <div className="stat-card-copy">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
        {subtext && <p className="stat-card-subtext">{subtext}</p>}
      </div>
      <svg className="stat-card-wave" viewBox="0 0 240 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 54 C55 40 84 63 130 48 S194 12 240 25 V70 H0Z" />
      </svg>
    </article>
  );
}
