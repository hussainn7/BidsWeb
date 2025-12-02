import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [balance, setBalance] = useState(0);
  const [balanceToUse, setBalanceToUse] = useState(0);
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
    refetchInterval: 5000, // Poll every 5 seconds for price updates
  });

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const data = await api.getBalance();
      setBalance(data.balance);
    } catch (error) {
      // User not logged in
    }
  };

  const handleClick = async () => {
    if (!id || !product) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Пожалуйста, войдите в систему для клика");
      navigate('/login');
      return;
    }

    if (product.isSold) {
      toast.error("Товар уже продан");
      return;
    }

    if (Number(product.price) <= Number(product.minPrice)) {
      toast.error("Цена уже на минимуме");
      return;
    }

    try {
      setIsProcessingClick(true);
      const result = await api.clickProduct(id);
      
      // Check if it's a mock payment (already processed on backend)
      if (result.isMock || result.confirmationUrl?.includes('mock=true')) {
        // Mock payment is already approved - just refresh and show success
        toast.success("Клик подтвержден! +40₽ добавлено на баланс");
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        await loadBalance();
        setIsProcessingClick(false);
      } else if (result.confirmationUrl) {
        // Real YooKassa payment - redirect to payment page
        window.location.href = result.confirmationUrl;
      } else {
        // No payment needed (shouldn't happen)
        toast.success("Клик зарегистрирован");
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        await loadBalance();
        setIsProcessingClick(false);
      }
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast.error("Пожалуйста, войдите в систему");
        navigate('/login');
      } else {
        toast.error(error.message || "Ошибка при клике");
      }
    } finally {
      setIsProcessingClick(false);
    }
  };

  const handlePurchase = async () => {
    if (!id || !product) return;

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Пожалуйста, войдите в систему для покупки");
      navigate('/login');
      return;
    }

    if (product.isSold) {
      toast.error("Товар уже продан");
      return;
    }

    try {
      setIsProcessingOrder(true);
      const result = await api.createOrder(id, balanceToUse);
      
      if (result.payment?.confirmationUrl) {
        // Redirect to payment
        window.location.href = result.payment.confirmationUrl;
      } else {
        toast.success("Заказ создан и оплачен!");
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        navigate('/account');
      }
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast.error("Пожалуйста, войдите в систему");
        navigate('/login');
      } else {
        toast.error(error.message || "Ошибка при создании заказа");
      }
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (isLoading) {
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="text-center">Товар не найден</div>
        </main>
        <Footer />
      </div>
    );
  }

  const priceVisible = product.priceVisible || product.isSold;
  const currentPrice = Number(product.price);
  const minPrice = Number(product.minPrice);
  const maxBalanceToUse = Math.min(balance, currentPrice);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE – IMAGE GALLERY */}
          <div className="flex gap-5">
            <div className="flex-1">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-white border border-border/60 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100" />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – PRODUCT INFORMATION */}
          <div className="flex flex-col gap-8">
            <section>
              <h1 className="text-2xl font-semibold tracking-tight mb-3">
                {product.name}
              </h1>

              <div className="text-xl font-bold text-foreground mb-4">
                {priceVisible
                  ? `${currentPrice.toLocaleString()} ₽`
                  : "Нажмите на клик, чтобы увидеть цену"}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground max-w-lg">
                {product.description}
              </p>
            </section>

            {/* AUCTION BOX */}
            <section className="rounded-lg border border-border/70 bg-slate-50/70 px-5 py-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Кликов
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {product.clickCount || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Минимальная цена
                </span>
                <span className="font-semibold text-foreground">{minPrice.toLocaleString()} ₽</span>
              </div>

              {balance > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Ваш баланс
                  </span>
                  <span className="font-semibold text-foreground">{balance.toLocaleString()} ₽</span>
                </div>
              )}

              <div className="pt-1 text-xs text-muted-foreground">
                Обновление цены в реальном времени ⌛️
              </div>
            </section>

            {/* ACTION BUTTONS */}
            {!product.isSold ? (
              <section className="flex flex-col gap-4">
                {priceVisible && (
                  <>
                    {!localStorage.getItem('token') ? (
                      <Button
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase rounded-md shadow-md"
                        onClick={() => navigate('/login')}
                      >
                        ВОЙТИ ДЛЯ ПОКУПКИ
                      </Button>
                    ) : (
                      <>
                        {balance > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Использовать баланс (макс. {maxBalanceToUse.toLocaleString()} ₽)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={maxBalanceToUse}
                              value={balanceToUse}
                              onChange={(e) => setBalanceToUse(Math.min(Number(e.target.value), maxBalanceToUse))}
                              className="w-full px-3 py-2 border border-border/60 rounded-md"
                            />
                          </div>
                        )}
                        <Button
                          className="w-full h-14 bg-amber-400 hover:bg-amber-500 text-black text-sm font-bold uppercase rounded-md shadow-md"
                          onClick={handlePurchase}
                          disabled={isProcessingOrder}
                        >
                          {isProcessingOrder ? "ОБРАБОТКА..." : `КУПИТЬ ЗА ${(currentPrice - balanceToUse).toLocaleString()} ₽`}
                        </Button>
                      </>
                    )}
                  </>
                )}

                {!localStorage.getItem('token') ? (
                  <Button
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase rounded-md shadow-md"
                    onClick={() => navigate('/login')}
                  >
                    ВОЙТИ ДЛЯ КЛИКА
                  </Button>
                ) : (
                  <Button
                    className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold uppercase rounded-md shadow-md"
                    onClick={handleClick}
                    disabled={isProcessingClick || product.isSold || currentPrice <= minPrice}
                  >
                    {isProcessingClick ? "ОБРАБОТКА..." : "РАСКРЫТЬ ЦЕНУ — 30₽"}
                  </Button>
                )}
              </section>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Товар продан
              </div>
            )}

            {/* SHIPPING / EXTRA INFO */}
            <section className="text-xs text-muted-foreground">
              Товар будет отправлен на следующий рабочий день!
            </section>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 mb-8 h-px w-full bg-border/70" />

        {/* Additional info block */}
        <div className="max-w-2xl text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Все товары проверяются перед отправкой. В случае обнаружения
            дефектов, вы можете связаться с нашей службой поддержки.
          </p>
          <p>
            Условия доставки и возврата зависят от конкретного продавца и
            региона. Пожалуйста, ознакомьтесь с правилами до совершения покупки.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
