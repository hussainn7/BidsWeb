import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BetPlacement = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8">РАЗМЕЩЕНИЕ СТАВКИ</h1>
            
            <div className="space-y-6 text-sm leading-relaxed text-foreground">
              <p>
                Доставка товара производится в соответствии с выбранным городом доставки, 
                указанном при оформлении заказа.
              </p>
              
              <p>
                Отследить статус заказа можно в Личном кабинете или обратившись по контактным 
                данным или офисам получателям. Следуйте номер доставки позволит осуществлять 
                контроль за посылкой онлайн указанном в сайта. После получения заказа, при 
                необходимости можно сразу проверить заказ до оплаты.
              </p>

              <div className="pt-4 border-t border-border/60">
                <h2 className="text-xl font-semibold text-foreground mb-4">Самовывоз из магазина</h2>
                <p>
                  Время работы магазина: С 9:00 до 18:00, кроме субботы и воскресенья. 
                  Товар хранится после подтверждения заказа в течение 14 дней.
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <h2 className="text-xl font-semibold text-foreground mb-4">Самовывоз из пункта выдачи СДЭК</h2>
                <p>
                  Оформить самовывоз из пункта выдачи Вы можете прямо на сайте выбрав ближайший 
                  к Вам. Заказы до 1000₽ принимаются только по 100% предоплате. После приёмки 
                  заказа на складе и его отправки Вы получите уведомления.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BetPlacement;
