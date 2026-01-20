import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 rounded-lg font-medium
      transition-all duration-200 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-primary-500 focus-visible:ring-offset-2
      focus-visible:ring-offset-background disabled:pointer-events-none
      disabled:opacity-50 active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-primary-500 text-white hover:bg-primary-600
        shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40
      `,
      secondary: `
        bg-background-elevated border border-border text-foreground
        hover:bg-background-card hover:border-border-accent
      `,
      ghost: `
        bg-transparent text-foreground-muted hover:bg-background-elevated
        hover:text-foreground
      `,
      danger: `
        bg-red-600 text-white hover:bg-red-700
        shadow-lg shadow-red-600/25 hover:shadow-red-600/40
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
