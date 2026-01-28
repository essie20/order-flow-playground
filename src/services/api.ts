import type { Order, CartItem } from '@/types';
import { generateIdempotencyKey } from '@/utils/idempotency';

const BASE_URL = '/api';

export class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const api = {
    async createOrder(items: CartItem[], total: number): Promise<Order> {
        const idempotencyKey = generateIdempotencyKey();

        const response = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-idempotency-key': idempotencyKey,
            },
            body: JSON.stringify({ items, total }),
        });

        if (!response.ok) {
            throw new ApiError(response.status, 'Failed to create order');
        }

        return response.json();
    },

    async getOrder(id: string): Promise<Order> {
        const response = await fetch(`${BASE_URL}/orders/${id}`);

        if (!response.ok) {
            throw new ApiError(response.status, 'Failed to fetch order');
        }

        return response.json();
    }
};
