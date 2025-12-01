"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { MCPServerCard } from "@/components/mcp-registry/mcp-server-card";
import { allMCPServers } from "@/lib/data/mcp-servers-data";
import {
  Search,
  Server,
  Plus,
  Bot,
  Wrench,
} from "lucide-react";

type FilterType = "all" | "agent" | "custom";

export default function MCPRegistryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  const filteredServers = allMCPServers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.selectedTools.some((t) =>
        t.toolName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = typeFilter === "all" || server.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const counts = {
    all: allMCPServers.length,
    agent: allMCPServers.filter((s) => s.type === "agent").length,
    custom: allMCPServers.filter((s) => s.type === "custom").length,
  };

  const filters: { type: FilterType; label: string; icon?: React.ReactNode }[] = [
    { type: "all", label: "All" },
    { type: "agent", label: "Agent", icon: <Bot className="h-3.5 w-3.5" /> },
    { type: "custom", label: "Custom", icon: <Wrench className="h-3.5 w-3.5" /> },
  ];

  return (
    <>
      <Header
        actionButton={
          <Link href="/mcp-registry/new">
            <Button className="bg-amber-600 hover:bg-amber-500 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Server
            </Button>
          </Link>
        }
      />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="space-y-6 min-w-0">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-stone-50">MCP Registry</h1>
            <p className="mt-1 text-sm text-stone-400">
              Custom MCP servers with tools from integrations and agents
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Search servers or tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-stone-700 bg-stone-900 py-2 pl-10 pr-4 text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-900/50 border border-stone-800">
              {filters.map((filter) => (
                <button
                  key={filter.type}
                  onClick={() => setTypeFilter(filter.type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    typeFilter === filter.type
                      ? "bg-stone-800 text-stone-100"
                      : "text-stone-400 hover:text-stone-300"
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                  <span className="text-stone-500 ml-1">{counts[filter.type]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Server Grid */}
          {filteredServers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServers.map((server) => (
                <MCPServerCard key={server.id} server={server} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Server className="h-10 w-10 text-stone-700 mx-auto mb-3" />
              <p className="text-sm text-stone-400">No servers found</p>
              <p className="text-xs text-stone-500 mt-1">
                {searchQuery ? "Try adjusting your search" : "Create your first MCP server"}
              </p>
              {!searchQuery && (
                <Link href="/mcp-registry/new">
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-500 text-white text-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Server
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
