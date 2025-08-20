import React, { useEffect, useRef } from "react";

interface FilterPopupProps {
  tags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  onClose: () => void;
  accent?: string;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ tags, selectedTags, setSelectedTags, onClose, accent }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Try to get accent color from parent section (fallback to blue)
  accent = accent || '#3b82f6';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute left-0 mt-2 w-48 rounded-xl bg-zinc-900/95 border border-white/15 shadow-xl z-30 p-3 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-white/60">Filter by Tag</div>
        {selectedTags.length > 0 && (
          <button
            type="button"
            aria-label="Clear tag filters"
            className="text-white/60 hover:text-white text-xs px-1 rounded transition-colors"
            style={{ lineHeight: 1, fontSize: '1.1em' }}
            onClick={() => setSelectedTags([])}
          >
            ×
          </button>
        )}
      </div>
      {tags.map(tag => (
        <label key={tag} className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
          <input
            type="checkbox"
            className="custom-checkbox-accent"
            checked={selectedTags.includes(tag)}
            style={{ ['--accent' as unknown as string]: accent }}
            onChange={e => {
              if (e.target.checked) {
                setSelectedTags([...selectedTags, tag]);
              } else {
                setSelectedTags(selectedTags.filter(x => x !== tag));
              }
            }}
          />
          {tag}
        </label>
      ))}
    </div>
  );
};

export default FilterPopup;
