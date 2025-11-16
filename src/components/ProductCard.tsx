import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface ProductCardProps {
  id: number;
  image?: string;
  title: string;
  price: string;
  discount?: string;
  username?: string;
}

const ProductCard = ({ id, title, price, discount, username }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`} className="group">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Image placeholder */}
        <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gray-200" />
        </div>

        {/* Title */}
        <h3 className="text-sm">{title}</h3>

        {/* Timer */}
        <div className="text-sm font-semibold">{price}</div>

        {/* Action button */}
        <Button
          variant="secondary"
          className="w-40 bg-gray-400 text-white hover:bg-gray-400/90"
          onClick={(e) => {
            e.preventDefault();
            // Handle bid
          }}
        >
          Предложение
        </Button>

        {/* Bid and price info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Наибольшая ставка : {username || "Имя пользователя"}</div>
          <div className="font-semibold">Розничная цена: {discount || "2844 ₽"}</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
