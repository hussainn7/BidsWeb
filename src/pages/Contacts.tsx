import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail } from "lucide-react";

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8">КОНТАКТЫ</h1>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Телефон</p>
                  <p className="text-sm font-semibold text-foreground">+7-999-999-99-99</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-lg">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-semibold text-foreground">info@mail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-2">ОСТАВЬТЕ ЗАЯВКУ</h2>
            <p className="text-sm text-muted-foreground mb-6">
              И мы свяжемся с вами в ближайшее время
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Имя</label>
                <Input placeholder="Ваше имя" className="border-border/60" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Телефон</label>
                <Input type="tel" placeholder="+7 (___) ___-__-__" className="border-border/60" />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Сообщение</label>
                <Textarea placeholder="Ваше сообщение" rows={4} className="border-border/60" />
              </div>
              
              <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                <input type="checkbox" className="mt-1" />
                <label>
                  Я соглашаюсь получать маркетинговые материалы и спецпредложения
                </label>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold">
                Отправить
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contacts;
