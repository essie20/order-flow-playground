export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED';

export const orderTransitions: Record<OrderStatus, OrderStatus | null> = {
    CREATED: 'CONFIRMED',
    CONFIRMED: 'PREPARING',
    PREPARING: 'READY',
    READY: 'DELIVERED',
    DELIVERED: null,
};

export const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    return orderTransitions[current];
};

export const isFinalStatus = (status: OrderStatus): boolean => {
    return orderTransitions[status] === null;
};

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
}
