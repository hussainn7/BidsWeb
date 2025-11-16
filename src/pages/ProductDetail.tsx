import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams();

  const thumbnails = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT SIDE – IMAGE GALLERY */}
          <div className="flex gap-6">
            {/* Thumbnails */}
            <div className="flex flex-col gap-4 w-24">
              {thumbnails.map((thumb) => (
                <div
                  key={thumb}
                  className="
                    aspect-square rounded-lg overflow-hidden bg-muted
                    shadow-sm border border-border cursor-pointer
                    transition-all duration-300 hover:shadow-md hover:scale-[1.03]
                  "
                >
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div
                className="
                  aspect-square rounded-xl overflow-hidden bg-muted
                  shadow-[0_8px_24px_rgba(0,0,0,0.07)]
                "
              >
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
              </div>

              <div className="mt-8 h-px w-full bg-border" />
            </div>
          </div>

          {/* RIGHT SIDE – PRODUCT INFORMATION */}
          <div className="flex flex-col gap-8">
            
            {/* Title, Price */}
            <section>
              <h1 className="text-3xl font-semibold tracking-tight mb-4">
                Название товара
              </h1>

              {/* Price row – styled bold */}
              <div className="text-2xl font-bold text-primary mb-4">
                2000 ₽
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aliquam placerat, augue a volutpat hendrerit, sapien tortor
                faucibus augue, a maximus elit ex vitae libero. Sed quis mauris
                eget arcu facilisis consequat sed eu felis.
              </p>
            </section>

            {/* AUCTION BOX */}
            <section
              className="
                rounded-xl border border-border bg-muted/40
                px-6 py-4 space-y-3 shadow-sm
              "
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Наибольшая ставка:</span>
                <span className="font-medium text-foreground">Имя пользователя</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Розничная цена:</span>
                <span className="font-semibold text-foreground">2844 ₽</span>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                Обновление ставок происходит в реальном времени.
              </div>
            </section>

            {/* ACTION BUTTONS */}
            <section className="flex gap-4">
              <Button
                variant="default"
                className="
                  w-44 rounded-full text-sm uppercase tracking-wide
                  bg-primary text-white hover:bg-primary/90
                "
              >
                Сделать ставку
              </Button>

              <Button
                variant="outline"
                className="w-44 rounded-full text-sm uppercase tracking-wide"
              >
                Предложение
              </Button>
            </section>

            {/* SHIPPING / EXTRA INFO */}
            <section className="text-xs text-muted-foreground">
              Товар будет отправлен на следующий рабочий день!
            </section>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 mb-10 h-px w-full bg-border" />

        {/* Additional info block (optional) */}
        <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Все товары проверяются перед отправкой. В случае обнаружения дефектов,
            вы можете связаться с нашей службой поддержки.
          </p>

          <p>
            Условия доставки и возврата зависят от конкретного продавца и региона.
            Пожалуйста, ознакомьтесь с правилами до совершения покупки.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
