import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Receipt = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      toast.error("Номер заказа не указан");
      navigate("/account");
      return;
    }

    loadOrder();
  }, [orderId, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await api.getOrder(orderId!);
      setOrder(orderData);
    } catch (error: any) {
      toast.error(error.message || "Ошибка загрузки заказа");
      navigate("/account");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (order?.receiptUrl) {
      window.open(order.receiptUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg">Загрузка чека...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-lg text-red-600">Заказ не найден</p>
            <Button onClick={() => navigate("/account")} className="mt-4">
              Вернуться в аккаунт
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const orderDate = new Date(order.createdAt || order.paidAt);
  const totalAmount = Number(order.amount);
  const balanceUsed = Number(order.balanceUsed || 0);
  const paidAmount = totalAmount - balanceUsed;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Print button - hidden when printing */}
        <div className="mb-6 print:hidden flex gap-4">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            🖨️ Печать
          </Button>
          {order.receiptUrl && (
            <Button onClick={handleDownload} variant="outline">
              📄 Открыть оригинальный чек
            </Button>
          )}
          <Button onClick={() => navigate("/account")} variant="outline">
            ← Вернуться
          </Button>
        </div>

        {/* Receipt Card */}
        <Card className="bg-white shadow-lg print:shadow-none">
          <CardHeader className="border-b pb-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">ЧЕК О ПРОДАЖЕ</h1>
              <p className="text-sm text-muted-foreground">BidsWeb</p>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Order Info */}
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Номер заказа:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата:</span>
                <span>{orderDate.toLocaleString('ru-RU')}</span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата оплаты:</span>
                  <span>{new Date(order.paidAt).toLocaleString('ru-RU')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Статус:</span>
                <span className={`font-semibold ${
                  order.status === 'paid' ? 'text-green-600' : 
                  order.status === 'pending' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {order.status === 'paid' ? 'Оплачен' : 
                   order.status === 'pending' ? 'Ожидает оплаты' : 
                   order.status}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-3 border-b pb-4">
              <h2 className="text-lg font-semibold">Товар</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-lg mb-2">{order.product?.name || 'Товар'}</p>
                {order.product?.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {order.product.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Цена товара:</span>
                  <span className="font-bold text-lg">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-2 border-b pb-4">
              <h2 className="text-lg font-semibold">Детали оплаты</h2>
              {balanceUsed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Использовано бонусов:</span>
                  <span className="font-semibold">-{balanceUsed.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              {order.paymentId && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>ID платежа:</span>
                  <span className="font-mono">{order.paymentId}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">К ОПЛАТЕ:</span>
                <span className="text-3xl font-bold text-blue-600">
                  {paidAmount.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              {balanceUsed > 0 && (
                <div className="mt-2 text-sm text-muted-foreground text-right">
                  (из них оплачено бонусами: {balanceUsed.toLocaleString('ru-RU')} ₽)
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground space-y-2 pt-4 border-t">
              <p>Спасибо за покупку!</p>
              <p>По вопросам обращайтесь в службу поддержки</p>
              {order.receiptUrl && (
                <p className="text-xs mt-4">
                  Оригинальный чек доступен по ссылке выше
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Print styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:shadow-none,
            .print\\:shadow-none * {
              visibility: visible;
            }
            .print\\:shadow-none {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .print\\:hidden {
              display: none;
            }
          }
        `}</style>
      </main>
      <Footer />
    </div>
  );
};

export default Receipt;

