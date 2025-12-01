"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { mockTriggers, parseCronExpression } from "@/lib/data/triggers-data";
import { formatRelativeTime } from "@/lib/utils";
import type { AgentTrigger, ScheduledTriggerConfig, WebhookTriggerConfig, ApiTriggerConfig } from "@/lib/types";
import {
  Zap,
  ExternalLink,
  Clock,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface TriggersTabProps {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
}

const ITEMS_PER_PAGE = 10;

export function TriggersTab({ searchQuery, typeFilter, statusFilter }: TriggersTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter triggers
  const filteredTriggers = mockTriggers.filter((trigger) => {
    const matchesSearch =
      trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trigger.agentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || trigger.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && trigger.enabled) ||
      (statusFilter === "inactive" && !trigger.enabled);
    return matchesSearch && matchesType && matchesStatus;
  });

  // Group by type for summary
  const triggersByType = {
    webhook: mockTriggers.filter((t) => t.type === "webhook"),
    scheduled: mockTriggers.filter((t) => t.type === "scheduled"),
    api: mockTriggers.filter((t) => t.type === "api"),
  };

  // Pagination
  const totalPages = Math.ceil(filteredTriggers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTriggers = filteredTriggers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getTriggerDescription = (trigger: AgentTrigger) => {
    switch (trigger.type) {
      case "webhook":
        return (trigger.config as WebhookTriggerConfig).webhookUrl;
      case "scheduled": {
        const config = trigger.config as ScheduledTriggerConfig;
        return `${parseCronExpression(config.cronExpression)} (${config.timezone})`;
      }
      case "api": {
        const config = trigger.config as ApiTriggerConfig;
        return `${config.method} ${config.endpoint}`;
      }
      default:
        return "";
    }
  };

  const getNextRun = (trigger: AgentTrigger) => {
    if (trigger.type === "scheduled") {
      const config = trigger.config as ScheduledTriggerConfig;
      if (config.nextRunAt) {
        return formatRelativeTime(config.nextRunAt);
      }
    }
    return null;
  };

  const totalTriggers = mockTriggers.length;
  const activeTriggers = mockTriggers.filter((t) => t.enabled).length;
  const totalRuns = mockTriggers.reduce((sum, t) => sum + t.triggerCount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Triggers"
          value={totalTriggers.toString()}
          change={`${activeTriggers} active`}
          changeType="neutral"
        />
        <StatsCard
          title="Webhooks"
          value={triggersByType.webhook.length.toString()}
          change={`${triggersByType.webhook.filter((t) => t.enabled).length} active`}
          changeType="neutral"
        />
        <StatsCard
          title="Scheduled"
          value={triggersByType.scheduled.length.toString()}
          change={`${triggersByType.scheduled.filter((t) => t.enabled).length} active`}
          changeType="neutral"
        />
        <StatsCard
          title="Total Runs"
          value={totalRuns.toLocaleString()}
          change="All time"
          changeType="neutral"
        />
      </div>

      {/* Triggers Table */}
      <Card className="bg-stone-900 border-stone-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-800">
              <thead className="bg-stone-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Trigger
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Runs
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                    Last / Next
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {paginatedTriggers.map((trigger) => (
                  <tr key={trigger.id} className="hover:bg-stone-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-medium text-stone-100">
                          {trigger.name}
                        </span>
                        <p className="text-xs text-stone-500 mt-0.5 max-w-xs truncate font-mono">
                          {getTriggerDescription(trigger)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          trigger.type === "webhook"
                            ? "bg-purple-950 text-purple-400 border-purple-800"
                            : trigger.type === "scheduled"
                            ? "bg-blue-950 text-blue-400 border-blue-800"
                            : trigger.type === "api"
                            ? "bg-green-950 text-green-400 border-green-800"
                            : "bg-amber-950 text-amber-400 border-amber-800"
                        }`}
                      >
                        {trigger.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/agents/${trigger.agentId}`}
                        className="text-sm text-stone-300 hover:text-amber-500 transition-colors flex items-center gap-1"
                      >
                        {trigger.agentName}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge
                        variant="outline"
                        className={
                          trigger.enabled
                            ? "bg-green-950 text-green-400 border-green-800"
                            : "bg-stone-800 text-stone-400 border-stone-700"
                        }
                      >
                        {trigger.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-stone-200">
                        {trigger.triggerCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {trigger.lastTriggered && (
                          <div className="flex items-center gap-1 text-xs text-stone-400">
                            <Clock className="h-3 w-3" />
                            <span suppressHydrationWarning>
                              {formatRelativeTime(trigger.lastTriggered)}
                            </span>
                          </div>
                        )}
                        {getNextRun(trigger) && (
                          <div className="flex items-center gap-1 text-xs text-blue-400">
                            <Activity className="h-3 w-3" />
                            <span suppressHydrationWarning>Next: {getNextRun(trigger)}</span>
                          </div>
                        )}
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
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredTriggers.length)} of{" "}
                {filteredTriggers.length} triggers
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

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={
                          currentPage === pageNum
                            ? "bg-amber-600 hover:bg-amber-500 text-white"
                            : "text-stone-400 hover:text-stone-200"
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
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
          {paginatedTriggers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Zap className="h-12 w-12 text-stone-600 mx-auto mb-4" />
              <p className="text-stone-400">No triggers found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

