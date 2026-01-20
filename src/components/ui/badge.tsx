import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Badge = ({ className, variant = 'secondary', ...props }: BadgeProps) => {
  const variants = {
    primary: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
    secondary: 'bg-background-elevated text-foreground-muted border-border',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
