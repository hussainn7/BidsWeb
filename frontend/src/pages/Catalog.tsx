import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Catalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(true);
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message || "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  };

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

        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Товары не найдены</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer"
                >
                  <ProductCard
                    id={product.id}
                    title={product.name}
                    price={product.priceVisible ? `${Number(product.price).toLocaleString()} ₽` : "Цена скрыта"}
                    discount={`${Number(product.minPrice).toLocaleString()} ₽`}
                    username={product.partner?.fullName || "Партнер"}
                    participants={product.clickCount || 0}
                    timeLeft={0}
                  />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / 9)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
