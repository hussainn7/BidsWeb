import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Admin = () => {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, productsData, ordersData, payoutsData] = await Promise.all([
        api.getOverallStats(),
        api.getProducts(),
        api.getOrders(),
        api.getPayoutHistory(),
      ]);
      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setPayouts(payoutsData);
    } catch (error: any) {
      toast.error(error.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="text-center">Загрузка...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
          <p className="text-muted-foreground">Управление системой</p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Клики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.clicks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Заказы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Выручка</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(stats.revenue).toLocaleString()} ₽</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="payouts">Выплаты</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Все товары</CardTitle>
                <CardDescription>Список всех товаров в системе</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Партнер</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Мин. цена</TableHead>
                      <TableHead>Клики</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.partner?.fullName || product.partner?.email || "—"}</TableCell>
                        <TableCell>{Number(product.price).toLocaleString()} ₽</TableCell>
                        <TableCell>{Number(product.minPrice).toLocaleString()} ₽</TableCell>
                        <TableCell>{product.clickCount || 0}</TableCell>
                        <TableCell>
                          {product.isSold ? (
                            <span className="text-red-600">Продано</span>
                          ) : (
                            <span className="text-green-600">Активно</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Все заказы</CardTitle>
                <CardDescription>Список всех заказов</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер заказа</TableHead>
                      <TableHead>Товар</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{order.product?.name || "—"}</TableCell>
                        <TableCell>{order.user?.email || "—"}</TableCell>
                        <TableCell>{Number(order.amount).toLocaleString()} ₽</TableCell>
                        <TableCell>
                          {order.status === 'paid' ? (
                            <span className="text-green-600">Оплачен</span>
                          ) : (
                            <span className="text-yellow-600">Ожидает</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Выплаты партнерам</CardTitle>
                <CardDescription>История всех выплат</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Партнер</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Нет выплат
                        </TableCell>
                      </TableRow>
                    ) : (
                      payouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{payout.user?.email || "—"}</TableCell>
                          <TableCell className="font-semibold">
                            +{Number(payout.amount).toLocaleString()} ₽
                          </TableCell>
                          <TableCell>{payout.description}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
