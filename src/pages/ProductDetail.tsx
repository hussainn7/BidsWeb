import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  const thumbnails = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {thumbnails.map((thumb) => (
                <div key={thumb} className="aspect-square bg-muted cursor-pointer hover:opacity-70 transition-opacity">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-medium mb-2">Название товара</h1>
              <div className="text-sm text-muted-foreground">2020 Г</div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed">
                Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. 
                Большого заманивший, назад великий выйти безорфографичный свою составитель, 
                родного снова переулка, города она дороге подзаголовок коварных повстречался большой вопрос.
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              Минимальная ставка: Цена последней ставки
              <br />
              Розничная цена: 2844 ₽
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                Предложение
              </Button>
              <Button className="flex-1">
                Приобрести
              </Button>
            </div>

            <div className="text-xs text-muted-foreground pt-4 border-t">
              Товар будет доставлен по стоимости в любом регионе
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
