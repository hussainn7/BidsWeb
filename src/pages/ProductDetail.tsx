import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3654); // seconds (e.g., 1:00:54)
  const [participants, setParticipants] = useState(20);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleLogoClick = () => {
    if (!isRevealed) {
      setIsRevealed(true);
    }
  };

  const handleBidClick = () => {
    // Simulate adding a bid
    setParticipants((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 flex items-center justify-center">
        {/* Main Product Card */}
        <div className="w-full max-w-lg rounded-xl border border-border/60 bg-white shadow-lg overflow-hidden">
          <div className="px-8 py-6 relative">
            {/* Top badges row */}
            <div className="flex items-center justify-between mb-4">
              {/* Participants badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-md">
                <Users className="w-4 h-4" />
                <span className="text-sm font-bold">{participants}</span>
              </div>

              {/* Timer badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-border/60">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Product image */}
            <div className="flex justify-center py-6">
              <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-border/40">
                <img
                  src="https://via.placeholder.com/192x192?text=Товар"
                  alt="Товар"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
            </div>

            {/* Product name */}
            <h1 className="text-center text-xl font-bold text-foreground mb-3">
              КОЛЬЦО С ГОЛУБЫМ ТОПАЗОМ 5 КАРАТ 14К ЗОЛОТО
            </h1>

            {/* Current bid info (before reveal) or price (after reveal) */}
            <div className="text-center mb-4">
              {isRevealed ? (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Текущая ставка</p>
                  <p className="text-2xl font-bold text-emerald-600">4 600 ₽</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Нажмите на кнопку, чтобы увидеть текущую ставку
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-5">
              {/* Logo/Buy button */}
              {!isRevealed ? (
                <Button
                  className="flex-1 h-14 bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md text-white flex items-center justify-center transition-all"
                  onClick={handleLogoClick}
                >
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="h-8 w-auto object-contain"
                  />
                </Button>
              ) : (
                <Button
                  className="flex-1 h-14 rounded-xl shadow-md bg-amber-400 hover:bg-amber-500 text-black text-base font-bold transition-all"
                  onClick={handleBidClick}
                >
                  СДЕЛАТЬ СТАВКУ
                </Button>
              )}

              {/* Quick bid button */}
              <Button
                className="flex-1 h-14 rounded-xl shadow-md bg-emerald-500 hover:bg-emerald-600 text-white text-base font-bold transition-all"
                onClick={handleBidClick}
              >
                КЛИК +30₽
              </Button>
            </div>

            {/* Auction details */}
            <div className="border-t border-border/60 pt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Лидер:</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-5 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
                  <span className="font-semibold text-foreground">@ ИВАНОВ</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Начальная цена:</span>
                <span className="font-bold text-foreground">5 000 ₽</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Розничная цена:</span>
                <span className="font-bold text-foreground">12 844 ₽</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Экономия:</span>
                <span className="font-bold text-emerald-600">-65%</span>
              </div>
            </div>
          </div>

          {/* Bottom info panel */}
          <div className="bg-slate-50/50 border-t border-border/60 px-8 py-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <span className="h-3 w-4 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
              <span className="font-semibold">ДОСТАВКА ИЗ США</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Товар будет отправлен на следующий рабочий день после завершения аукциона!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
