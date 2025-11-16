import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import MegaMenu from "./MegaMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background">
      {/* Main navbar */}
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center h-16 border-b border-border">
          {/* Logo left */}
          <Link to="/" className="text-xl font-bold tracking-wide mr-16">
            LOGO
          </Link>

          {/* Center nav links, shifted closer to icons */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-8 text-sm">
            <div
              className="relative"
              onMouseEnter={() => setMenuOpen(true)}
            >
              <Link
                to="/"
                className="pb-1 border-b-2 border-primary hover:opacity-70 transition-opacity"
              >
                Каталог
              </Link>

              {/* Mega menu dropdown anchored to Каталог */}
              <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
            </div>
            <Link
              to="/about"
              className="hover:opacity-70 transition-opacity"
            >
              О нас
            </Link>
            <Link
              to="/shipping"
              className="hover:opacity-70 transition-opacity"
            >
              Доставка/Оплата
            </Link>
            <Link
              to="/contacts"
              className="hover:opacity-70 transition-opacity"
            >
              Контакты
            </Link>
          </nav>

          {/* Icons right with divider */}
          <div className="flex items-center justify-end gap-4 text-muted-foreground ml-8">
            <span className="hidden md:inline-block h-5 border-l border-border mr-2" />
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

      </div>
    </header>
  );
};

export default Header;
