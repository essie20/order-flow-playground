import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden', className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
