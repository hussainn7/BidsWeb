import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const mockData = [
    { article: "000000", name: "Товар", date: "01.01.2000", category: "Категория", price: "0.00", status: "Создание заказа" },
    { article: "000000", name: "Товар", date: "01.01.2000", category: "Категория", price: "0.00", status: "Подтверждено заказ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-2xl font-medium mb-8">Админ панель</h1>
        
        <div className="bg-background p-6 border border-border">
          <div className="mb-6">
            <Input placeholder="Поиск..." className="max-w-md" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium">Артикул</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Товар</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Дата</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Категория</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Цена</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Статус</th>
                  <th className="text-left py-3 px-4 text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 text-sm">{item.article}</td>
                    <td className="py-3 px-4 text-sm">{item.name}</td>
                    <td className="py-3 px-4 text-sm">{item.date}</td>
                    <td className="py-3 px-4 text-sm">{item.category}</td>
                    <td className="py-3 px-4 text-sm">{item.price}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="bg-secondary px-3 py-1 text-xs">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="secondary" size="sm">
                        Изменить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            Показано 1-2 из 2 результатов
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
