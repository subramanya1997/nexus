"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Webhook, Calendar, Clock, Shield } from "lucide-react";
import type { AgentTrigger } from "@/lib/types";
import { MCPTrigger } from "./mcp-trigger";
import { WebhookTrigger } from "./webhook-trigger";
import { ApiTrigger } from "./api-trigger";
import { ScheduledTrigger } from "./scheduled-trigger";

type TriggerType = "webhook" | "scheduled";

interface TriggersListProps {
  agentId: string;
  agentName: string;
  triggers: AgentTrigger[];
}

export function TriggersList({ agentId, agentName, triggers }: TriggersListProps) {
  const [isAddTriggerOpen, setIsAddTriggerOpen] = useState(false);
  const [selectedTriggerType, setSelectedTriggerType] = useState<TriggerType>("scheduled");
  const [mcpEnabled, setMcpEnabled] = useState(false);
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [apiEnabled, setApiEnabled] = useState(true);

  const scheduledTriggers = triggers.filter(t => t.type === "scheduled");

  const handleDialogClose = () => {
    setIsAddTriggerOpen(false);
    setSelectedTriggerType("scheduled");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-stone-100">Triggers</h2>
        <Dialog open={isAddTriggerOpen} onOpenChange={(open) => {
          if (!open) handleDialogClose();
          else setIsAddTriggerOpen(true);
        }}>
          <DialogTrigger asChild>
            <button className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
              <Plus className="h-4 w-4" />
              Add trigger
            </button>
          </DialogTrigger>
          <DialogContent className="bg-stone-900 border-stone-800 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-stone-100">Add Trigger</DialogTitle>
              <DialogDescription className="text-stone-400">
                Configure how this agent gets triggered.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Trigger Type Selector */}
              <div className="space-y-2">
                <Label className="text-stone-200">Trigger Type</Label>
                <Select 
                  value={selectedTriggerType} 
                  onValueChange={(value) => setSelectedTriggerType(value as TriggerType)}
                >
                  <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-stone-800 border-stone-700">
                    <SelectItem value="scheduled" className="text-stone-200 focus:bg-stone-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        Scheduled
                      </div>
                    </SelectItem>
                    <SelectItem value="webhook" className="text-stone-200 focus:bg-stone-700">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4 text-purple-400" />
                        Webhook
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Scheduled Trigger Fields */}
              {selectedTriggerType === "scheduled" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Name</Label>
                    <Input
                      placeholder="e.g., Daily Report Generation"
                      className="bg-stone-800 border-stone-700 text-stone-200 placeholder:text-stone-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Schedule (Cron Expression)</Label>
                    <Input
                      placeholder="0 8 * * 1"
                      className="bg-stone-800 border-stone-700 text-stone-200 placeholder:text-stone-500 font-mono"
                    />
                    <p className="text-xs text-stone-500">
                      Example: "0 8 * * 1" = Every Monday at 8 AM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-stone-800 border-stone-700">
                        <SelectItem value="utc" className="text-stone-200 focus:bg-stone-700">
                          UTC
                        </SelectItem>
                        <SelectItem value="america_new_york" className="text-stone-200 focus:bg-stone-700">
                          America/New_York (EST)
                        </SelectItem>
                        <SelectItem value="america_los_angeles" className="text-stone-200 focus:bg-stone-700">
                          America/Los_Angeles (PST)
                        </SelectItem>
                        <SelectItem value="europe_london" className="text-stone-200 focus:bg-stone-700">
                          Europe/London (GMT)
                        </SelectItem>
                        <SelectItem value="asia_tokyo" className="text-stone-200 focus:bg-stone-700">
                          Asia/Tokyo (JST)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg bg-blue-950/30 border border-blue-800/50 p-3">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-blue-200 font-medium">Next Run Preview</p>
                        <p className="text-xs text-blue-300/70 mt-0.5">
                          Monday, Dec 2, 2025 at 8:00 AM UTC
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Webhook Trigger Fields */}
              {selectedTriggerType === "webhook" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Name</Label>
                    <Input
                      placeholder="e.g., New Lead Created"
                      className="bg-stone-800 border-stone-700 text-stone-200 placeholder:text-stone-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Description</Label>
                    <Input
                      placeholder="Describe what triggers this webhook"
                      className="bg-stone-800 border-stone-700 text-stone-200 placeholder:text-stone-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-200">Authentication</Label>
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
                  <div className="rounded-lg bg-purple-950/30 border border-purple-800/50 p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-purple-200 font-medium">Webhook URL</p>
                        <p className="text-xs text-purple-300/70 mt-0.5 font-mono">
                          A unique URL will be generated after creation
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleDialogClose}
                className="border-stone-700 text-stone-300"
              >
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-500 text-white"
                onClick={handleDialogClose}
              >
                Add Trigger
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <ApiTrigger
          agentId={agentId}
          enabled={apiEnabled}
          onEnabledChange={setApiEnabled}
        />
        
        <MCPTrigger
          agentId={agentId}
          agentName={agentName}
          enabled={mcpEnabled}
          onEnabledChange={setMcpEnabled}
        />
        
        <WebhookTrigger
          agentId={agentId}
          enabled={webhookEnabled}
          onEnabledChange={setWebhookEnabled}
        />

        {scheduledTriggers.map((trigger) => (
          <ScheduledTrigger key={trigger.id} trigger={trigger} />
        ))}
      </div>
    </div>
  );
}

