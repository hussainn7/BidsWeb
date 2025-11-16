import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Раздел",
    items: ["Подраздел", "Подраздел", "Подраздел", "Подраздел", "Подраздел"],
  },
  {
    title: "Раздел",
    items: ["Подраздел", "Подраздел", "Подраздел", "Подраздел", "Подраздел"],
  },
  {
    title: "Раздел",
    items: ["Подраздел", "Подраздел", "Подраздел", "Подраздел", "Подраздел"],
  },
];

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

const MegaMenu = ({ open, onClose }: MegaMenuProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute left-1/2 top-full mt-1 z-40 w-[640px] -translate-x-1/2 bg-white border border-border shadow-md"
      onMouseEnter={() => {}} // Keep menu open when hovering over it
      onMouseLeave={onClose}
    >
      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-8">
          {columns.map((col, idx) => (
            <div
              key={idx}
              className={idx !== columns.length - 1 ? "pr-8 border-r border-border" : "pl-2"}
            >
              <div className="text-sm mb-3 text-foreground">{col.title}</div>
              <ul className="space-y-2">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
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
