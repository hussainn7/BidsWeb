import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-medium mb-8 text-center">Мой аккаунт</h1>
          
          <div className="space-y-8">
            <form className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Вход</label>
                <Input type="email" placeholder="Email" />
              </div>
              
              <div>
                <label className="text-sm mb-2 block">Контрактный</label>
                <Input type="password" placeholder="Пароль" />
              </div>
              
              <Link to="/reset-password" className="text-sm text-muted-foreground hover:text-foreground block">
                Забыли пароль
              </Link>
              
              <Button className="w-full">
                Войти
              </Button>
              
              <Link to="/register" className="text-sm text-center block hover:opacity-70">
                Нет аккаунта? Зарегистрироваться
              </Link>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
