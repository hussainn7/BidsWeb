import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const mockCartItems = [
  { id: 1, title: "Сервиз 7шт", category: "Товар | Категория", price: 1500 },
  { id: 2, title: "Сервиз 20шт", category: "Товар | Категория", price: 2500 },
  { id: 3, title: "Заколка для жемчуга", category: "Товар | Категория", price: 800 },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">КОРЗИНА</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="rounded-lg border border-border/60 bg-white shadow-sm p-6 flex items-center gap-4"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.category}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number" 
                      defaultValue="1" 
                      className="w-16 text-center border-border/60"
                      min="1"
                    />
                    <div className="w-20 text-right font-semibold">{item.price} ₽</div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-border/60 bg-white shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">СУММА ЗАКАЗА</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Итого:</span>
                    <span className="font-semibold">{total} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка:</span>
                    <span className="font-semibold">300 ₽</span>
                  </div>
                </div>

                <div className="mb-6">
                  <Input 
                    placeholder="Код скидки" 
                    className="border-border/60 mb-4"
                  />
                </div>

                <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/60 mb-6">
                  <span>Итого:</span>
                  <span>{total + 300} ₽</span>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-border/60 hover:bg-slate-50"
                  >
                    Создать новый
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold">
                    Заказать
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
