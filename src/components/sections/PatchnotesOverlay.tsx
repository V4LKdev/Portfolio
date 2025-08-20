import React, { useEffect } from "react";
import patchnotes from "../../content/patchnotes";
import { X } from "lucide-react";

interface Props {
  onClose?: () => void;
}

const PatchnotesOverlay: React.FC<Props> = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    // prevent background scroll while overlay open
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 pointer-events-auto"
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] theme-card-static rounded-2xl p-8 bg-zinc-900/95 border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="game-title text-3xl text-white">News</h2>
          <button
            aria-label="Close news"
            onClick={() => onClose?.()}
            className="p-2 rounded theme-btn"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[68vh] pr-3">
          {patchnotes.map((p, idx) => (
            <div key={p.id}>
              <article className="p-4 bg-white/2 rounded-lg">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold text-xl text-white">{p.title}</h3>
                  <time className="text-sm opacity-70 text-white/70">{p.date}</time>
                </div>
                <div className="mt-2 text-base leading-relaxed text-white/80 whitespace-pre-wrap">{p.body}</div>
              </article>
              {idx < patchnotes.length - 1 && (
                <div className="border-t border-white/10 my-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatchnotesOverlay;
