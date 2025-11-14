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
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">
          {/* Contact Info */}
          <div>
            <h1 className="text-2xl font-medium mb-8">КОНТАКТЫ</h1>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+7-999-999-99-99</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@mail.com</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-medium mb-6">ОСТАВЬТЕ ЗАЯВКУ</h2>
            <p className="text-sm text-muted-foreground mb-6">
              И мы свяжемся с вами в ближайшее время
            </p>
            
            <form className="space-y-4">
              <Input placeholder="Имя" />
              <Input type="tel" placeholder="Телефон" />
              <Textarea placeholder="Сообщение" rows={4} />
              
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" className="mt-1" />
                <label>
                  Я соглашаюсь получать маркетинговые материалы и спецпредложения
                </label>
              </div>
              
              <Button className="w-full">
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
