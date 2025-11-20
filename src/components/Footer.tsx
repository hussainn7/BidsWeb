import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-16 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Top links row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-2 text-muted-foreground">
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            О нас
          </Link>
          <Link
            to="/faq"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Связаться с нами
          </Link>
          <Link
            to="/faq"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Вопросы и ответы
          </Link>
          <Link
            to="/shipping"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Доставка и оплата
          </Link>
          <Link
            to="/terms"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Договор оферты
          </Link>
        </div>

        {/* Payment icons centered */}
        <div className="flex justify-center gap-6 mt-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            alt="Visa"
            className="h-8"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-8"
          />
        </div>

        {/* Platform name + tagline */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <div className="font-semibold text-foreground text-base">
            Ниже Некуда
          </div>
          <div className="text-muted-foreground">
            Первая гемифицированная платформа низких цен
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
