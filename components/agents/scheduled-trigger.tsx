"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";
import type { AgentTrigger, ScheduledTriggerConfig } from "@/lib/types";
import { parseCronExpression } from "@/lib/data/triggers-data";

interface ScheduledTriggerProps {
  trigger: AgentTrigger;
  onEnabledChange?: (enabled: boolean) => void;
}

export function ScheduledTrigger({ trigger, onEnabledChange }: ScheduledTriggerProps) {
  const config = trigger.config as ScheduledTriggerConfig;
  const description = parseCronExpression(config.cronExpression);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-stone-900 border border-stone-800">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-950 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-200">{trigger.name}</span>
            <Badge
              variant="outline"
              className={
                trigger.enabled
                  ? "bg-green-950 text-green-400 border-green-800 text-xs"
                  : "bg-stone-800 text-stone-500 border-stone-700 text-xs"
              }
            >
              {trigger.enabled ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-mono">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-500">{trigger.triggerCount.toLocaleString()} runs</span>
        <Switch 
          checked={trigger.enabled} 
          onCheckedChange={onEnabledChange}
        />
      </div>
    </div>
  );
}

