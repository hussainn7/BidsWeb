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
      <div className="space-y-3">
        <div className="aspect-square bg-muted rounded-none overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm">{title}</h3>
          <div className="text-sm font-medium">{price}</div>
          
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              // Handle bid
            }}
          >
            Предложение
          </Button>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Наибольшая ставка · {username || "Имя пользователя"}</div>
            <div>Розничная цена: {discount || "2844 ₽"}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
