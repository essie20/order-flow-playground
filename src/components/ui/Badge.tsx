import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types';

interface BadgeProps {
    status: OrderStatus;
    className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
    CREATED: 'bg-gray-100 text-gray-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-gray-800 text-white',
};

export const Badge = ({ status, className }: BadgeProps) => {
    return (
        <span className={cn(
            'px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide',
            statusStyles[status],
            className
        )}>
            {status}
        </span>
    );
};
