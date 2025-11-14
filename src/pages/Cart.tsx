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
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">Корзина</h1>
        
        <div className="max-w-4xl">
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b">
                <div className="w-20 h-20 bg-muted flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    defaultValue="1" 
                    className="w-16 text-center"
                    min="1"
                  />
                  <div className="w-20 text-right">{item.price} ₽</div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Сумма заказа</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Итого:</span>
                <span>{total} ₽</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка:</span>
                <span>300 ₽</span>
              </div>
            </div>

            <Input placeholder="Код скидки" />

            <div className="flex justify-between text-lg font-medium pt-4 border-t">
              <span>Итого:</span>
              <span>{total + 300} ₽</span>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                Создать новый
              </Button>
              <Button className="flex-1">
                Заказать
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
