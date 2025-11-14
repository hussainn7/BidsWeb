import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Вопрос",
    answer: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Большого заманивший, назад великий выйти безорфографичный свою составитель."
  },
  {
    question: "Вопрос",
    answer: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Большого заманивший, назад великий выйти безорфографичный свою составитель."
  },
  {
    question: "Вопрос",
    answer: "Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Большого заманивший, назад великий выйти безорфографичный свою составитель."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">ВОПРОСЫ И ОТВЕТЫ</h1>
        
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
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

export default FAQ;
