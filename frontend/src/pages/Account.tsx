import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

const mockOrders = [
  {
    id: "000000",
    name: "Товар",
    date: "Ноябрь 24,2020",
    status: "В доставке",
    price: "2644 ₽",
  },
  {
    id: "000000",
    name: "Товар",
    date: "Ноябрь 24,2020",
    status: "В доставке",
    price: "2644 ₽",
  },
  {
    id: "000000",
    name: "Товар",
    date: "Ноябрь 24,2020",
    status: "В доставке",
    price: "2644 ₽",
  },
];

const Account = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("balance");
  const [balance, setBalance] = useState(0);
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        toast.error("Пожалуйста, войдите в систему");
        navigate("/login");
        return;
      }

      setLoading(true);
      const [profileData, balanceData, historyData, ordersData] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getBalance().catch(() => ({ balance: 0 })),
        api.getBalanceHistory().catch(() => []),
        api.getOrders().catch(() => []),
      ]);

      setProfile(profileData);
      setUserEmail(profileData?.email || localStorage.getItem("userEmail"));
      setBalance(balanceData.balance);
      setBalanceHistory(historyData);
      setOrders(ordersData);
    } catch (error: any) {
      toast.error(error.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    api.setToken(null);
    toast.success("Вы успешно вышли из системы");
    navigate("/login");
  };

  if (!userEmail) {
    return null; // or a loading spinner
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">МОЙ АККАУНТ</h1>
              <Button
                variant="outline"
                className="border-border/60 hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto text-sm"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="bg-slate-50/50 w-full sm:w-auto inline-flex min-w-full sm:min-w-0">
                  <TabsTrigger
                    value="balance"
                    className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
                  >
                    <span className="hidden sm:inline">Пополнение счета</span>
                    <span className="sm:hidden">Пополнение</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bonus"
                    className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
                  >
                    <span className="hidden sm:inline">Бонусный счет</span>
                    <span className="sm:hidden">Бонусы</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
                  >
                    Заказы
                  </TabsTrigger>
                  <TabsTrigger
                    value="data"
                    className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap px-3 sm:px-4"
                  >
                    <span className="hidden sm:inline">Информация</span>
                    <span className="sm:hidden">Инфо</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="balance" className="space-y-4 sm:space-y-6">
                <div className="rounded-lg border border-border/60 bg-white shadow-sm p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Пополнение счета
                  </h2>

                  {/* Текущий баланс */}
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-green-50 border border-border/60 p-6 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Текущий баланс
                    </p>
                    <p className="text-3xl font-bold text-foreground">0 ₽</p>
                  </div>

                  {/* Быстрое пополнение */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Быстрое пополнение
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[500, 1000, 2000, 5000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          className="h-14 sm:h-16 text-sm sm:text-base border-border/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 font-bold"
                        >
                          {amount} ₽
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Произвольная сумма */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Произвольная сумма
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="number"
                        placeholder="Введите сумму"
                        className="flex-1 h-12 px-4 rounded-lg border border-border/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold whitespace-nowrap">
                        Пополнить
                      </Button>
                    </div>
                  </div>

                  {/* Способы оплаты */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Способы оплаты
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border border-border/60 p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="text-center">
                          <div className="text-2xl mb-2">💳</div>
                          <p className="text-sm font-semibold">
                            Банковская карта
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border/60 p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="text-center">
                          <div className="text-2xl mb-2">📱</div>
                          <p className="text-sm font-semibold">СБП</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-border/60 p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="text-center">
                          <div className="text-2xl mb-2">💰</div>
                          <p className="text-sm font-semibold">
                            Электронные кошельки
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bonus" className="space-y-4 sm:space-y-6">
                <div className="rounded-lg border border-border/60 bg-white shadow-sm p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                    Бонусный счет
                  </h2>

                  {/* Бонусный баланс */}
                  <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-border/60 p-6 mb-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Накоплено бонусов
                    </p>
                    <p className="text-3xl font-bold text-foreground">{balance.toLocaleString()} ₽</p>
                  </div>

                  {/* Как получить бонусы */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Как получить бонусы
                    </h3>
                    <div className="rounded-lg border border-border/60 bg-slate-50/50 p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
                          🖱️
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <p className="font-bold text-lg mb-2">
                            За клики на товары
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Нажимайте "КЛИК 30₽" на карточках товаров и
                            зарабатывайте бонусы. {/* Добавленный текст ниже */}
                            <span className="font-medium text-foreground/90">
                              Бонусные рубли можно потратить при покупке товара
                              и снизить цену до минимальной.
                            </span>
                          </p>
                        </div>
                        <div className="text-emerald-600 font-bold text-2xl">
                          +40₽
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* История бонусов */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      История баланса
                    </h3>
                    {balanceHistory.length === 0 ? (
                      <div className="rounded-lg border border-border/60 bg-slate-50/50 p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          У вас пока нет истории операций
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {balanceHistory.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="rounded-lg border border-border/60 bg-white p-4 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-semibold">{transaction.description || transaction.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className={`font-bold ${Number(transaction.amount) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Number(transaction.amount) > 0 ? '+' : ''}{Number(transaction.amount).toLocaleString()} ₽
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                {orders.length === 0 ? (
                  <div className="rounded-lg border border-border/60 bg-slate-50/50 p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      У вас пока нет заказов
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                  <div
                    key={index}
                    className="rounded-lg border border-border/60 bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
                          Номер заказа
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {order.orderNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
                          Товар
                        </div>
                        <div className="text-sm text-foreground">
                          {order.product?.name || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
                          Дата
                        </div>
                        <div className="text-sm text-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
                          Статус
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {order.status === 'paid' ? 'Оплачен' : order.status === 'pending' ? 'Ожидает оплаты' : order.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">
                          Сумма
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {Number(order.amount).toLocaleString()} ₽
                        </div>
                      </div>
                    </div>
                    {order.receiptUrl && (
                      <Button
                        variant="outline"
                        className="border-border/60 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                        onClick={() => window.open(order.receiptUrl, '_blank')}
                      >
                        Чек
                      </Button>
                    )}
                  </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="data">
                <Card className="border-border/60 bg-slate-50/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Личная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="text-foreground">{userEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Имя
                        </p>
                        <p className="text-foreground">{profile?.fullName || "Не указано"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Телефон
                        </p>
                        <p className="text-foreground">Не указан</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Дата регистрации
                        </p>
                        <p className="text-foreground">18 ноября 2025</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60">
                      <h3 className="text-lg font-semibold mb-4">
                        Адрес доставки
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Город
                          </p>
                          <input
                            type="text"
                            placeholder="Введите город"
                            className="w-full h-10 px-3 rounded-lg border border-border/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Адрес
                          </p>
                          <input
                            type="text"
                            placeholder="Улица, дом, квартира"
                            className="w-full h-10 px-3 rounded-lg border border-border/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Индекс
                          </p>
                          <input
                            type="text"
                            placeholder="Почтовый индекс"
                            className="w-full h-10 px-3 rounded-lg border border-border/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          Сохранить адрес
                        </Button>
                      </div>
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
