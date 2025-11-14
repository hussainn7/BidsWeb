import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BetPlacement = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">РАЗМЕЩЕНИЕ СТАВКИ</h1>
        
        <div className="max-w-3xl space-y-6 text-sm leading-relaxed text-muted-foreground">
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

          <h2 className="font-medium text-foreground pt-4">Самовывоз из магазина</h2>
          <p>
            Время работы магазина: С 9:00 до 18:00, кроме субботы и воскресенья. 
            Товар хранится после подтверждения заказа в течение 14 дней.
          </p>

          <h2 className="font-medium text-foreground pt-4">Самовывоз из пункта выдачи СДЭК</h2>
          <p>
            Оформить самовывоз из пункта выдачи Вы можете прямо на сайте выбрав ближайший 
            к Вам. Заказы до 1000₽ принимаются только по 100% предоплате. После приёмки 
            заказа на складе и его отправки Вы получите уведомления.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BetPlacement;
