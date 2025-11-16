import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus, Minus } from "lucide-react";

const questions = [
  {
    id: 1,
    column: "left",
    text: "Вопрос",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat, augue a volutpat hendrerit, sapien tortor faucibus augue, a maximus elit ex vitae libero. Sed quis mauris eget arcu facilisis consequat sed eu felis.",
  },
  { id: 2, column: "left", text: "Вопрос" },
  { id: 3, column: "right", text: "Вопрос" },
  { id: 4, column: "right", text: "Вопрос" },
  { id: 5, column: "right", text: "Вопрос" },
];

const FAQ = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">ВОПРОСЫ И ОТВЕТЫ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr] gap-6">
          {/* Left column */}
          <div className="space-y-4">
            {questions
              .filter((q) => q.column === "left")
              .map((q) => {
                const isOpen = openId === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggle(q.id)}
                    className={
                      "w-full text-left bg-gray-200 rounded-lg px-8 " +
                      (isOpen ? "py-6 flex flex-col gap-4" : "py-4 flex items-center justify-between")
                    }
                  >
                    <div className={isOpen ? "flex items-center justify-between" : "flex-1"}>
                      <div className="text-base font-medium">{q.text}</div>
                      {isOpen ? null : (
                        <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center">
                          <Plus className="w-4 h-4 text-gray-700" />
                        </div>
                      )}
                    </div>

                    {isOpen && (
                      <>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                          {q.answer}
                        </p>
                        <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center self-end">
                          <Minus className="w-4 h-4 text-gray-700" />
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {questions
              .filter((q) => q.column === "right")
              .map((q) => {
                const isOpen = openId === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => toggle(q.id)}
                    className="w-full bg-gray-200 rounded-lg px-8 py-4 flex items-center justify-between text-left"
                  >
                    <div className="text-base font-medium">{q.text}</div>
                    <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-gray-700" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-700" />
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
