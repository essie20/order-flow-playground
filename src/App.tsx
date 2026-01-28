import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import { Menu } from '@/components/Menu';
import { Cart } from '@/components/Cart';
import { OrderStatusView } from '@/components/OrderStatus';
import { Button } from '@/components/ui/Button';

function App() {
  const { items, addItem, updateQuantity, removeItem, clearCart, total } = useCart();
  const { createOrder, isCreating, createError, order, resetOrder } = useOrder();

  const handleCheckout = () => {
    createOrder({ items, total }, {
      onSuccess: () => {
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  const handleReset = () => {
    resetOrder();
  };

  if (order) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="font-bold text-xl text-brand-primary tracking-tight">Wolt Playground</h1>
            <div className="font-medium text-sm">
              Tracking Order
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <OrderStatusView order={order} onReset={handleReset} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-xl text-brand-primary tracking-tight">Wolt Playground</h1>
          <div className="font-medium text-sm">
            Example
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <Menu onAddItem={addItem} />
            </section>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-24">
              <Cart
                items={items}
                total={total}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
              />

              {isCreating && (
                <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm text-center animate-pulse">
                  Creating your order...
                </div>
              )}

              {createError && (
                <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg text-sm">
                  <p className="font-bold mb-1">Failed to create order</p>
                  <p className="mb-2">{createError.message}</p>
                  <Button
                    variant="danger"
                    className="w-full text-xs h-8"
                    onClick={handleCheckout}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
