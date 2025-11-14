import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import MegaMenu from "./MegaMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            LOGO
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
            >
              <Link
                to="/"
                className="text-sm hover:opacity-70 transition-opacity border-b-2 border-primary pb-1"
              >
                Каталог
              </Link>
            </div>
            <Link to="/about" className="text-sm hover:opacity-70 transition-opacity">
              О нас
            </Link>
            <Link to="/shipping" className="text-sm hover:opacity-70 transition-opacity">
              Доставка/Оплата
            </Link>
            <Link to="/contacts" className="text-sm hover:opacity-70 transition-opacity">
              Контакты
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hover:opacity-70 transition-opacity">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/cart" className="hover:opacity-70 transition-opacity">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link to="/login" className="hover:opacity-70 transition-opacity">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
