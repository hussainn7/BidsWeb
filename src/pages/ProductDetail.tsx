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

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE – IMAGE GALLERY */}
          <div className="flex gap-5">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-24">
              {thumbnails.map((thumb) => (
                <div
                  key={thumb}
                  className="
                    aspect-square rounded-md overflow-hidden
                    bg-white border border-border/60 shadow-sm
                    cursor-pointer
                    transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]
                  "
                >
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100" />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1">
              <div
                className="
                  relative aspect-square rounded-lg overflow-hidden
                  bg-white border border-border/60
                  shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                "
              >
                <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100" />

                {/* Same badge as ProductCard */}
                <div className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-sm border border-border/50">
                  <span className="h-3 w-4 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
                  <span className="text-[10px] font-bold uppercase tracking-wide text-foreground">
                    ДОСТАВКА ИЗ США
                  </span>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-border/70" />
            </div>
          </div>

          {/* RIGHT SIDE – PRODUCT INFORMATION */}
          <div className="flex flex-col gap-8">
            {/* Title, Price, Description */}
            <section>
              <h1 className="text-2xl font-semibold tracking-tight mb-3">
                Название товара
              </h1>

              <div className="text-xl font-bold text-foreground mb-4">
                2000 ₽
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aliquam placerat, augue a volutpat hendrerit, sapien tortor
                faucibus augue, a maximus elit ex vitae libero. Sed quis mauris
                eget arcu facilisis consequat sed eu felis.
              </p>
            </section>

            {/* AUCTION BOX – styled like ProductCard footer */}
            <section
              className="
                rounded-lg border border-border/70 bg-slate-50/70
                px-5 py-4 space-y-3 shadow-sm
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  ЛИДЕР
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-5 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
                  <span className="text-xs font-semibold text-foreground">
                    @ Имя пользователя
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Розничная цена
                </span>
                <span className="font-semibold text-foreground">
                  2 844 ₽
                </span>
              </div>

              <div className="pt-1 text-xs text-muted-foreground">
                Обновление ставок происходит в реальном времени.
              </div>
            </section>

            {/* ACTION BUTTONS – same blue CTA style as ProductCard */}
            <section className="flex gap-4">
              <Button
                className="
                  w-44
                  bg-blue-600 hover:bg-blue-700 text-white
                  text-sm font-bold uppercase tracking-wide
                  py-3 rounded-md
                  shadow-sm hover:shadow-md
                "
              >
                Сделать ставку
              </Button>

              <Button
                variant="outline"
                className="
                  w-44
                  text-sm font-medium uppercase tracking-wide
                  rounded-md
                "
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
        <div className="mt-14 mb-8 h-px w-full bg-border/70" />

        {/* Additional info block */}
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
