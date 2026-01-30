import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import { Menu } from '@/components/Menu';
import { Cart } from '@/components/Cart';
import { OrderStatusView } from '@/components/OrderStatus';
import { Button } from '@/components/ui/Button';
import { DebugPanel } from '@/components/DebugPanel';
import { SimulationProvider } from '@/context/SimulationContext';

function AppContent() {
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

  // Header component for consistency
  const Header = ({ subtitle }: { subtitle: string }) => (
    <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">🚲</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-neutral-900 leading-tight">Order Playground</h1>
            <p className="text-xs text-neutral-500 -mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400">
          <span>Press</span>
          <kbd className="kbd">D</kbd>
          <span>for debug</span>
        </div>
      </div>
    </header>
  );

  if (order) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
        <Header subtitle="Tracking Order" />

        <main className="max-w-7xl mx-auto px-4 py-8">
          <OrderStatusView order={order} onReset={handleReset} />
        </main>

        <DebugPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 md:pb-0">
      <Header subtitle="Browse & Order" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-neutral-900">Menu</h2>
                <span className="text-sm text-neutral-400">4 items</span>
              </div>
              <Menu onAddItem={addItem} cartItems={items} />
            </section>
          </div>

          {/* Cart Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart
                items={items}
                total={total}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
                isSubmitting={isCreating}
              />

              {createError && (
                <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-xl text-sm border border-red-100 animate-slide-up">
                  <p className="font-semibold mb-1">Failed to create order</p>
                  <p className="text-red-600 mb-3 text-xs">{createError.message}</p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full"
                    onClick={handleCheckout}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <DebugPanel />
    </div>
  );
}

function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}

export default App;
