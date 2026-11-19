import { useId, useState } from "react";
import { Search } from "lucide-react";

// ricerca con lista dei risultati
export default function SearchPicker({ label, placeholder, value, onChange, results, onPick, renderItem }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const open = results.length > 0;

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === "Enter") { e.preventDefault(); onPick(results[active]); setActive(0); }
    if (e.key === "Escape") onChange("");
  };

  return (
    <div className="relative max-w-xl">
      <label htmlFor={id} className="sr-only">{label}</label>
      <Search size={20} className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-subtle" />
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setActive(0); }}
        onKeyDown={onKeyDown}
        className="h-14 w-full rounded-full border border-line-strong bg-white/[0.03] pr-5 pl-13 text-base text-fg outline-none transition-[border-color,box-shadow] placeholder:text-subtle focus:border-accent/70 focus:ring-4 focus:ring-accent/15"
      />
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="glass absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl p-1.5"
        >
          {results.map((item, i) => (
            <li
              key={i}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); onPick(item); setActive(0); }}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${i === active ? "bg-white/[0.07]" : ""}`}
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
