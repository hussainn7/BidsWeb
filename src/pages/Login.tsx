import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">МОЙ АККАУНТ</h1>
            
            <form className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="border-border/60"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Пароль</label>
                <Input 
                  type="password" 
                  placeholder="Введите пароль" 
                  className="border-border/60"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Link 
                  to="/reset-password" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Забыли пароль?
                </Link>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold">
                ВОЙТИ
              </Button>
              
              <div className="pt-4 border-t border-border/60">
                <p className="text-sm text-center text-muted-foreground">
                  Нет аккаунта?{" "}
                  <Link 
                    to="/register" 
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
