"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { CustomMCPServer } from "@/lib/types";

interface ServerHeaderProps {
  server: CustomMCPServer;
}

export function ServerHeader({ server }: ServerHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(server.serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-100 mb-1">{server.name}</h1>
      <p className="text-sm text-stone-400 mb-3">{server.description}</p>

      <div className="flex items-center gap-2 mb-1">
        <code className="text-xs text-stone-300 font-mono bg-stone-800 px-2.5 py-1 rounded">
          {server.serverUrl}
        </code>
        <button
          onClick={copyUrl}
          className="text-stone-500 hover:text-stone-300 transition-colors"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <p className="text-xs text-stone-500">
        Created by {server.createdBy} on{" "}
        {new Date(server.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

