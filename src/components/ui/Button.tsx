import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={cn(
                // Base styles
                'inline-flex items-center justify-center font-semibold transition-all duration-200',
                'rounded-[10px] select-none',
                // Focus state
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                // Active state
                'active:scale-[0.98]',

                // Size variants
                size === 'sm' && 'h-9 px-3 text-sm gap-1.5',
                size === 'md' && 'h-11 px-5 text-sm gap-2',
                size === 'lg' && 'h-13 px-6 text-base gap-2.5',

                // Color variants with gradients
                variant === 'primary' && [
                    'bg-gradient-to-b from-brand-primary to-brand-primary-dark text-white',
                    'shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]',
                    'hover:shadow-[0_4px_12px_rgba(8,145,178,0.35)]',
                    'hover:from-[#0ea5c4] hover:to-brand-primary',
                ],
                variant === 'secondary' && [
                    'bg-gradient-to-b from-brand-accent to-brand-accent-dark text-white',
                    'shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]',
                    'hover:shadow-[0_4px_12px_rgba(249,115,22,0.35)]',
                    'hover:from-[#fb923c] hover:to-brand-accent',
                ],
                variant === 'ghost' && [
                    'bg-neutral-100 text-neutral-700',
                    'hover:bg-neutral-200',
                    'border border-neutral-200',
                ],
                variant === 'danger' && [
                    'bg-gradient-to-b from-red-500 to-red-600 text-white',
                    'shadow-[0_1px_2px_rgba(0,0,0,0.1)]',
                    'hover:shadow-[0_4px_12px_rgba(239,68,68,0.35)]',
                ],

                // Disabled state
                (disabled || isLoading) && [
                    'opacity-50 cursor-not-allowed',
                    'active:scale-100',
                    'hover:shadow-none',
                ],

                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {children}
        </button>
    );
};
