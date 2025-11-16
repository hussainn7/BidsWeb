import { Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import MegaMenu from "./MegaMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Каталог" },
    { path: "/about", label: "О нас" },
    { path: "/shipping", label: "Доставка/Оплата" },
    { path: "/contacts", label: "Контакты" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="relative z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center h-16 border-b border-border/70">
          {/* Logo left */}
          <Link
            to="/"
            className="mr-16 flex items-center gap-2 text-lg font-semibold tracking-normal"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#C8D9FF] bg-[#C8D9FF]/40 text-xs font-bold">
              L
            </span>
            <span className="uppercase text-sm tracking-wide">
              OGO
            </span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-8 text-sm">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const isCatalog = link.path === "/";

              const baseClasses =
                "relative pb-1 text-sm font-medium tracking-normal transition-colors";
              const activeClasses =
                "text-slate-900";
              const inactiveClasses =
                "text-muted-foreground hover:text-slate-900";

              if (isCatalog) {
                return (
                  <div
                    key={link.path}
                    className="relative z-50"
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <Link
                      to={link.path}
                      className={`${baseClasses} ${
                        active ? activeClasses : inactiveClasses
                      }`}
                    >
                      {link.label}
                      {/* blue underline pill */}
                      <span
                        className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-200 ${
                          active
                            ? "w-full bg-[#A4C0FF]"
                            : "w-0 bg-transparent group-hover:w-full"
                        }`}
                      />
                    </Link>

                    <MegaMenu
                      open={menuOpen}
                      onClose={() => setMenuOpen(false)}
                    />
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${baseClasses} ${
                    active ? activeClasses : inactiveClasses
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all duration-200 ${
                      active ? "w-full bg-[#C8D9FF]" : "w-0 bg-transparent"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Icons right – same position, nicer styling */}
          <div className="flex items-center justify-end gap-3 text-muted-foreground ml-8">
            <span className="hidden md:inline-block h-5 border-l border-border mr-1.5" />
            <button className="rounded-full p-1.5 hover:bg-[#C8D9FF]/40 hover:text-slate-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/cart"
              className="rounded-full p-1.5 hover:bg-[#C8D9FF]/40 hover:text-slate-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="rounded-full p-1.5 hover:bg-[#C8D9FF]/40 hover:text-slate-900 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
