"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Download, Zap, Webhook } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-t border-stone-800">
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/agents/new">
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-500 text-white"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Agent</span>
          </Button>
        </Link>
        <Link href="/integrations">
          <Button
            size="sm"
            variant="outline"
            className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-stone-100"
          >
            <Zap className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Integration</span>
          </Button>
        </Link>
        <Link href="/webhooks">
          <Button
            size="sm"
            variant="outline"
            className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-stone-100"
          >
            <Webhook className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Webhook</span>
          </Button>
        </Link>
        <Link href="/mcp-registry/new">
          <Button
            size="sm"
            variant="outline"
            className="border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-stone-100"
          >
            <Image
              src="/icons/mcp.svg"
              alt="MCP"
              width={16}
              height={16}
              className="h-4 w-4 sm:mr-2 brightness-0 invert opacity-70"
            />
            <span className="hidden sm:inline">Create Server</span>
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/activity">
          <Button
            size="sm"
            variant="ghost"
            className="text-stone-400 hover:text-stone-200"
          >
            <Activity className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">View All Activity</span>
          </Button>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          className="text-stone-400 hover:text-stone-200"
        >
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Export Report</span>
        </Button>
      </div>
    </div>
  );
}

