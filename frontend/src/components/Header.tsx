import { Search, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import MegaMenu from "./MegaMenu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Listen for storage changes (when token is set/removed)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check periodically (in case token is set in same window)
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { path: "/", label: "Каталог" },
    { path: "/akszie", label: "Акции" },
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
    <header className="relative z-50 border-b border-border/50 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-2 sm:px-4 relative">
        <div className="flex items-center h-14 sm:h-16">
          {/* Logo left */}
          <Link
            to="/"
            className="mr-4 sm:mr-8 md:mr-16 flex items-center flex-shrink-0"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            />
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex flex-1 items-center justify-end gap-4 lg:gap-8 text-sm">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const isCatalog = link.path === "/";

              const baseClasses =
                "relative pb-1 text-sm font-medium tracking-normal transition-colors";
              const activeClasses = "text-blue-600 font-semibold";
              const inactiveClasses =
                "text-slate-700 hover:text-blue-600 transition-colors";

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
                            ? "w-full bg-blue-400"
                            : "w-0 bg-transparent group-hover:w-full group-hover:bg-blue-200"
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
                      active ? "w-full bg-blue-400" : "w-0 bg-transparent group-hover:w-full group-hover:bg-blue-200"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Icons right – same position, nicer styling */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3 text-muted-foreground ml-auto md:ml-8">
            <span className="hidden md:inline-block h-5 border-l border-border mr-1.5" />
            <button className="rounded-full p-1 sm:p-1.5 hover:bg-[#C8D9FF]/40 hover:text-slate-900 transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link
              to="/cart"
              className="rounded-full p-1 sm:p-1.5 hover:bg-[#C8D9FF]/40 hover:text-slate-900 transition-colors"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="rounded-full p-1 sm:p-1.5 hover:bg-[#C8D9FF]/40 hover:text-slate-900 transition-colors"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
