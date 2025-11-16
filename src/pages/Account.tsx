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
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8">МОЙ АККАУНТ</h1>
            
            <Tabs defaultValue="orders">
              <TabsList className="mb-8 bg-slate-50/50">
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="address">Адрес</TabsTrigger>
                <TabsTrigger value="data">Мои данные</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4">
                {mockOrders.map((order, index) => (
                  <div 
                    key={index} 
                    className="rounded-lg border border-border/60 bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Номер заказа</div>
                        <div className="text-sm font-semibold text-foreground">{order.id}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Товар</div>
                        <div className="text-sm text-foreground">{order.name}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Дата</div>
                        <div className="text-sm text-foreground">{order.date}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Статус</div>
                        <div className="text-sm font-semibold text-foreground">{order.status}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Сумма</div>
                        <div className="text-sm font-semibold text-foreground">{order.price}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-border/60 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                    >
                      Отследить
                    </Button>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="address">
                <div className="rounded-lg border border-border/60 bg-slate-50/50 p-6">
                  <p className="text-sm text-muted-foreground">
                    Адресная информация будет отображаться здесь.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="data">
                <div className="rounded-lg border border-border/60 bg-slate-50/50 p-6">
                  <p className="text-sm text-muted-foreground">
                    Персональные данные будут отображаться здесь.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
