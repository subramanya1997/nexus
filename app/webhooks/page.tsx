"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockWebhooks } from "@/lib/data/webhooks-data";
import { mockAgents } from "@/lib/data/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import {
  Plus,
  Search,
  Copy,
  Check,
  Webhook,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleDot,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function WebhooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter webhooks
  const filteredWebhooks = mockWebhooks.filter((webhook) => {
    const matchesSearch =
      webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.targetAgentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || webhook.status === statusFilter;
    const matchesAgent = agentFilter === "all" || webhook.targetAgentId === agentFilter;
    return matchesSearch && matchesStatus && matchesAgent;
  });

  // Pagination
  const totalPages = Math.ceil(filteredWebhooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedWebhooks = filteredWebhooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get unique agents for filter
  const uniqueAgents = Array.from(
    new Set(mockWebhooks.map((w) => JSON.stringify({ id: w.targetAgentId, name: w.targetAgentName })))
  ).map((s) => JSON.parse(s));

  // Status counts
  const statusCounts = {
    all: mockWebhooks.length,
    active: mockWebhooks.filter((w) => w.status === "active").length,
    inactive: mockWebhooks.filter((w) => w.status === "inactive").length,
  };

  const statusFilters: { value: string; label: string; icon?: React.ReactNode }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active", icon: <CircleDot className="h-3.5 w-3.5" /> },
    { value: "inactive", label: "Inactive", icon: <Circle className="h-3.5 w-3.5" /> },
  ];

  return (
    <>
      <Header
        actionButton={
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-stone-900 border-stone-800 sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-stone-100">Create Webhook</DialogTitle>
                <DialogDescription className="text-stone-400">
                  Create a new webhook endpoint to trigger agents from external services.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-stone-200">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Salesforce Lead Created"
                    className="bg-stone-800 border-stone-700 text-stone-200 placeholder:text-stone-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-stone-200">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Describe what triggers this webhook"
                    className="bg-stone-800 border-stone-700 text-stone-200 placeholder:text-stone-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agent" className="text-stone-200">
                    Target Agent
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-800 border-stone-700">
                      {mockAgents.map((agent) => (
                        <SelectItem
                          key={agent.id}
                          value={agent.id}
                          className="text-stone-200 focus:bg-stone-700"
                        >
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="auth" className="text-stone-200">
                    Authentication
                  </Label>
                  <Select defaultValue="hmac">
                    <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-stone-800 border-stone-700">
                      <SelectItem value="none" className="text-stone-200 focus:bg-stone-700">
                        None
                      </SelectItem>
                      <SelectItem value="hmac" className="text-stone-200 focus:bg-stone-700">
                        HMAC Signature
                      </SelectItem>
                      <SelectItem value="bearer" className="text-stone-200 focus:bg-stone-700">
                        Bearer Token
                      </SelectItem>
                      <SelectItem value="basic" className="text-stone-200 focus:bg-stone-700">
                        Basic Auth
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-stone-700 text-stone-300"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Create Webhook
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="space-y-6 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-50">Webhooks</h1>
              <p className="mt-1 text-sm text-stone-400">
                Trigger agents from external services via HTTP endpoints
              </p>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <input
                type="text"
                placeholder="Search webhooks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-stone-700 bg-stone-900 py-2 pl-10 pr-4 text-sm text-stone-200 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-stone-900/50 border border-stone-800">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === filter.value
                      ? "bg-stone-800 text-stone-100"
                      : "text-stone-400 hover:text-stone-300"
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                  <span className="text-stone-500 ml-1">{statusCounts[filter.value as keyof typeof statusCounts]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Webhooks Table */}
          <Card className="bg-stone-900 border-stone-800">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-800">
                  <thead className="bg-stone-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                        Webhook
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                        Target Agent
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-stone-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-stone-400 uppercase tracking-wider">
                        Deliveries
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-stone-400 uppercase tracking-wider">
                        Success
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                        Last Triggered
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-stone-400 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {paginatedWebhooks.map((webhook) => (
                      <tr key={webhook.id} className="hover:bg-stone-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <Link
                              href={`/webhooks/${webhook.id}`}
                              className="h-9 w-9 rounded-lg bg-purple-950 flex items-center justify-center shrink-0 mt-0.5"
                            >
                              <Webhook className="h-4 w-4 text-purple-400" />
                            </Link>
                            <div className="min-w-0">
                              <Link
                                href={`/webhooks/${webhook.id}`}
                                className="text-sm font-medium text-stone-100 hover:text-amber-500 transition-colors block"
                              >
                                {webhook.name}
                              </Link>
                              <p className="text-xs text-stone-500 mt-0.5 truncate max-w-[280px]">
                                {webhook.description}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <code className="text-xs text-stone-400 font-mono bg-stone-800 px-2 py-0.5 rounded truncate max-w-[200px]">
                                  {webhook.url}
                                </code>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard(webhook.id, webhook.url);
                                  }}
                                  className="text-stone-500 hover:text-stone-300 transition-colors shrink-0"
                                >
                                  {copiedId === webhook.id ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/agents/${webhook.targetAgentId}`}
                            className="text-sm text-stone-300 hover:text-amber-500 transition-colors flex items-center gap-1"
                          >
                            {webhook.targetAgentName}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Badge
                            variant="outline"
                            className={
                              webhook.status === "active"
                                ? "bg-green-950 text-green-400 border-green-800"
                                : "bg-stone-800 text-stone-400 border-stone-700"
                            }
                          >
                            {webhook.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-stone-200">
                            {webhook.totalDeliveries.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`text-sm font-medium ${
                              webhook.successRate >= 98
                                ? "text-green-400"
                                : webhook.successRate >= 95
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}
                          >
                            {webhook.successRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-stone-400" suppressHydrationWarning>
                            {webhook.lastTriggered
                              ? formatRelativeTime(webhook.lastTriggered)
                              : "Never"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-stone-400 hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800">
                  <div className="text-sm text-stone-400">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredWebhooks.length)} of{" "}
                    {filteredWebhooks.length} webhooks
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-stone-700 text-stone-300 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? "bg-amber-600 hover:bg-amber-500 text-white"
                              : "text-stone-400 hover:text-stone-200"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="border-stone-700 text-stone-300 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {paginatedWebhooks.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <Webhook className="h-12 w-12 text-stone-600 mx-auto mb-4" />
                  <p className="text-stone-400">No webhooks found matching your criteria.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-stone-700 text-stone-300"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setAgentFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  );
}

