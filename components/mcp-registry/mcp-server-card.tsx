"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIntegrationIcon } from "@/lib/integration-icons";
import type { CustomMCPServer } from "@/lib/types";
import { Bot, Copy, Check } from "lucide-react";
import { MCPIcon } from "./mcp-icon";

interface MCPServerCardProps {
  server: CustomMCPServer;
}

export function MCPServerCard({ server }: MCPServerCardProps) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(server.serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/mcp-registry/${server.id}`}>
      <Card className="bg-stone-900/50 border-stone-800 hover:border-stone-700 transition-colors h-full">
        <CardContent className="px-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  server.type === "agent" ? "bg-amber-500/10" : "bg-blue-500/10"
                }`}
              >
                {server.type === "agent" ? (
                  <Bot className="h-4 w-4 text-amber-500" />
                ) : (
                  <MCPIcon className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-100 truncate">
                  {server.name}
                </p>
                <p className="text-xs text-stone-500">
                  {server.selectedTools.length} tools · {server.stats.totalCalls.toLocaleString()} calls
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-[10px] shrink-0 ${
                server.type === "agent"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-500 border-blue-500/20"
              }`}
            >
              {server.type}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-400 mb-2 line-clamp-1">{server.description}</p>

          {/* Tools Preview */}
          <div className="flex flex-wrap gap-1 mb-2">
            {server.selectedTools.slice(0, 2).map((tool, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-800/50 border border-stone-700/50"
              >
                {tool.sourceType === "integration" ? (
                  <Image
                    src={getIntegrationIcon(tool.sourceId)}
                    alt={tool.sourceName}
                    width={12}
                    height={12}
                    className="rounded"
                  />
                ) : (
                  <Bot className="h-3 w-3 text-amber-500" />
                )}
                <span className="text-[11px] text-stone-400">{tool.toolName}</span>
              </div>
            ))}
            {server.selectedTools.length > 2 && (
              <div className="flex items-center px-1.5 py-0.5 rounded-md bg-stone-800/50 border border-stone-700/50">
                <span className="text-[11px] text-stone-500">+{server.selectedTools.length - 2}</span>
              </div>
            )}
          </div>

          {/* URL */}
          <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
            <code className="flex-1 text-[11px] text-stone-500 font-mono bg-stone-800/50 px-2 py-1 rounded truncate">
              {server.serverUrl}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-stone-500 hover:text-stone-300 shrink-0"
              onClick={(e) => {
                e.preventDefault();
                copyUrl();
              }}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-stone-800/50 text-xs text-stone-500">
            <span>{server.stats.successRate}% success</span>
            <span>{server.stats.avgLatency}ms avg</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
