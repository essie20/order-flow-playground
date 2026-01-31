import { useState, useCallback } from 'react';
import type { MenuItem, CartItem } from '@/types';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

// Extend MenuItem for this component locally or assumption
// In a real app we'd update the type definition
interface ExtendedMenuItem extends MenuItem {
    imageUrl?: string;
}

const MENU_ITEMS: ExtendedMenuItem[] = [
    {
        id: '1',
        name: 'Signature Burger',
        description: 'Double smashed patty, secret sauce, aged cheddar, and house pickles on brioche.',
        price: 12.90,
        category: 'Main',
        image: '🍔',
        imageUrl: 'https://foodish-api.com/images/burger/burger12.jpg'
    },
    {
        id: '4',
        name: 'Vegan Bowl',
        description: 'Quinoa base, avocado mash, roasted spicy chickpeas, and tahini drizzle.',
        price: 14.50,
        category: 'Main',
        image: '🥗',
        imageUrl: 'https://foodish-api.com/images/rice/rice22.jpg'
    },
    {
        id: '2',
        name: 'Margherita Pizza',
        description: 'Classic stone-baked pizza with San Marzano tomato sauce, fresh mozzarella, and basil.',
        price: 13.50,
        category: 'Main',
        image: '🍕',
        imageUrl: 'https://foodish-api.com/images/pizza/pizza1.jpg'
    },
    {
        id: '3',
        name: 'Creamy Pasta',
        description: 'Fresh tagliatelle in a rich parmesan and truffle cream sauce.',
        price: 15.90,
        category: 'Main',
        image: '🍝',
        imageUrl: 'https://foodish-api.com/images/pasta/pasta1.jpg'
    },
];

interface MenuProps {
    onAddItem: (item: MenuItem) => void;
    cartItems: CartItem[];
}

const MenuImage = ({ item }: { item: ExtendedMenuItem }) => {
    const [hasError, setHasError] = useState(false);

    if (!item.imageUrl || hasError) {
        return (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-5xl shadow-inner">
                {item.image}
            </div>
        );
    }

    return (
        <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
};

const MenuCard = ({ item, onAdd, quantity }: { item: ExtendedMenuItem; onAdd: (item: MenuItem) => void; quantity: number }) => {
    const [isAdded, setIsAdded] = useState(false);

    const handleClick = useCallback(() => {
        onAdd(item);
        setIsAdded(true);
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
                className="h-full flex flex-row transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.1)] group-active:scale-[0.98] relative overflow-hidden"
            >
                {/* Left Side: Image (Full Bleed) */}
                <div className="w-32 sm:w-40 h-auto relative bg-neutral-200">
                    <MenuImage item={item} />
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-4 flex flex-col justify-between min-h-[140px]">
                    {/* Plus Icon - Absolute in top right of the whole card, but inside content area or over image? 
                         User said "product pictures on the cards left side".
                         Let's keep the plus icon in the top right of the content area.
                      */}
                    <div className="absolute top-0 right-0 p-3 z-10">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white shadow-md hover:bg-brand-primary-dark transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </span>
                    </div>

                    <div className="pr-10">
                        <h3 className="font-bold text-neutral-900 group-hover:text-brand-primary transition-colors text-lg leading-tight mb-2">
                            {item.name}
                        </h3>
                        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                            {item.description}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <span className="inline-block font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md text-sm group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                            €{item.price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Feedback Overlay */}
                <div className={cn(
                    "absolute bottom-0 left-0 w-full bg-emerald-500/90 backdrop-blur-md text-white font-medium text-sm py-2 flex items-center justify-center gap-1 shadow-lg pointer-events-none transition-transform duration-300 ease-out transform",
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
        <div className="grid grid-cols-1 gap-4">
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
