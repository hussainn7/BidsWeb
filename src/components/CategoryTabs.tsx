const CategoryTabs = () => {
  return (
    <div className="mt-4 border-t border-b border-border mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12 text-sm">
          <nav className="flex w-full items-center justify-between text-muted-foreground">
            <button className="hover:text-foreground transition-colors">
              Раздел 1
            </button>
            <button className="hover:text-foreground transition-colors">
              Раздел 2
            </button>
            <button className="hover:text-foreground transition-colors">
              Раздел 3
            </button>
            <button className="hover:text-foreground transition-colors">
              Раздел 4
            </button>
            <button className="hover:text-foreground transition-colors">
              Раздел 5
            </button>
            <button className="hover:text-foreground transition-colors">
              Раздел 6
            </button>
            <button className="px-6 py-1 text-sm rounded bg-muted text-foreground border border-border hover:bg-muted/80 transition-colors">
              Раздел 7
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
