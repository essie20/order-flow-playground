import { cn } from '@/utils/cn';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden', className)}
            {...props}
        >
            {children}
        </div>
    );
};
