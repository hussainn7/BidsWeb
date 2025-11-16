import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams();

  const thumbnails = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: thumbnails + main image */}
          <div className="flex gap-6">
            <div className="flex flex-col gap-4 w-24">
              {thumbnails.map((thumb) => (
                <div
                  key={thumb}
                  className="aspect-square bg-gray-200 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                />
              ))}
            </div>

            <div className="flex-1">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="mt-6 h-px bg-border" />
            </div>
          </div>

          {/* Right: product info */}
          <div className="flex flex-col justify-start gap-6">
            <div>
              <h1 className="text-2xl font-medium mb-4">Название товара</h1>
              <div className="text-lg font-semibold mb-4">2000 ₽</div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat
                hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu
                facilisis consequat sed eu felis.
              </p>
            </div>

            <div className="flex gap-4 mt-6 mb-2">
              <Button variant="outline" className="w-40">
                Сделать ставку
              </Button>
              <Button className="w-48 bg-gray-400 text-white hover:bg-gray-400/90">
                Предложение
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div>Наибольшая ставка : Имя пользователя</div>
              <div className="font-semibold">Розничная цена: 2844 ₽</div>
            </div>

            <div className="text-xs text-muted-foreground pt-4">
              Товар будет отправлен на следующий рабочий день!
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
