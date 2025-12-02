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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8 mb-6">
            <h1 className="text-3xl font-bold mb-8">ВОПРОСЫ И ОТВЕТЫ</h1>

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
                          "w-full text-left rounded-lg border border-border/60 transition-all duration-200 " +
                          (isOpen 
                            ? "bg-white p-6 flex flex-col gap-4 shadow-sm" 
                            : "bg-slate-50/50 p-4 flex items-center justify-between hover:bg-white hover:shadow-sm"
                          )
                        }
                      >
                        <div className={isOpen ? "flex items-center justify-between" : "flex-1"}>
                          <div className="text-sm font-semibold text-foreground">{q.text}</div>
                          {isOpen ? null : (
                            <div className="w-8 h-8 rounded-full border border-border/60 bg-white flex items-center justify-center">
                              <Plus className="w-4 h-4 text-foreground" />
                            </div>
                          )}
                        </div>

                        {isOpen && (
                          <>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {q.answer}
                            </p>
                            <div className="w-8 h-8 rounded-full border border-border/60 bg-slate-50 flex items-center justify-center self-end">
                              <Minus className="w-4 h-4 text-foreground" />
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
                        className={
                          "w-full rounded-lg border border-border/60 p-4 flex items-center justify-between text-left transition-all duration-200 " +
                          (isOpen 
                            ? "bg-white shadow-sm" 
                            : "bg-slate-50/50 hover:bg-white hover:shadow-sm"
                          )
                        }
                      >
                        <div className="text-sm font-semibold text-foreground">{q.text}</div>
                        <div className="w-8 h-8 rounded-full border border-border/60 bg-white flex items-center justify-center">
                          {isOpen ? (
                            <Minus className="w-4 h-4 text-foreground" />
                          ) : (
                            <Plus className="w-4 h-4 text-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
