import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockOrders = [
  { id: "000000", name: "Товар", date: "Ноябрь 24,2020", status: "В доставке", price: "2644 ₽" },
  { id: "000000", name: "Товар", date: "Ноябрь 24,2020", status: "В доставке", price: "2644 ₽" },
  { id: "000000", name: "Товар", date: "Ноябрь 24,2020", status: "В доставке", price: "2644 ₽" },
];

const Account = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">Мой аккаунт</h1>
        
        <Tabs defaultValue="orders" className="max-w-4xl">
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="address">Адрес</TabsTrigger>
            <TabsTrigger value="data">Мои дата</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            {mockOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border">
                <div className="flex gap-8">
                  <div>
                    <div className="text-sm text-muted-foreground">Номер Заказа</div>
                    <div className="font-medium">{order.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Товар</div>
                    <div>{order.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Дата</div>
                    <div>{order.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Статус</div>
                    <div>{order.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Итоговая сумма</div>
                    <div>{order.price}</div>
                  </div>
                </div>
                <Button variant="secondary">Отследить</Button>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="address">
            <div className="text-sm text-muted-foreground">
              Адресная информация будет отображаться здесь.
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <div className="text-sm text-muted-foreground">
              Персональные данные будут отображаться здесь.
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
