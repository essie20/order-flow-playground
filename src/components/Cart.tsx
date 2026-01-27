import type { CartItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CartProps {
    items: CartItem[];
    total: number;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => void;
}

export const Cart = ({
    items,
    total,
    onUpdateQuantity,
    onCheckout
}: CartProps) => {
    if (items.length === 0) {
        return (
            <Card className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">🛒</p>
                <p>Your cart is empty</p>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-full sticky top-4">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="font-bold text-lg">Your Order</h2>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4 max-h-[calc(100vh-250px)]">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between mb-1">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 block">€{item.price.toFixed(2)} x {item.quantity}</span>
                                    <span className="text-sm font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                                <button
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 mt-auto">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">€{total.toFixed(2)}</span>
                </div>
                <Button
                    className="w-full"
                    onClick={onCheckout}
                    disabled={items.length === 0}
                >
                    Place Order
                </Button>
            </div>
        </Card>
    );
};
