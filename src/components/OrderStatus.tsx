import { useRef, useEffect } from 'react';
import type { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderProgress } from '@/components/OrderProgress';

interface OrderStatusProps {
    order: Order;
    onReset: () => void;
}

export const OrderStatusView = ({ order, onReset }: OrderStatusProps) => {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <div className="max-w-2xl mx-auto mt-8 animate-slide-up">
            <Card variant="elevated" className="overflow-visible border-0 bg-white/80 backdrop-blur-xl ring-1 ring-black/5">
                {/* Header Section */}
                <div className="p-6 md:p-8 text-center border-b border-neutral-100 bg-gradient-to-b from-white to-neutral-50/50 rounded-t-[14px]">
                    <Badge status={order.status} className="mb-4 shadow-sm" />
                    <h2
                        ref={headingRef}
                        tabIndex={-1}
                        className="text-3xl font-bold mb-2 text-neutral-900 tracking-tight focus:outline-none"
                    >
                        {order.status === 'DELIVERED' ? 'Order Delivered!' : 'Order in Progress'}
                    </h2>
                    <p className="text-neutral-500 font-mono text-xs uppercase tracking-wider">
                        ID: {order.id.slice(0, 8)}
                    </p>
                </div>

                {/* Progress Tracker based on status */}
                <div className="px-6 py-8 md:px-10 bg-white">
                    <OrderProgress status={order.status} />
                </div>

                {/* Receipt/Details Section */}
                <div className="bg-neutral-50/50 p-6 md:p-8 border-t border-dashed border-neutral-200">
                    <h3 className="font-semibold text-sm text-neutral-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                        Order Summary
                    </h3>

                    <div className="bg-white rounded-xl border border-neutral-200 p-1 shadow-sm mb-6">
                        <ul className="divide-y divide-neutral-100">
                            {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between items-center p-3 hover:bg-neutral-50 transition-colors rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 text-xs font-bold text-neutral-700">
                                            {item.quantity}
                                        </span>
                                        <span className="text-neutral-700 font-medium text-sm">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-neutral-900 text-sm">€{(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <span className="text-neutral-500 font-medium">Total Paid</span>
                        <span className="text-2xl font-bold text-neutral-900 tracking-tight">€{order.total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 md:p-8 bg-white rounded-b-[14px]">
                    {order.status === 'DELIVERED' ? (
                        <Button
                            onClick={onReset}
                            size="lg"
                            className="w-full shadow-lg shadow-brand-primary/20 animate-scale-in"
                        >
                            Start New Order
                        </Button>
                    ) : (
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/5 text-brand-primary rounded-full text-sm font-medium animate-pulse">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-primary"></span>
                                </span>
                                Live updates active
                            </div>
                            <p className="text-xs text-neutral-400">
                                Bookmark this page to track your order status.
                            </p>
                        </div>
                    )}
                </div>

                {/* Accessibility Live Region */}
                <div className="sr-only" aria-live="polite">
                    Order status is now {order.status}
                </div>
            </Card>
        </div>
    );
};
