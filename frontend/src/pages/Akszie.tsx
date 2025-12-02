import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Akszie = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-8">
          🎉 Акции и специальные предложения
        </h1>

        {/* PROMO BANNERS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          {/* Banner 1 */}
          <div
            className="
              rounded-xl border border-border/70 bg-white
              shadow-[0_10px_30px_rgba(15,23,42,0.08)]
              overflow-hidden cursor-pointer transition-all
              hover:shadow-xl hover:-translate-y-[3px]
            "
          >
            <div className="h-48 w-full bg-gradient-to-br from-pink-300 to-red-400" />
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-bold">Скидки до 70%</h2>
              <p className="text-sm text-muted-foreground">
                Огромный выбор товаров со значительными скидками. Успейте пока
                действует акция!
              </p>
              <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                Подробнее
              </Button>
            </div>
          </div>

          {/* Banner 2 */}
          <div
            className="
              rounded-xl border border-border/70 bg-white
              shadow-[0_10px_30px_rgba(15,23,42,0.08)]
              overflow-hidden cursor-pointer transition-all
              hover:shadow-xl hover:-translate-y-[3px]
            "
          >
            <div className="h-48 w-full bg-gradient-to-br from-emerald-300 to-emerald-500" />
            <div className="p-6 space-y-3">
              <h2 className="text-xl font-bold">Ежедневные кликовые акции</h2>
              <p className="text-sm text-muted-foreground">
                Каждый день новые товары по сниженной цене с помощью кликов!
              </p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Открыть
              </Button>
            </div>
          </div>
        </section>

        {/* SEPARATOR */}
        <div className="w-full h-px bg-border/60 my-10"></div>

        {/* LIST OF PROMOTIONS */}
        <section className="space-y-8 max-w-3xl">
          <h2 className="text-2xl font-semibold">Текущие акции</h2>

          <div className="space-y-5">
            {/* Promo item */}
            <div
              className="
                border border-border/60 rounded-lg p-5 bg-slate-50/70
                shadow-sm hover:shadow-md transition-all
              "
            >
              <h3 className="font-bold text-lg">🔥 Клики по 20₽</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Только 24 часа! Получайте скидки ещё быстрее.
              </p>
            </div>

            {/* Promo item */}
            <div
              className="
                border border-border/60 rounded-lg p-5 bg-slate-50/70
                shadow-sm hover:shadow-md transition-all
              "
            >
              <h3 className="font-bold text-lg">
                🎁 Подарок за первые 3 покупки
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Получите бонус при активном участии в аукционах.
              </p>
            </div>

            {/* Promo item */}
            <div
              className="
                border border-border/60 rounded-lg p-5 bg-slate-50/70
                shadow-sm hover:shadow-md transition-all
              "
            >
              <h3 className="font-bold text-lg">💸 Бесплатная доставка</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Для товаров от 1000₽ доставка бесплатно!
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Akszie;
