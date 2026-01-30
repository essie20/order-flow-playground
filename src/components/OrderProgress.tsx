import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types';

interface OrderProgressProps {
    status: OrderStatus;
    className?: string;
}

const STEPS: { id: OrderStatus; label: string; icon: string }[] = [
    { id: 'CREATED', label: 'Received', icon: '📝' },
    { id: 'CONFIRMED', label: 'Confirmed', icon: '👨‍🍳' },
    { id: 'PREPARING', label: 'Preparing', icon: '🍳' },
    { id: 'READY', label: 'Ready', icon: '🥡' },
    { id: 'DELIVERED', label: 'Delivered', icon: '🚲' },
];

export const OrderProgress = ({ status, className }: OrderProgressProps) => {
    const currentStepIndex = STEPS.findIndex(step => step.id === status);

    // Calculate progress width
    const progressWidth = (currentStepIndex / (STEPS.length - 1)) * 100;

    return (
        <div className={cn("w-full py-6", className)}>
            <div className="relative flex justify-between items-center z-0 px-2">
                {/* Track Background */}
                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-neutral-100 -z-10 transform -translate-y-1/2 rounded-full" />

                {/* Active Progress Bar with Shimmer */}
                <div
                    className="absolute top-1/2 left-0 h-1.5 bg-brand-primary -z-10 transform -translate-y-1/2 rounded-full transition-all duration-700 ease-out overflow-hidden"
                    style={{ width: `${progressWidth}%` }}
                >
                    {/* Shimmer effect only when active order (not delivered) */}
                    {status !== 'DELIVERED' && (
                        <div className="absolute top-0 left-0 w-full h-full animate-shimmer opacity-30" />
                    )}
                </div>

                {STEPS.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center group relative">
                            {/* Step Circle */}
                            <div
                                className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10",
                                    isActive
                                        ? "bg-white border-brand-primary text-brand-primary shadow-[0_0_0_4px_rgba(8,145,178,0.1)] scale-100"
                                        : "bg-white border-neutral-200 text-neutral-300 scale-90",
                                    isCurrent && "scale-110 shadow-[0_4px_10px_rgba(8,145,178,0.3)] ring-2 ring-white ring-offset-2 ring-offset-brand-primary"
                                )}
                            >
                                <span className={cn(
                                    "text-base md:text-lg transition-transform duration-300",
                                    isCurrent ? "scale-110" : ""
                                )}>
                                    {step.icon}
                                </span>
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "absolute top-14 text-[10px] md:text-xs font-semibold transition-all duration-500 w-24 text-center",
                                    isActive ? "text-brand-primary translate-y-0 opacity-100" : "text-neutral-400 translate-y-1 opacity-80",
                                    isCurrent ? "font-bold text-brand-primary-dark scale-105" : ""
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for labels */}
            <div className="h-10" />
        </div>
    );
};
