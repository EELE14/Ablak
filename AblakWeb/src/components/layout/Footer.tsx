/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { Layers } from "lucide-react";

interface FooterProps {
  onShowFull?: () => void;
}

export function Footer({ onShowFull }: FooterProps) {
  return (
    <footer className="border-t border-zinc-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gradient">ablak</span>
          <span>— viewport tracker for the browser</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://www.npmjs.com/package/ablak-ts"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            npm
          </a>
          <a
            href="https://github.com/eele14/ablak"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
          <span className="text-zinc-600">AGPL-3.0</span>
        </div>
        <a
          className="text-zinc-600 hover:text-zinc-300 transition-colors"
          href="https://eele14.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          © 2026 eele14
        </a>
      </div>

      {onShowFull && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onShowFull}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-indigo-500/50 hover:text-indigo-300 transition-colors"
          >
            <Layers size={14} />
            Show full interactive demos
          </button>
        </div>
      )}
    </footer>
  );
}
