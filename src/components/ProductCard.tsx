import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { usePriceVisibility } from "@/hooks/usePriceVisibility";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  image?: string;
  title: string;
  price: number;      // Product price in rubles
  minPrice: number;   // Minimum price for the product
  discount?: string;  // retail price
  username?: string;  // highest bidder
  showPriceByDefault?: boolean; // For admin or special cases
}

const ProductCard = ({ id, image, title, price, minPrice, discount, username, showPriceByDefault = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showBuyButton, setShowBuyButton] = useState(false);
  
  const {
    isPriceVisible,
    showBuyButton: shouldShowBuyButton,
    bonusRubles,
    handlePriceClick,
    applyBonus,
    bonusExpiryDays
  } = usePriceVisibility(id.toString());

  // Apply bonus to price if available
  const { finalPrice, discountApplied } = applyBonus(price, minPrice);
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };
  return (
    <Link to={`/product/${id}`} className="group block h-full">
      <article
        className="
          flex h-full flex-col
          rounded-lg border border-border/60 bg-white
          shadow-sm
          transition-all duration-300
          group-hover:shadow-lg group-hover:border-border
        "
      >
        {/* IMAGE */}
        <div className="relative w-full overflow-hidden rounded-t-lg bg-white aspect-[4/3]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
              <div className="text-4xl text-muted-foreground/30">📦</div>
            </div>
          )}

          {/* ДОСТАВКА ИЗ США label */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-sm border border-border/50">
            <span className="h-3 w-4 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-foreground">
              ДОСТАВКА ИЗ США
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col px-5 pt-5 pb-4 bg-white">
          {/* Title */}
          <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-foreground transition-colors text-left">
            {title}
          </h3>

          {/* Price Display */}
          <div 
            className={`
              mt-4 text-lg font-bold tracking-tight cursor-pointer
              ${isPriceVisible || showPriceByDefault ? 'text-foreground' : 'text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md inline-block'}
              transition-colors duration-200
            `}
            onClick={() => {
              if (!isPriceVisible) {
                handlePriceClick();
                if (bonusRubles > 0) {
                  toast.success(`+${bonusRubles} бонусных рублей начислено! Действуют ${bonusExpiryDays} дней.`);
                }
              }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isPriceVisible || showPriceByDefault ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{formatPrice(finalPrice)}</span>
                  {discountApplied > 0 && (
                    <span className="text-sm line-through text-muted-foreground">
                      {formatPrice(price)}
                    </span>
                  )}
                </div>
                {discountApplied > 0 && (
                  <div className="text-sm text-green-600">
                    Экономия {formatPrice(discountApplied)} с бонусов
                  </div>
                )}
              </div>
            ) : (
              <span className="text-sm font-medium">
                {isHovered ? 'Нажмите, чтобы увидеть цену' : 'Цена скрыта'}
              </span>
            )}
          </div>

          {/* Buy or Bid Button */}
          <div className="mt-4 space-y-2">
            {(shouldShowBuyButton || showPriceByDefault) && (
              <Button
                variant="default"
                className="
                  w-full
                  bg-green-600 hover:bg-green-700 text-white
                  text-sm font-bold uppercase tracking-wide
                  py-3 rounded-md
                  transition-all duration-200
                  shadow-sm hover:shadow-md
                "
                onClick={(e) => {
                  e.preventDefault();
                  // Handle buy now action
                  toast.success('Товар добавлен в корзину!');
                }}
              >
                КУПИТЬ ЗА {formatPrice(finalPrice)}
              </Button>
            )}
            
            <Button
              variant="default"
              className={`
                w-full
                ${shouldShowBuyButton || showPriceByDefault ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600/90 hover:bg-blue-700/90'}
                text-white text-sm font-bold uppercase tracking-wide
                py-3 rounded-md
                transition-all duration-200
                shadow-sm hover:shadow-md
              `}
              onClick={(e) => {
                e.preventDefault();
                // Open bid modal
                if (!isPriceVisible) {
                  handlePriceClick();
                  if (bonusRubles > 0) {
                    toast.success(`+${bonusRubles} бонусных рублей начислено! Действуют ${bonusExpiryDays} дней.`);
                  }
                } else {
                  // Open bid modal
                  toast('Форма ставки будет открыта в модальном окне');
                }
              }}
            >
              {isPriceVisible || showPriceByDefault ? 'СДЕЛАТЬ СТАВКУ' : 'УЗНАТЬ ЦЕНУ'}
            </Button>
          </div>
        </div>

        {/* FOOTER – info block similar to Bids.com */}
        <div className="border-t border-border bg-slate-50/50 px-5 py-3.5 space-y-2">
          {/* Лидер */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              ЛИДЕР
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-5 rounded-sm bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-sm border border-border/30" />
              <span className="text-xs font-semibold text-foreground">
                @ {username || "Пользователь"}
              </span>
            </div>
          </div>

          {/* Bonus Info */}
          {bonusRubles > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Ваши бонусы
              </span>
              <span className="text-sm font-semibold text-green-600">
                +{bonusRubles} ₽
              </span>
            </div>
          )}
          
          {/* Розничная цена line */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Розничная цена
            </span>
            <span className="font-semibold text-foreground">
              {discount || "2 844 ₽"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
