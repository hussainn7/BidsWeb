import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PartnerDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    minPrice: "",
    imageUrl: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, statsData, payoutsData] = await Promise.all([
        api.getMyProducts(),
        api.getPartnerStats(),
        api.getPayoutHistory(),
      ]);
      setProducts(productsData);
      setStats(statsData);
      setPayouts(payoutsData);
    } catch (error: any) {
      toast.error(error.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await api.createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        minPrice: Number(newProduct.minPrice),
        imageUrl: newProduct.imageUrl || undefined,
      });
      toast.success("Товар создан");
      setIsDialogOpen(false);
      setNewProduct({ name: "", description: "", price: "", minPrice: "", imageUrl: "" });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Ошибка создания товара");
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
          <h1 className="text-3xl font-bold mb-2">Панель партнера</h1>
          <p className="text-muted-foreground">Управление товарами и статистика</p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Товары</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products}</div>
              </CardContent>
            </Card>
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
          </div>
        )}

        {/* Create Product Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Создать товар</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Создать новый товар</DialogTitle>
                <DialogDescription>
                  Заполните информацию о товаре
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Цена</Label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Минимальная цена</Label>
                    <Input
                      type="number"
                      value={newProduct.minPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, minPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>URL изображения (опционально)</Label>
                  <Input
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateProduct} className="w-full">
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Мои товары</CardTitle>
            <CardDescription>Список всех ваших товаров</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Мин. цена</TableHead>
                  <TableHead>Клики</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        Просмотр
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payouts */}
        <Card>
          <CardHeader>
            <CardTitle>Выплаты</CardTitle>
            <CardDescription>История ваших выплат</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Описание</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Нет выплат
                    </TableCell>
                  </TableRow>
                ) : (
                  payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
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
      </main>

      <Footer />
    </div>
  );
};

export default PartnerDashboard;

