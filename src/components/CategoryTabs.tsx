import { useState } from "react";

const categories = [
  "Раздел 1",
  "Раздел 2",
  "Раздел 3",
  "Раздел 4",
  "Раздел 5",
  "Раздел 6",
  "Раздел 7",
];

const CategoryTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="border-b border-border mb-8">
      <div className="container mx-auto px-4">
        <div className="flex gap-8 overflow-x-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-4 px-2 text-sm whitespace-nowrap transition-colors ${
                activeTab === index
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
