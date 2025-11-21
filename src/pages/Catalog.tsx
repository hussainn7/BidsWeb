import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";

const mockProducts = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `КОЛЬЦО С ДРАГОЦЕННЫМ КАМНЕМ ${i + 1} КАРАТ 14К ЗОЛОТО`,
  price: "4 600 ₽",
  discount: `${2844 + i * 500} ₽`,
  username: ["ИВАНОВ", "ПЕТРОВ", "СИДОРОВ", "КОЗЛОВ", "ОРЛОВ", "ВОЛКОВ"][i],
  participants: 20 + i * 3,
  timeLeft: 3600 + i * 1200,
}));

const Catalog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* === TRAINING VIDEO BLOCK === */}
      <section className="w-full max-w-5xl mx-auto mt-6 mb-8 px-4">
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
          <p className="text-gray-500 text-lg text-center px-4">
            Тут будет обучающее видео по работе с платформой
          </p>
        </div>
      </section>

      <CategoryTabs />

      <main className="flex-1 container mx-auto px-4">
        <h1 className="text-2xl font-medium mb-6">Раздел</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
