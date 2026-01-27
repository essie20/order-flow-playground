import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
}

export const Button = ({
    variant = 'primary',
    isLoading,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={cn(
                'min-h-[44px] px-4 py-2 rounded-lg font-medium transition flex items-center justify-center',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                'active:scale-95',
                variant === 'primary' && 'bg-brand-primary text-white hover:opacity-90',
                variant === 'secondary' && 'bg-brand-accent text-white hover:opacity-90',
                variant === 'outline' && 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10',
                variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
                (disabled || isLoading) && 'opacity-50 cursor-not-allowed active:scale-100',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
};
