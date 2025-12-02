import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";

const formSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const Login = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.login(values.email, values.password);
      api.setToken(response.access_token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', values.email);
      
      toast.success("Успешный вход в систему!");
      navigate('/account');
    } catch (error: any) {
      toast.error(error.message || "Ошибка входа");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">МОЙ АККАУНТ</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your@email.com"
                          className="border-border/60"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Пароль</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Введите пароль"
                          className="border-border/60"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <Link 
                    to="/reset-password" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "ВХОД..." : "ВОЙТИ"}
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
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
