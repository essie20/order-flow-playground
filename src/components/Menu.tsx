import type { MenuItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Static menu data for now
const MENU_ITEMS: MenuItem[] = [
    {
        id: '1',
        name: 'Signature Burger',
        description: 'Our signature burger with secret sauce, cheddar, and pickles.',
        price: 12.90,
        category: 'Main',
        image: '🍔',
    },
    {
        id: '2',
        name: 'Crispy Fries',
        description: 'Golden crunchy fries with rosemary salt.',
        price: 4.50,
        category: 'Side',
        image: '🍟',
    },
    {
        id: '3',
        name: 'Coca-Cola Zero',
        description: '0.5L refreshing zero sugar drink.',
        price: 2.90,
        category: 'Drink',
        image: '🥤',
    },
    {
        id: '4',
        name: 'Vegan Bowl',
        description: 'Quinoa, avocado, roasted chickpeas, and tahini dressing.',
        price: 14.50,
        category: 'Main',
        image: '🥗',
    },
];

interface MenuProps {
    onAddItem: (item: MenuItem) => void;
}

export const Menu = ({ onAddItem }: MenuProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENU_ITEMS.map((item) => (
                <Card key={item.id} className="flex flex-col">
                    <div className="p-4 flex-1">
                        <div className="text-4xl mb-4">{item.image}</div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <span className="font-medium bg-gray-100 px-2 py-1 rounded text-sm">
                                €{item.price.toFixed(2)}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    </div>
                    <div className="p-4 pt-0 mt-auto">
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => onAddItem(item)}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};
