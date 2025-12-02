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
  fullName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.register(values.email, values.password, values.fullName);
      api.setToken(response.access_token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', values.email);
      
      toast.success("Регистрация успешна!");
      navigate('/account');
    } catch (error: any) {
      toast.error(error.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">РЕГИСТРАЦИЯ</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Имя</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Введите ваше имя"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Подтвердите пароль</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Повторите пароль" 
                          className="border-border/60"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "РЕГИСТРАЦИЯ..." : "ЗАРЕГИСТРИРОВАТЬСЯ"}
                </Button>
                
                <div className="pt-4 border-t border-border/60">
                  <p className="text-sm text-center text-muted-foreground">
                    Уже есть аккаунт?{" "}
                    <Link 
                      to="/login" 
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Войти
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

export default Register;
