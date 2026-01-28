import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { CartItem } from '@/types';

export const useOrder = () => {
    // Sync state with URL query param
    const getOrderIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('orderId');
    };

    const [activeOrderId, setActiveOrderId] = useState<string | null>(getOrderIdFromUrl);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (activeOrderId) {
            params.set('orderId', activeOrderId);
        } else {
            params.delete('orderId');
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }, [activeOrderId]);

    // Mutation to create an order
    const createOrderMutation = useMutation({
        mutationFn: (data: { items: CartItem[]; total: number }) =>
            api.createOrder(data.items, data.total),
        onSuccess: (order) => {
            setActiveOrderId(order.id);
        },
    });

    // Query to poll for order status (only if we have an active order)
    const orderQuery = useQuery({
        queryKey: ['order', activeOrderId],
        queryFn: () => api.getOrder(activeOrderId!),
        enabled: !!activeOrderId,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            // Stop polling if delivered or no status
            if (status === 'DELIVERED') return false;
            return 3000; // Poll every 3 seconds
        },
    });

    return {
        createOrder: createOrderMutation.mutate,
        isCreating: createOrderMutation.isPending,
        createError: createOrderMutation.error,
        order: orderQuery.data,
        orderError: orderQuery.error,
        isLoadingOrder: orderQuery.isLoading,
        resetOrder: () => setActiveOrderId(null)
    };
};
