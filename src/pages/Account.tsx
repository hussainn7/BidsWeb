import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockOrders = [
  { id: "000000", name: "Товар", date: "Ноябрь 24,2020", status: "В доставке", price: "2644 ₽" },
  { id: "000000", name: "Товар", date: "Ноябрь 24,2020", status: "В доставке", price: "2644 ₽" },
  { id: "000000", name: "Товар", date: "Ноябрь 24,2020", status: "В доставке", price: "2644 ₽" },
];

const Account = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (!isAuthenticated || !email) {
      toast.error("Пожалуйста, войдите в систему");
      navigate('/login');
      return;
    }
    
    setUserEmail(email);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success("Вы успешно вышли из системы");
    navigate('/login');
  };

  if (!userEmail) {
    return null; // or a loading spinner
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">МОЙ АККАУНТ</h1>
              <Button 
                variant="outline" 
                className="border-border/60 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                <Card className="border-border/60 bg-slate-50/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Личная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                        <p className="text-foreground">{userEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Имя</p>
                        <p className="text-foreground">Не указано</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Телефон</p>
                        <p className="text-foreground">Не указан</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Дата регистрации</p>
                        <p className="text-foreground">18 ноября 2025</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border/60">
                      <Button 
                        variant="outline" 
                        className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setActiveTab('address')}
                      >
                        Редактировать адрес
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
