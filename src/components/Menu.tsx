import { useState, useCallback } from 'react';
import type { MenuItem, CartItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

// Static menu data
const MENU_ITEMS: MenuItem[] = [
    {
        id: '1',
        name: 'Signature Burger',
        description: 'Double smashed patty, secret sauce, aged cheddar, and house pickles on brioche.',
        price: 12.90,
        category: 'Main',
        image: '🍔',
    },
    {
        id: '2',
        name: 'Crispy Fries',
        description: 'Triple-cooked golden fries served with rosemary salt and aioli.',
        price: 4.50,
        category: 'Side',
        image: '🍟',
    },
    {
        id: '3',
        name: 'Coca-Cola Zero',
        description: 'Ice cold 0.5L refreshing zero sugar drink.',
        price: 2.90,
        category: 'Drink',
        image: '🥤',
    },
    {
        id: '4',
        name: 'Vegan Bowl',
        description: 'Quinoa base, avocado mash, roasted spicy chickpeas, and tahini drizzle.',
        price: 14.50,
        category: 'Main',
        image: '🥗',
    },
];

interface MenuProps {
    onAddItem: (item: MenuItem) => void;
    cartItems: CartItem[];
}

const MenuCard = ({ item, onAdd, quantity }: { item: MenuItem; onAdd: (item: MenuItem) => void; quantity: number }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleClick = useCallback(() => {
        onAdd(item);
        setIsAdded(true);
        // Show for 0.9s
        setTimeout(() => setIsAdded(false), 900);
    }, [item, onAdd]);

    return (
        <button
            onClick={handleClick}
            className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-[14px]"
            aria-label={`Add ${item.name} to cart for €${item.price.toFixed(2)}`}
        >
            <Card
                variant="elevated"
                className="h-full flex flex-col transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] group-active:scale-[0.98] relative overflow-hidden"
            >
                <div className="p-5 flex-1 flex gap-4 relative">
                    {/* Plus Icon - Always visible */}
                    <div className="absolute top-0 right-0 p-3 z-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white shadow-md">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </span>
                    </div>

                    <div className="flex-shrink-0 w-24 h-24 bg-neutral-50 rounded-2xl flex items-center justify-center text-5xl shadow-inner">
                        {item.image}
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                            <h3 className="font-bold text-neutral-900 group-hover:text-brand-primary transition-colors text-lg truncate">
                                {item.name}
                            </h3>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed mb-3">
                            {item.description}
                        </p>
                        <span className="inline-block font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md text-sm group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                            €{item.price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Bottom Bar Feedback */}
                <div className={cn(
                    "absolute bottom-0 left-0 w-full bg-emerald-500/80 backdrop-blur-md text-white font-medium text-sm py-2 flex items-center justify-center gap-1 shadow-lg transition-transform duration-300 ease-out transform",
                    isAdded ? "translate-y-0" : "translate-y-full"
                )}>
                    <span>Added +1</span>
                    {quantity > 0 && (
                        <span>(Total: {quantity})</span>
                    )}
                </div>
            </Card>
        </button>
    );
};

export const Menu = ({ onAddItem, cartItems = [] }: MenuProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENU_ITEMS.map((item) => {
                const quantity = cartItems.find(i => i.id === item.id)?.quantity || 0;
                return (
                    <MenuCard
                        key={item.id}
                        item={item}
                        onAdd={onAddItem}
                        quantity={quantity}
                    />
                );
            })}
        </div>
    );
};
