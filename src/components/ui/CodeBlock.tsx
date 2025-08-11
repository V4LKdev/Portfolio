import React from "react";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark-dimmed.css";

hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("tsx", typescript);
hljs.registerLanguage("js", javascript);

export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "", className, title }) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const codeClass = "hljs" + (language ? " language-" + language : "");

  React.useEffect(() => {
    if (ref.current) {
      try {
        hljs.highlightElement(ref.current);
      } catch {}
    }
  }, [code, language]);

  return (
    <div className={`rounded-md overflow-hidden bg-black/50 border border-white/10 ${className ?? ""}`}>
      {title && (
        <div className="px-4 py-2 border-b border-white/10 bg-black/40 text-sm font-semibold text-white/90">
          {title}
        </div>
      )}
      <pre className="m-0 overflow-x-auto">
        <code ref={ref as any} className={codeClass}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
