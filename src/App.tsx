import { useCart } from '@/hooks/useCart';
import { Menu } from '@/components/Menu';
import { Cart } from '@/components/Cart';

function App() {
  const { items, addItem, updateQuantity, removeItem, total } = useCart();

  const handleCheckout = () => {
    alert('Checkout not implemented yet (Day 3)');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-xl text-brand-primary tracking-tight">Wolt Playground</h1>
          <div className="font-medium text-sm">
            Draft Order
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
            <Cart
              items={items}
              total={total}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
