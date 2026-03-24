/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useState } from "react";
import { getViewportState } from "ablak";
import { LiveBadge } from "../ui/LiveBadge";
import { CodeBlock } from "../ui/CodeBlock";
import { API_FUNCTIONS, API_TYPES } from "../../data/apiReference";
import type { ViewportState } from "../../types/ablak";

function formatState(state: ViewportState): string {
  return JSON.stringify(
    {
      scroll: {
        top: state.scroll.top,
        left: state.scroll.left,
        velocity: state.scroll.velocity,
      },
      size: { x: state.size.x, y: state.size.y, docY: state.size.docY },
      mouse: {
        x: state.mouse.x,
        y: state.mouse.y,
        velocity: state.mouse.velocity,
      },
      orientation: state.orientation,
      devicePixelRatio: state.devicePixelRatio.ratio,
    },
    null,
    2,
  );
}

export function ApiReferenceSection() {
  const [stateJson, setStateJson] = useState(() =>
    formatState(getViewportState()),
  );
  const [activeTab, setActiveTab] = useState<"functions" | "types">(
    "functions",
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStateJson(formatState(getViewportState()));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="api" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            API <span className="text-gradient">Reference</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Full documentation with live state readout.
          </p>
        </div>

        <div className="mb-16 glass rounded-2xl overflow-hidden border border-zinc-700/50">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-700/50 bg-zinc-800/30">
            <LiveBadge />
            <span className="text-sm text-zinc-400">Live viewport state</span>
          </div>
          <pre className="p-5 text-sm text-zinc-300 font-mono overflow-x-auto leading-relaxed">
            {stateJson}
          </pre>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8">
          {(["functions", "types"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Functions */}
        {activeTab === "functions" && (
          <div className="space-y-8">
            {API_FUNCTIONS.map((fn) => (
              <div key={fn.name} className="glass rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100 font-mono">
                      {fn.name}
                    </h3>
                    <code className="text-sm text-indigo-300">
                      {fn.signature}
                    </code>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-4">{fn.description}</p>
                <CodeBlock code={fn.code} language="typescript" />
              </div>
            ))}
          </div>
        )}

        {/* Types */}
        {activeTab === "types" && (
          <div className="space-y-6">
            {API_TYPES.map((type) => (
              <div
                key={type.name}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-zinc-700/50 bg-zinc-800/20">
                  <h3 className="font-mono font-bold text-zinc-100">
                    interface{" "}
                    <span className="text-indigo-300">{type.name}</span>
                  </h3>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {type.fields.map((field) => (
                    <div
                      key={field.name}
                      className="px-6 py-3 grid grid-cols-3 gap-4 text-sm"
                    >
                      <code className="text-cyan-300 font-mono">
                        {field.name}
                      </code>
                      <code className="text-violet-300 font-mono">
                        {field.type}
                      </code>
                      <span className="text-zinc-400">{field.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
