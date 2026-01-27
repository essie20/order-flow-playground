import { useReducer, useEffect } from 'react';
import type { CartItem, MenuItem } from '@/types';

type CartAction =
    | { type: 'ADD_ITEM'; payload: MenuItem }
    | { type: 'REMOVE_ITEM'; payload: { id: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' };

const CART_STORAGE_KEY = 'order-flow-cart';

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.find(item => item.id === action.payload.id);
            if (existing) {
                return state.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        }
        case 'REMOVE_ITEM':
            return state.filter(item => item.id !== action.payload.id);
        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return state.filter(item => item.id !== action.payload.id);
            }
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
        }
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};

export const useCart = () => {
    const [items, dispatch] = useReducer(cartReducer, [], () => {
        // Initializer
        if (typeof window === 'undefined') return [];
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse cart from local storage', e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (item: MenuItem) => dispatch({ type: 'ADD_ITEM', payload: item });
    const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    const updateQuantity = (id: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total
    };
};
