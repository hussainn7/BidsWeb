import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Раздел",
    items: ["Подраздел 1", "Подраздел 2", "Подраздел 3", "Подраздел 4", "Подраздел 5"],
  },
  {
    title: "Раздел",
    items: ["Подраздел 1", "Подраздел 2", "Подраздел 3", "Подраздел 4", "Подраздел 5"],
  },
  {
    title: "Раздел",
    items: ["Подраздел 1", "Подраздел 2", "Подраздел 3", "Подраздел 4", "Подраздел 5"],
  },
  {
    title: "Раздел",
    items: ["Подраздел 1", "Подраздел 2", "Подраздел 3", "Подраздел 4", "Подраздел 5"],
  },
];

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

const MegaMenu = ({ open, onClose }: MegaMenuProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={panelRef}
      className={
        "absolute left-0 right-0 top-full z-40 bg-popover border border-border shadow-md" +
        (open ? " block" : " hidden")
      }
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((col, idx) => (
            <div key={idx}>
              <div className="text-sm mb-3 text-foreground">{col.title}</div>
              <ul className="space-y-2">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
