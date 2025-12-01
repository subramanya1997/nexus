"use client";

import { useState } from "react";
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
import { Settings, Copy, Check, ExternalLink, Code } from "lucide-react";

interface ApiTriggerProps {
  agentId: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  callCount?: number;
}

export function ApiTrigger({ agentId, enabled, onEnabledChange, callCount = 89 }: ApiTriggerProps) {
  const [copied, setCopied] = useState(false);
  const apiEndpoint = `/api/agents/${agentId}/run`;
  const fullUrl = `https://api.nexus.dev${apiEndpoint}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
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
          enabled ? "bg-green-950" : "bg-stone-800"
        }`}>
          <Code className={`h-4 w-4 ${enabled ? "text-green-400" : "text-stone-500"}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${enabled ? "text-stone-200" : "text-stone-500"}`}>
              Manual API
            </span>
            {enabled && (
              <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800 text-xs">
                Active
              </Badge>
            )}
          </div>
          <p className={`text-xs mt-0.5 font-mono ${enabled ? "text-stone-500" : "text-stone-600"}`}>
            {enabled ? `POST ${apiEndpoint}` : "Trigger agent via REST API"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {enabled && (
          <>
            <span className="text-xs text-stone-500">{callCount} calls</span>
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
                    <Code className="h-5 w-5 text-green-400" />
                    API Endpoint Configuration
                  </DialogTitle>
                  <DialogDescription className="text-stone-400">
                    Configure the REST API endpoint for this agent.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-stone-200">Endpoint URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={fullUrl}
                        readOnly
                        className="bg-stone-800 border-stone-700 text-stone-300 font-mono text-sm"
                      />
                      <Button variant="outline" size="icon" className="border-stone-700 shrink-0" onClick={copyUrl}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">HTTP Method</Label>
                    <Select defaultValue="POST">
                      <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-800 border-stone-700">
                        <SelectItem value="POST" className="text-stone-200 focus:bg-stone-700">POST</SelectItem>
                        <SelectItem value="GET" className="text-stone-200 focus:bg-stone-700">GET</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Authentication</Label>
                    <Select defaultValue="api_key">
                      <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-800 border-stone-700">
                        <SelectItem value="api_key" className="text-stone-200 focus:bg-stone-700">API Key (Header)</SelectItem>
                        <SelectItem value="bearer" className="text-stone-200 focus:bg-stone-700">Bearer Token</SelectItem>
                        <SelectItem value="oauth2" className="text-stone-200 focus:bg-stone-700">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <span>{callCount} calls today • 100% success rate</span>
                      <Link href="/api-keys" className="text-amber-500 hover:text-amber-400 flex items-center gap-1">
                        Manage API Keys
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

