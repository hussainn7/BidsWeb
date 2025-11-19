import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Users, Clock } from "lucide-react";

interface ProductCardProps {
  id: number;
  image?: string;
  title: string;
  price: string;      // Time or price string
  discount?: string;  // retail price
  username?: string;  // highest bidder
  participants?: number; // Number of participants
  timeLeft?: number; // Time left in seconds
}

const ProductCard = ({ 
  id, 
  image, 
  title, 
  price, 
  discount, 
  username,
  participants = 20,
  timeLeft = 3654
}: ProductCardProps) => {
  const [isRevealed, setIsRevealed] = useState(() => {
    return localStorage.getItem(`product-${id}-revealed`) === 'true';
  });
  const [clickCount, setClickCount] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(parseInt(price.replace(/[^\d]/g, "")));
  const [localParticipants, setLocalParticipants] = useState(participants);
  const [currentTime, setCurrentTime] = useState(timeLeft);
  const [isPermanent, setIsPermanent] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isPermanent) return;
    
    const timer = setInterval(() => {
      setCurrentTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPermanent]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isRevealed) {
      setIsRevealed(true);
      localStorage.setItem(`product-${id}-revealed`, 'true');
    }
  };

  const handleClick30 = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Открываем цену автоматически при первом клике
    if (!isRevealed) {
      setIsRevealed(true);
      localStorage.setItem(`product-${id}-revealed`, 'true');
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    setLocalParticipants((prev) => prev + 1);
    
    // Уменьшаем цену на 30 рублей
    setCurrentPrice((prev) => Math.max(prev - 30, 0));
    
    // Добавляем время в зависимости от количества кликов
    if (newClickCount === 1) {
      // +1 час
      setCurrentTime((prev) => prev + 3600);
    } else if (newClickCount === 2) {
      // +24 часа
      setCurrentTime((prev) => prev + 86400);
    } else if (newClickCount >= 3) {
      // Навсегда
      setIsPermanent(true);
    }
  };
  return (
    <Link to={`/product/${id}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-xl border border-border/60 bg-white shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl">
        <div className="px-6 py-5 relative flex flex-col h-full">
          {/* Top badges row */}
          <div className="flex items-center justify-between mb-4">
            {/* Participants badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-md">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">{localParticipants}</span>
            </div>

            {/* Timer badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-border/60">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">
                {isPermanent ? "∞" : formatTime(currentTime)}
              </span>
            </div>
          </div>

          {/* Product image */}
          <div className="flex justify-center py-4">
            <div className="h-36 w-36 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border border-border/40">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-4xl text-muted-foreground/30">📦</div>
              )}
            </div>
          </div>

          {/* Product name */}
          <h3 className="text-center text-sm font-bold text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>

          {/* Current price info */}
          <div className="text-center mb-3 min-h-[3rem]">
            {isRevealed && clickCount > 0 ? (
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Цена товара</p>
                <p className="text-lg font-bold text-emerald-600">{currentPrice.toLocaleString()} ₽</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground px-2">
                {!isRevealed ? "Нажмите на логотип" : "Нажмите КЛИК 30₽"}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-4">
            {/* Logo/Buy button */}
            {!isRevealed ? (
              <Button
                className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md text-white flex items-center justify-center transition-all"
                onClick={handleLogoClick}
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-12 w-auto object-contain"
                />
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 rounded-xl shadow-md bg-amber-400 hover:bg-amber-500 text-black text-xs font-bold transition-all"
                onClick={(e) => e.preventDefault()}
              >
                КУПИТЬ
              </Button>
            )}

            {/* Click 30 button */}
            <Button
              className="flex-1 h-12 rounded-xl shadow-md bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all"
              onClick={handleClick30}
            >
              КЛИК 30₽
            </Button>
          </div>

          {/* Auction details */}
          <div className="border-t border-border/60 pt-3 space-y-2 text-xs mt-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Лидер:</span>
              <div className="flex items-center gap-1">
                <span className="h-3 w-4 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
                <span className="font-semibold text-foreground text-xs">@ {username || "USER"}</span>
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Розничная цена:</span>
              <span className="font-bold text-foreground">{discount || "2 844 ₽"}</span>
            </div> */}
          </div>
        </div>

      </article>
    </Link>
  );
};

export default ProductCard;
