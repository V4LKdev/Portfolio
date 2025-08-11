import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { type Section } from "../../../content";
import CodeBlock from "../../ui/CodeBlock";

interface ContentBlockRendererProps {
  block: Section;
  suppressTitle?: boolean; // When true, don't render the block's title
}

// Markdown component overrides for theme consistency
// Built via factory so we can inject an image click handler for lightbox
const getMarkdownComponents = (
  onImageClick?: (src: string, alt?: string) => void
) => ({
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold theme-heading mb-4" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-semibold theme-heading mb-3" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-medium theme-heading mb-2" {...props}>{children}</h3>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="theme-text mb-3" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="theme-text list-disc pl-6 mb-3 space-y-1" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="theme-text list-decimal pl-6 mb-3 space-y-1" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="theme-text" {...props}>{children}</li>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold theme-heading" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic theme-text" {...props}>{children}</em>
  ),
  img: ({ src, alt }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const source = src || "";
    const handleClick = () => {
      if (onImageClick && source) onImageClick(source, alt);
    };
    return (
      <button
        type="button"
        onClick={handleClick}
        className="block w-full md:w-4/5 lg:w-2/3 mx-auto cursor-zoom-in focus:outline-none"
        aria-label={alt ? `Open image: ${alt}` : "Open image"}
      >
        <img
          src={source}
          alt={alt}
          className="w-full h-auto rounded-lg border border-white/10 bg-black/20 shadow-sm"
          loading="lazy"
        />
      </button>
    );
  },
});

/**
 * Renders a single ContentBlock based on its type.
 * Supports text (markdown), images, galleries, code blocks, videos, and spacers.
 */
const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ 
  block, 
  suppressTitle = false 
}) => {
  // Shared lightbox state for single images inside markdown text/quote blocks
  const [mdImageOpen, setMdImageOpen] = React.useState(false);
  const [mdImageSrc, setMdImageSrc] = React.useState<string | null>(null);
  const [mdImageAlt, setMdImageAlt] = React.useState<string | undefined>(undefined);

  const openMdImage = (src: string, alt?: string) => {
    setMdImageSrc(src);
    setMdImageAlt(alt);
    setMdImageOpen(true);
  };
  const closeMdImage = () => setMdImageOpen(false);

  // Accessibility and UX parity with gallery: lock scroll and support ESC to close
  React.useEffect(() => {
    if (!mdImageOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMdImage();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mdImageOpen]);

  switch (block.type) {
    case "text":
    case "quote":
      return (
        <div className="space-y-4">
          {block.title && !suppressTitle && (
            <h3 className="text-xl font-semibold theme-heading">
              {block.title}
            </h3>
          )}
          <div className="prose prose-invert max-w-none theme-text">
            <ReactMarkdown components={getMarkdownComponents(openMdImage)}>
              {block.body}
            </ReactMarkdown>
          </div>

          {mdImageOpen && mdImageSrc && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeMdImage}
            >
              <button
                className="absolute top-4 right-4 p-2 rounded-md bg-white/10 border border-white/15 text-white/90 hover:bg-white/15"
                onClick={(e) => { e.stopPropagation(); closeMdImage(); }}
                aria-label="Close image"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={mdImageSrc}
                  alt={mdImageAlt || "Inline visual"}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg border border-white/10 shadow-xl"
                />
              </div>
            </div>
          )}
        </div>
      );

    case "code":
      return (
        <div className="space-y-4">
          <CodeBlock
            code={block.code}
            language={block.language}
            title={suppressTitle ? undefined : block.title}
            className="w-full"
          />
        </div>
      );

    case "gallery": {
      const [isOpen, setIsOpen] = React.useState(false);
      const [currentIndex, setCurrentIndex] = React.useState(0);

      const openAt = (idx: number) => {
        setCurrentIndex(idx);
        setIsOpen(true);
      };
      const close = () => setIsOpen(false);
      const prev = () => setCurrentIndex((i) => (i - 1 + block.images.length) % block.images.length);
      const next = () => setCurrentIndex((i) => (i + 1) % block.images.length);

      // Handle Escape and arrows, and lock scroll when open
      React.useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
          if (e.key === "Escape") close();
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
          document.body.style.overflow = prevOverflow;
          window.removeEventListener("keydown", onKey);
        };
      }, [isOpen]);

      return (
        <div className="space-y-4">
          {block.title && !suppressTitle && (
            <h3 className="text-xl font-semibold theme-heading">
              {block.title}
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.images.map((imageUrl, idx) => {
              const altText = block.title ? `${block.title} visual` : "Project visual";
              return (
                <button
                  key={imageUrl}
                  type="button"
                  onClick={() => openAt(idx)}
                  className="aspect-video rounded-lg overflow-hidden bg-black/20 border border-white/10 focus:outline-none group cursor-zoom-in"
                  aria-label="Open image"
                >
                  <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>

          {isOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={close}
            >
              {/* Close button (overlay-level) */}
              <button
                className="absolute top-4 right-4 p-2 rounded-md bg-white/10 border border-white/15 text-white/90 hover:bg-white/15"
                onClick={(e) => { e.stopPropagation(); close(); }}
                aria-label="Close image"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev/Next (overlay-level, outside image bounds) */}
              {block.images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/10 border border-white/15 text-white/90 hover:bg-white/15"
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    aria-label="Previous image"
                    type="button"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/10 border border-white/15 text-white/90 hover:bg-white/15"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    aria-label="Next image"
                    type="button"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Content container prevents backdrop click from closing */}
              <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={block.images[currentIndex]}
                  alt={(block.title ? `${block.title} visual` : "Project visual") + ` ${currentIndex + 1}`}
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg border border-white/10 shadow-xl"
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    case "video":
  // ...existing code...
      
      {
        // Support both YouTube ID and direct URL
        const trimmedYouTubeId = block.youtubeId?.trim();
        const trimmedUrl = block.url?.trim();

        if (!trimmedYouTubeId && !trimmedUrl) {
          return (
            <div className="w-full h-full flex items-center justify-center theme-text-muted">
              <p>No video source provided</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {block.title && !suppressTitle && (
              <h3 className="text-xl font-semibold theme-heading">
                {block.title}
              </h3>
            )}
            <div className="aspect-video rounded-lg overflow-hidden bg-black/20 border border-white/10">
              {trimmedYouTubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trimmedYouTubeId}`}
                  title={block.title || "Project Video"}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <iframe
                  src={trimmedUrl}
                  title={block.title || "Project Video"}
                  className="w-full h-full"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        );
      }

    case "spacer":
      return (
        <div
          className="w-full"
          style={{
            minHeight: block.minHeight || "2rem"
          }}
        />
      );

    default:
      console.warn(`[ContentBlockRenderer] Unknown block type:`, (block as Section).type);
      return (
        <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10 theme-text">
          <p className="text-red-400">
            Unknown content block type: {(block as Section).type}
          </p>
        </div>
      );
  }
};

export default ContentBlockRenderer;
