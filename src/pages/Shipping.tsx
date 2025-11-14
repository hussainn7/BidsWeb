import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const shippingSections = [
  {
    title: "ГОСУДАРСТВЕННЫЙ / ГАРАНТИРОВАННЫЙ ТОВАР",
    content: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты."
  },
  {
    title: "ПЛАТНАЯ ИНФОРМАЦИЯ",
    content: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты."
  },
  {
    title: "ПРЕМИАЛЬНЫЕ ЗАКАЗЫ",
    content: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты."
  },
];

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">ДОСТАВКА И ОПЛАТА</h1>
        
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {shippingSections.map((section, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
