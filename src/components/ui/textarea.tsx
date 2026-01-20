import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, helperText, id, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-foreground-muted mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            `w-full rounded-lg bg-background-elevated border px-4 py-2.5
            text-foreground placeholder:text-foreground-subtle resize-y min-h-[100px]
            focus:outline-none focus:ring-2 transition-all duration-200`,
            error
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500'
              : 'border-border focus:ring-primary-500/50 focus:border-primary-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1.5 text-sm', error ? 'text-red-400' : 'text-foreground-subtle')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
