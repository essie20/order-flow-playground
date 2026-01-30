import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types';

interface BadgeProps {
    status: OrderStatus;
    className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
    CREATED: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-100',
    PREPARING: 'bg-orange-50 text-orange-700 border-orange-100',
    READY: 'bg-green-50 text-green-700 border-green-100',
    DELIVERED: 'bg-neutral-900 text-white border-neutral-900',
};

const statusIcons: Record<OrderStatus, string> = {
    CREATED: '📝',
    CONFIRMED: '👨‍🍳',
    PREPARING: '🍳',
    READY: '🥡',
    DELIVERED: '🏠',
};

export const Badge = ({ status, className }: BadgeProps) => {
    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm',
            statusStyles[status],
            className
        )}>
            <span className="text-[10px]">{statusIcons[status]}</span>
            {status}
        </span>
    );
};
