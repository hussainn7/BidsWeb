import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-6 text-sm mb-6">
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
            О нас
          </Link>
          <Link to="/bet-placement" className="text-muted-foreground hover:text-foreground transition-colors">
            Размещение ставок
          </Link>
          <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
            Связаться с нами
          </Link>
          <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
            Вопросы и ответы
          </Link>
          <Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
            Доставка и оплата
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Правила возврата
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
            Договор оферты
          </Link>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          Политика конфиденциальности
        </div>

        <div className="flex gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
