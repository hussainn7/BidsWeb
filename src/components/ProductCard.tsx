import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface ProductCardProps {
  id: number;
  image?: string;
  title: string;
  price: string;      // e.g. "00:26" or "09:11" or "BID 1 200 ₽" – use however you want
  discount?: string;  // retail price
  username?: string;  // highest bidder
}

const ProductCard = ({ id, image, title, price, discount, username }: ProductCardProps) => {
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

          {/* Timer */}
          <div className="mt-4 text-lg font-bold text-foreground tracking-tight">
            {price}
          </div>

          {/* Bid button – blue like Bids.com */}
          <Button
            variant="default"
            className="
              mt-4 w-full
              bg-blue-600 hover:bg-blue-700 text-white
              text-sm font-bold uppercase tracking-wide
              py-3 rounded-md
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
            onClick={(e) => {
              e.preventDefault();
              // open bid modal, etc.
            }}
          >
            СДЕЛАТЬ СТАВКУ
          </Button>
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
