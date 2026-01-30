import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-[14px] overflow-hidden transition-shadow duration-200',

                    variant === 'default' && [
                        'bg-white',
                        'border border-neutral-100',
                        'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]',
                    ],
                    variant === 'elevated' && [
                        'bg-white',
                        'shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]',
                        'hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.06),0_4px_6px_-2px_rgba(0,0,0,0.03)]',
                    ],
                    variant === 'outlined' && [
                        'bg-transparent',
                        'border-2 border-neutral-200',
                    ],

                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
