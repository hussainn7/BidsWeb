import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    const checkPayment = async () => {
      const orderId = searchParams.get('orderId');
      const clickId = searchParams.get('clickId');
      const productId = searchParams.get('productId');
      const paymentType = searchParams.get('type'); // 'balance_topup', 'order', 'click'

      // For mock payments, payment_id might be in the URL
      const paymentIdFromUrl = searchParams.get('payment_id') || window.location.search.match(/payment_id=([^&]+)/)?.[1];
      
      if (!paymentIdFromUrl) {
        setStatus('error');
        toast.error("Не удалось получить информацию о платеже");
        setTimeout(() => navigate('/'), 2000);
        return;
      }
      
      const paymentId = paymentIdFromUrl;

      try {
        // Check payment status (or auto-approve mock payments)
        const isMock = searchParams.get('mock') === 'true' || (paymentId && paymentId.startsWith('mock_'));
        
        if (isMock) {
          // Auto-approve mock payments immediately
          if (clickId && productId) {
            try {
              await api.confirmClickPayment(productId, clickId, paymentId);
              toast.success("Клик подтвержден! +40₽ добавлено на баланс");
              setStatus('success');
              setTimeout(() => navigate(`/product/${productId}`), 1500);
            } catch (error: any) {
              console.error('Error confirming click payment:', error);
              toast.error("Ошибка подтверждения клика");
              setStatus('error');
              setTimeout(() => navigate(`/product/${productId}`), 2000);
            }
          } else if (orderId) {
            try {
              await api.confirmOrderPayment(orderId, paymentId);
              toast.success("Заказ оплачен!");
              setStatus('success');
              setTimeout(() => navigate('/account'), 1500);
            } catch (error: any) {
              console.error('Error confirming order payment:', error);
              toast.error("Ошибка подтверждения заказа");
              setStatus('error');
              setTimeout(() => navigate('/account'), 2000);
            }
          } else if (paymentType === 'balance_topup') {
            // Balance top-up - for mock payments, confirm it
            try {
              const amount = parseFloat(searchParams.get('amount') || '0');
              await api.confirmTopUp(paymentId, amount);
              toast.success("Баланс успешно пополнен!");
              setStatus('success');
              setTimeout(() => navigate('/account?type=balance_topup'), 1500);
            } catch (error: any) {
              console.error('Error confirming balance top-up:', error);
              toast.error("Ошибка подтверждения пополнения баланса");
              setStatus('error');
              setTimeout(() => navigate('/account'), 2000);
            }
          } else {
            toast.success("Платеж успешно обработан");
            setStatus('success');
            setTimeout(() => navigate('/account'), 1500);
          }
          return;
        }

        const paymentStatus = await api.getPaymentStatus(paymentId);

        if (paymentStatus.status === 'succeeded' && paymentStatus.paid) {
          // If it's a click payment
          if (clickId && productId) {
            await api.confirmClickPayment(productId, clickId, paymentId);
            toast.success("Клик подтвержден! +40₽ добавлено на баланс");
            navigate(`/product/${productId}`);
          }
          // If it's an order payment
          else if (orderId) {
            await api.confirmOrderPayment(orderId, paymentId);
            toast.success("Заказ оплачен!");
            navigate('/account');
          } else if (paymentType === 'balance_topup') {
            // Balance top-up - for real payments, webhook will handle it
            // But we can also try to confirm it here as a fallback
            try {
              const amount = parseFloat(searchParams.get('amount') || '0');
              if (amount > 0) {
                await api.confirmTopUp(paymentId, amount);
              }
              toast.success("Пополнение баланса обрабатывается...");
              navigate('/account?type=balance_topup');
            } catch (error: any) {
              // If confirmation fails, webhook will handle it
              toast.success("Пополнение баланса обрабатывается...");
              navigate('/account?type=balance_topup');
            }
          } else {
            toast.success("Платеж успешно обработан");
            navigate('/account');
          }
          setStatus('success');
        } else {
          setStatus('error');
          toast.error("Платеж не был подтвержден");
          navigate('/account');
        }
      } catch (error: any) {
        setStatus('error');
        toast.error(error.message || "Ошибка при проверке платежа");
        navigate('/account');
      }
    };

    checkPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
        <div className="text-center">
          {status === 'checking' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg">Проверка платежа...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-lg text-green-600">Платеж успешно обработан</p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="text-red-600 text-4xl mb-4">✗</div>
              <p className="text-lg text-red-600">Ошибка обработки платежа</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCallback;

