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

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative flex justify-between items-center z-0">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full" />

                {/* Active Progress Bar */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-brand-primary -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center group">
                            <div
                                className={cn(
                                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                                    isActive
                                        ? "bg-brand-primary border-brand-primary text-white scale-110 shadow-md"
                                        : "bg-white border-gray-300 text-gray-400"
                                )}
                            >
                                <span className="text-xs md:text-sm">{step.icon}</span>
                            </div>
                            <span
                                className={cn(
                                    "absolute top-12 text-[10px] md:text-xs font-medium transition-colors duration-300 w-20 text-center",
                                    isActive ? "text-brand-primary" : "text-gray-400",
                                    isCurrent ? "font-bold scale-110" : ""
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for labels */}
            <div className="h-8" />
        </div>
    );
};
