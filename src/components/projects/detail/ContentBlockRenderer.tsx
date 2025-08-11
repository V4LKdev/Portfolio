import React from "react";
import ReactMarkdown from "react-markdown";
import { type Section } from "../../../content";
import CodeBlock from "../../ui/CodeBlock";

interface ContentBlockRendererProps {
  block: Section;
  suppressTitle?: boolean; // When true, don't render the block's title
}

// Markdown component overrides for theme consistency
const markdownComponents = {
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
};

/**
 * Renders a single ContentBlock based on its type.
 * Supports text (markdown), images, galleries, code blocks, videos, and spacers.
 */
const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ 
  block, 
  suppressTitle = false 
}) => {
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
            <ReactMarkdown components={markdownComponents}>
              {block.body}
            </ReactMarkdown>
          </div>
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

    case "gallery":
      return (
        <div className="space-y-4">
          {block.title && !suppressTitle && (
            <h3 className="text-xl font-semibold theme-heading">
              {block.title}
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {block.images.map((imageUrl) => {
              const altText = block.title ? `${block.title} visual` : "Project visual";
              return (
                <div
                  key={imageUrl}
                  className="aspect-video rounded-lg overflow-hidden bg-black/20 border border-white/10"
                >
                  <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      );

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
