import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border border-border/60 bg-white shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-8">ДОГОВОР ОФЕРТЫ</h1>
            
            <div className="space-y-6 text-sm leading-relaxed text-foreground">
              <p>
                Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. 
                Большого заманивший, назад великий выйти безорфографичный свою составитель, 
                родного снова переулка, города она дороге подзаголовок коварных повстречался большой вопрос.
              </p>
              
              <p>
                Своего использовало, собрал текстами текст дорогу рот злых над назад решила сих букв 
                путь продолжил, переписывается власти о своих встретил имени языком однажды образ 
                заголовок послушавшись там ему, предупредила одна свой маленькая необходимыми алфавит 
                диких реторический его знаках языкового всемогущая вопроса это пояс вдали пор текста.
              </p>

              <div className="pt-4 border-t border-border/60">
                <h2 className="text-xl font-semibold text-foreground mb-4">МЕЖДУНАРОДНАЯ ОТПРАВКА</h2>
                <p>
                  Мы стремимся к созданию лучших товаров. Сохранить качество ручной сборки и личного 
                  совершенства. Одновременно у нас есть особенности в процессе обучения и производства. 
                  Мы будем хорошо общаться и услышим ваши отзывы.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
