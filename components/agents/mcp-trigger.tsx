"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Copy, Check, ExternalLink } from "lucide-react";

interface MCPTriggerProps {
  agentId: string;
  agentName: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export function MCPTrigger({ agentId, agentName, enabled, onEnabledChange }: MCPTriggerProps) {
  const [copied, setCopied] = useState(false);
  const serverUrl = `https://mcp.nexus.dev/servers/${agentId}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(serverUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
        enabled 
          ? "bg-stone-900 border-stone-800" 
          : "bg-stone-900/50 border-stone-800/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
          enabled ? "bg-orange-950" : "bg-stone-800"
        }`}>
          <Image 
            src="/icons/mcp.svg" 
            alt="MCP" 
            width={16} 
            height={16} 
            style={{ filter: enabled ? 'invert(67%) sepia(74%) saturate(1200%) hue-rotate(346deg) brightness(101%) contrast(101%)' : 'invert(50%)' }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${enabled ? "text-stone-200" : "text-stone-500"}`}>
              MCP Server
            </span>
            {enabled && (
              <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800 text-xs">
                Active
              </Badge>
            )}
          </div>
          <p className={`text-xs mt-0.5 font-mono ${enabled ? "text-stone-500" : "text-stone-600"}`}>
            {enabled ? serverUrl : "Expose agent as MCP-compatible tool"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {enabled && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-stone-400 hover:text-stone-200"
              onClick={copyUrl}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-stone-200">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-stone-900 border-stone-800 sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle className="text-stone-100 flex items-center gap-2">
                    <Image 
                      src="/icons/mcp.svg" 
                      alt="MCP" 
                      width={20} 
                      height={20}
                      style={{ filter: 'invert(67%) sepia(74%) saturate(1200%) hue-rotate(346deg) brightness(101%) contrast(101%)' }}
                    />
                    MCP Server Configuration
                  </DialogTitle>
                  <DialogDescription className="text-stone-400">
                    Configure how this agent is exposed as an MCP tool.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-stone-200">Server URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={serverUrl}
                        readOnly
                        className="bg-stone-800 border-stone-700 text-stone-300 font-mono text-sm"
                      />
                      <Button variant="outline" size="icon" className="border-stone-700 shrink-0" onClick={copyUrl}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Tool Name</Label>
                    <Input
                      defaultValue={agentName.toLowerCase().replace(/\s+/g, "_")}
                      className="bg-stone-800 border-stone-700 text-stone-200 font-mono text-sm"
                    />
                    <p className="text-xs text-stone-500">
                      The identifier used when calling this agent as a tool
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Rate Limit</Label>
                    <Select defaultValue="60">
                      <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-800 border-stone-700">
                        <SelectItem value="10" className="text-stone-200 focus:bg-stone-700">10 requests/min</SelectItem>
                        <SelectItem value="30" className="text-stone-200 focus:bg-stone-700">30 requests/min</SelectItem>
                        <SelectItem value="60" className="text-stone-200 focus:bg-stone-700">60 requests/min</SelectItem>
                        <SelectItem value="120" className="text-stone-200 focus:bg-stone-700">120 requests/min</SelectItem>
                        <SelectItem value="unlimited" className="text-stone-200 focus:bg-stone-700">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-3 border-t border-stone-800">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>12 calls today • 3 unique clients</span>
                      <Link href="/mcp-registry" className="text-amber-500 hover:text-amber-400 flex items-center gap-1">
                        View in Registry
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button className="bg-amber-600 hover:bg-amber-500 text-white">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>
    </div>
  );
}

