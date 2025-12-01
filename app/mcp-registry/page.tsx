"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import {
  Search,
  Server,
  ExternalLink,
  Copy,
  Check,
  Activity,
  Clock,
  Users,
  Zap,
  Bot,
  Globe,
  Shield,
} from "lucide-react";

// Mock MCP servers data
const mcpServers = [
  {
    id: "mcp-1",
    agentId: "agent-1",
    agentName: "Lead Enrichment Agent",
    toolName: "lead_enrichment_agent",
    description: "Enriches leads with company information from Clearbit",
    serverUrl: "https://mcp.nexus.dev/servers/agent-1",
    enabled: true,
    totalCalls: 1234,
    successRate: 98.5,
    avgLatency: 245,
    uniqueClients: 8,
    lastCalledAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    authRequired: true,
    authType: "api_key",
  },
  {
    id: "mcp-2",
    agentId: "agent-2",
    agentName: "Customer Support Ticket Router",
    toolName: "ticket_router",
    description: "Routes support tickets to appropriate teams",
    serverUrl: "https://mcp.nexus.dev/servers/agent-2",
    enabled: true,
    totalCalls: 3456,
    successRate: 99.2,
    avgLatency: 156,
    uniqueClients: 12,
    lastCalledAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    authRequired: true,
    authType: "api_key",
  },
  {
    id: "mcp-3",
    agentId: "agent-4",
    agentName: "Code Review Assistant",
    toolName: "code_review_assistant",
    description: "Reviews code and provides feedback",
    serverUrl: "https://mcp.nexus.dev/servers/agent-4",
    enabled: true,
    totalCalls: 892,
    successRate: 97.8,
    avgLatency: 1234,
    uniqueClients: 5,
    lastCalledAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    authRequired: true,
    authType: "oauth2",
  },
  {
    id: "mcp-4",
    agentId: "agent-6",
    agentName: "Meeting Notes Summarizer",
    toolName: "meeting_summarizer",
    description: "Summarizes meeting recordings into notes",
    serverUrl: "https://mcp.nexus.dev/servers/agent-6",
    enabled: false,
    totalCalls: 567,
    successRate: 96.3,
    avgLatency: 3456,
    uniqueClients: 3,
    lastCalledAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    authRequired: false,
    authType: "none",
  },
];

const discoveryEndpoint = "https://mcp.nexus.dev/.well-known/mcp-servers";

export default function MCPRegistryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDiscovery, setCopiedDiscovery] = useState(false);

  const filteredServers = mcpServers.filter(
    (server) =>
      server.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enabledServers = mcpServers.filter((s) => s.enabled);
  const totalCalls = mcpServers.reduce((sum, s) => sum + s.totalCalls, 0);
  const totalClients = new Set(mcpServers.flatMap((s) => Array(s.uniqueClients).fill(s.id))).size;

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyDiscoveryUrl = () => {
    navigator.clipboard.writeText(discoveryEndpoint);
    setCopiedDiscovery(true);
    setTimeout(() => setCopiedDiscovery(false), 2000);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="space-y-6 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-50">MCP Registry</h1>
              <p className="mt-1 text-sm text-stone-400">
                Agents exposed as MCP-compatible tool servers
              </p>
            </div>
          </div>

          {/* Discovery Endpoint Card */}
          <Card className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 border-purple-800/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-900 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-200">MCP Discovery Endpoint</p>
                    <p className="text-xs text-purple-300/70 mt-0.5">
                      Use this URL to discover all available MCP servers
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-purple-200 font-mono bg-purple-900/50 px-3 py-1.5 rounded-lg">
                    {discoveryEndpoint}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-purple-700 text-purple-300 hover:bg-purple-900"
                    onClick={copyDiscoveryUrl}
                  >
                    {copiedDiscovery ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-stone-900 border-stone-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400">Active Servers</p>
                    <p className="mt-1 text-2xl font-bold text-stone-50">{enabledServers.length}</p>
                  </div>
                  <Server className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-stone-900 border-stone-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400">Total Calls</p>
                    <p className="mt-1 text-2xl font-bold text-stone-50">
                      {totalCalls.toLocaleString()}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-stone-900 border-stone-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400">Unique Clients</p>
                    <p className="mt-1 text-2xl font-bold text-stone-50">{totalClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-stone-900 border-stone-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-stone-400">Avg Latency</p>
                    <p className="mt-1 text-2xl font-bold text-stone-50">
                      {Math.round(
                        mcpServers.reduce((sum, s) => sum + s.avgLatency, 0) / mcpServers.length
                      )}
                      ms
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search MCP servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-900 py-2 pl-10 pr-4 text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* MCP Servers Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredServers.map((server) => (
              <Card
                key={server.id}
                className={`bg-stone-900 border-stone-800 ${
                  !server.enabled ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-950 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/agents/${server.agentId}`}
                            className="text-sm font-medium text-stone-100 hover:text-amber-500 transition-colors"
                          >
                            {server.agentName}
                          </Link>
                          <Badge
                            variant="outline"
                            className={
                              server.enabled
                                ? "bg-green-950 text-green-400 border-green-800 text-xs"
                                : "bg-stone-800 text-stone-500 border-stone-700 text-xs"
                            }
                          >
                            {server.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <code className="text-xs text-stone-500 font-mono">{server.toolName}</code>
                      </div>
                    </div>
                    {server.authRequired && (
                      <Badge
                        variant="outline"
                        className="bg-blue-950 text-blue-400 border-blue-800 text-xs"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {server.authType}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-stone-400 mb-4">{server.description}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <code className="flex-1 text-xs text-stone-400 font-mono bg-stone-800 px-2 py-1.5 rounded truncate">
                      {server.serverUrl}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-stone-400 hover:text-stone-200 shrink-0"
                      onClick={() => copyToClipboard(server.id, server.serverUrl)}
                    >
                      {copiedId === server.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-stone-800">
                    <div>
                      <p className="text-xs text-stone-500">Calls</p>
                      <p className="text-sm font-medium text-stone-200">
                        {server.totalCalls.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Success</p>
                      <p className="text-sm font-medium text-green-400">{server.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Latency</p>
                      <p className="text-sm font-medium text-stone-200">{server.avgLatency}ms</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Clients</p>
                      <p className="text-sm font-medium text-stone-200">{server.uniqueClients}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-800">
                    <span className="text-xs text-stone-500" suppressHydrationWarning>
                      Last called {formatRelativeTime(server.lastCalledAt)}
                    </span>
                    <Link
                      href={`/agents/${server.agentId}`}
                      className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1"
                    >
                      Configure
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <Server className="h-12 w-12 text-stone-600 mx-auto mb-4" />
              <p className="text-stone-400">No MCP servers found</p>
              <p className="text-sm text-stone-500 mt-1">
                Enable MCP server exposure on your agents to see them here
              </p>
            </div>
          )}

          {/* Info Card */}
          <Card className="bg-blue-950/30 border-blue-800/50">
            <CardContent className="p-4 flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-200">About MCP Servers</p>
                <p className="text-xs text-blue-300/70 mt-1">
                  MCP (Model Context Protocol) servers expose your agents as discoverable tools that
                  can be invoked by external AI systems, IDEs, and applications. Each server
                  provides a standardized interface for tool discovery and invocation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

