import { useState } from "react";

const CategoryTabs = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("Раздел 1");

  const categories = [
    "Раздел 1",
    "Раздел 2",
    "Раздел 3",
    "Раздел 4",
    "Раздел 5",
    "Раздел 6",
    "Раздел 7",
  ];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="border-t border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-center gap-0 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`
                  relative px-6 py-3.5 text-sm font-bold uppercase tracking-wide
                  whitespace-nowrap transition-all duration-200
                  border-r border-border last:border-r-0
                  ${isActive
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground hover:bg-muted/30"
                  }
                `}
              >
                {category}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CategoryTabs;
