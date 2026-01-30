import type { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LiveRegion, useAnnouncer } from '@/components/ui/LiveRegion';
import { useEffect, useRef } from 'react';

interface CartProps {
    items: CartItem[];
    total: number;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onClearCart: () => void;
    onCheckout: () => void;
    isSubmitting?: boolean;
}

export const Cart = ({
    items,
    total,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onCheckout,
    isSubmitting = false
}: CartProps) => {
    const { announcement, announce } = useAnnouncer();
    const previousTotalRef = useRef(total);

    // Announce cart changes
    useEffect(() => {
        if (previousTotalRef.current !== total) {
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
            announce(`Cart updated. ${itemCount} items, total €${total.toFixed(2)}`);
            previousTotalRef.current = total;
        }
    }, [total, items, announce]);

    if (items.length === 0) {
        return (
            <>
                <LiveRegion message={announcement} />
                <Card className="p-10 text-center border-dashed border-2 border-neutral-200 shadow-none bg-neutral-50/50">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl opacity-50">🛒</span>
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Your cart is empty</h3>
                    <p className="text-sm text-neutral-500">Go ahead, order something delicious!</p>
                </Card>
            </>
        );
    }

    return (
        <>
            <LiveRegion message={announcement} />
            <Card className="flex flex-col h-full sticky top-24 shadow-lg border-neutral-100 overflow-hidden">
                <div className="p-5 border-b border-neutral-100 bg-neutral-50/80 backdrop-blur-sm flex justify-between items-center">
                    <h2 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                        <span>Your Order</span>
                        <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">
                            {items.reduce((acc, i) => acc + i.quantity, 0)}
                        </span>
                    </h2>

                    <button
                        onClick={onClearCart}
                        className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-3 max-h-[calc(100vh-280px)] bg-white mobile-scroll">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/30 hover:bg-neutral-50 hover:border-neutral-200 transition-colors group animate-scale-in"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-neutral-900 text-base leading-tight mb-1">{item.name}</h4>
                                    <p className="text-xs text-neutral-500">€{item.price.toFixed(2)} each</p>
                                </div>
                                <span className="font-bold text-lg text-neutral-900">
                                    €{(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                {/* Trash / Delete - Left aligned for safety */}
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors -ml-2"
                                    aria-label={`Remove ${item.name} from cart`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>

                                {/* Quantity Controls - Right aligned, Big Targets */}
                                <div className="flex items-center gap-1 bg-white rounded-lg border border-neutral-200 p-1 shadow-sm">
                                    <button
                                        className="w-10 h-10 rounded-md flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100 transition-colors disabled:opacity-50"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        aria-label="Decrease quantity"
                                    >
                                        <span className="text-xl font-medium mb-0.5">−</span>
                                    </button>
                                    <span className="w-10 text-center text-lg font-bold text-neutral-900">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="w-10 h-10 rounded-md flex items-center justify-center text-brand-primary hover:bg-brand-primary/5 active:bg-brand-primary/10 transition-colors"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                    >
                                        <span className="text-xl font-medium mb-0.5">+</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 mt-auto space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                    <div className="space-y-2">
                        <div className="flex justify-between text-base text-neutral-500">
                            <span>Subtotal</span>
                            <span>€{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base text-neutral-500">
                            <span>Delivery</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                            <span className="font-bold text-lg text-neutral-900">Total</span>
                            <span className="font-bold text-2xl text-brand-primary">
                                €{total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full shadow-lg shadow-brand-primary/20 h-14 text-lg font-bold"
                        onClick={onCheckout}
                        disabled={items.length === 0}
                        isLoading={isSubmitting}
                    >
                        Place Order
                    </Button>
                </div>
            </Card>
        </>
    );
};
