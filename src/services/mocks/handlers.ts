import { http, HttpResponse, delay } from 'msw';
import type { Order, OrderStatus } from '../../types';
import { db } from './db';

const DEFAULT_DELAY_MS = 800;
const FAILURE_RATE = 0;

// Deterministic status based on time
const STATUS_FLOW: OrderStatus[] = ['CREATED', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];
const MS_PER_STAGE = 6000; // 6 seconds per stage

function calculateStatus(createdAtIso: string): OrderStatus {
    const createdAt = new Date(createdAtIso).getTime();
    const elapsed = Date.now() - createdAt;
    const stageIndex = Math.floor(elapsed / MS_PER_STAGE);
    return STATUS_FLOW[Math.min(stageIndex, STATUS_FLOW.length - 1)];
}

export const handlers = [
    // create order
    http.post('/api/orders', async ({ request }) => {
        await delay(DEFAULT_DELAY_MS);

        if (Math.random() < FAILURE_RATE) {
            return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        }

        const idempotencyKey = request.headers.get('x-idempotency-key');
        if (!idempotencyKey) {
            return new HttpResponse(null, { status: 400, statusText: 'Missing Idempotency Key' });
        }

        // Check for existing order (Idempotency) using IDB
        const existingOrder = await db.getOrder(idempotencyKey);
        if (existingOrder) {
            // Update status before returning
            existingOrder.status = calculateStatus(existingOrder.createdAt);
            return HttpResponse.json(existingOrder, { status: 200 });
        }

        // Parse body
        const body = await request.json() as { items: any[], total: number };
        const now = new Date().toISOString();

        const newOrder: Order = {
            id: idempotencyKey,
            items: body.items,
            total: body.total,
            status: 'CREATED',
            createdAt: now,
        };

        await db.saveOrder(newOrder);

        return HttpResponse.json(newOrder, { status: 201 });
    }),

    // get order status
    http.get('/api/orders/:id', async ({ params }) => {
        const { id } = params;

        const order = await db.getOrder(id as string);
        if (!order) {
            return new HttpResponse(null, { status: 404, statusText: 'Order not found' });
        }

        // Calculate current status based on time
        const currentStatus = calculateStatus(order.createdAt);

        // Optional: could persist the updated status back to DB, but calculation is cheap enough
        const updatedOrder = { ...order, status: currentStatus };

        return HttpResponse.json(updatedOrder);
    }),
];
