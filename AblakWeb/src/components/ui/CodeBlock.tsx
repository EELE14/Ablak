/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { codeToHtml } from "shiki/bundle/web";
import { cn } from "../../lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

let warmup: Promise<void> | null = null;

async function highlight(code: string, lang: string): Promise<string> {
  const html = await codeToHtml(code, {
    lang,
    theme: "tokyo-night",
  });

  return html.replace(
    /background-color:[^;"}]*/g,
    "background-color:transparent",
  );
}

export function CodeBlock({
  code,
  language = "typescript",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    const lang =
      language === "ts"
        ? "typescript"
        : language === "js"
          ? "javascript"
          : language;

    // Kick off wasm load on first mount
    if (!warmup) warmup = highlight(code, lang).then(() => undefined);

    highlight(code, lang).then((result) => {
      if (current) setHtml(result);
    });

    return () => {
      current = false;
    };
  }, [code, language]);

  function handleCopy() {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className={cn("relative rounded-2xl overflow-hidden", className)}
      style={{
        backdropFilter: "blur(16px)",
        background: "color-mix(in srgb, white 4%, transparent)",
        border: "1px solid color-mix(in srgb, white 12%, transparent)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 color-mix(in srgb, white 8%, transparent)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "color-mix(in srgb, white 4%, transparent)",
          borderBottom: "1px solid color-mix(in srgb, white 8%, transparent)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-zinc-500 font-mono">{language}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          {copied ? (
            <Check size={12} className="text-green-400" />
          ) : (
            <Copy size={12} />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code */}
      {html ? (
        <div
          className="text-sm [&_pre]:p-5 [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:leading-relaxed [&_code]:font-mono [&_code]:text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-5 overflow-x-auto text-sm leading-relaxed m-0">
          <code className="text-zinc-300 font-mono whitespace-pre">{code}</code>
        </pre>
      )}
    </div>
  );
}
