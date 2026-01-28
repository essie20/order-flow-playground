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
    // Accessibility: Focus handling could go here
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        // Focus the heading when the component mounts to alert screen reader users
        // to the context change.
        headingRef.current?.focus();
    }, []);

    // Accessibility: Dynamic announcement region
    // In a real app, we might use a visually hidden live region that updates with text.
    // For now, the visual status change is the primary indicator.

    return (
        <Card className="p-6 max-w-xl mx-auto mt-8 text-center animate-fade-in shadow-lg border-brand-primary/10">
            <h2
                ref={headingRef}
                tabIndex={-1}
                className="text-2xl font-bold mb-6 focus:outline-none"
            >
                Order #{order.id.slice(0, 8)}...
            </h2>

            <div className="mb-8">
                <OrderProgress status={order.status} />
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left border border-gray-100">
                <h3 className="font-medium mb-4 text-sm text-gray-500 uppercase flex justify-between items-center">
                    <span>Items</span>
                    <Badge status={order.status} className="ml-2" />
                </h3>
                <ul className="space-y-3 mb-4">
                    {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-900"><span className="font-bold text-gray-500 mr-2">{item.quantity}x</span> {item.name}</span>
                            <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-200 mt-2 pt-4 flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-brand-primary">€{order.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-2">
                {order.status === 'DELIVERED' && (
                    <Button onClick={onReset} className="w-full">
                        Start New Order
                    </Button>
                )}
                <p className="text-xs text-gray-500">
                    {order.status !== 'DELIVERED'
                        ? 'Updates automatically...'
                        : 'Order complete!'}
                </p>
            </div>

            {/* Accessibility Live Region */}
            <div className="sr-only" aria-live="polite">
                Order status is now {order.status}
            </div>
        </Card>
    );
};
