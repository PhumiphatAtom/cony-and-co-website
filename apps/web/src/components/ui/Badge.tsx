import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-badge px-3 py-0.5 font-heading text-xs font-semibold uppercase tracking-wider text-brand',
        className
      )}
    >
      {children}
    </span>
  );
}
