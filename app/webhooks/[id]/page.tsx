"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getWebhookById,
  getWebhookDeliveries,
  type Webhook,
  type WebhookDelivery,
} from "@/lib/data/webhooks-data";
import { mockAgents } from "@/lib/data/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  Copy,
  Check,
  Webhook as WebhookIcon,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

export default function WebhookDetailPage() {
  const params = useParams();
  const webhookId = params.id as string;

  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);

  useEffect(() => {
    const wh = getWebhookById(webhookId);
    if (wh) {
      setWebhook(wh);
      setDeliveries(getWebhookDeliveries(webhookId));
    }
  }, [webhookId]);

  if (!webhook) {
    return (
      <div className="flex flex-col h-screen bg-stone-950">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b border-stone-800 bg-stone-950 px-4">
          <div className="text-stone-400">Loading...</div>
        </header>
      </div>
    );
  }

  const copyToClipboard = (text: string, type: "url" | "secret") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "retrying":
        return <RefreshCw className="h-4 w-4 text-amber-400 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-stone-400" />;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-950 text-green-400 border-green-800">
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-950 text-red-400 border-red-800">
            Failed
          </Badge>
        );
      case "retrying":
        return (
          <Badge variant="outline" className="bg-amber-950 text-amber-400 border-amber-800">
            Retrying
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-stone-800 text-stone-400 border-stone-700">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-stone-950">
      {/* Header - matching agents page style */}
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-stone-800 bg-stone-950 px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/webhooks"
            className="flex items-center text-sm text-stone-400 hover:text-stone-200 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Webhooks
          </Link>
          <span className="text-stone-600">/</span>
          <div className="flex items-center gap-2">
            <WebhookIcon className="h-4 w-4 text-purple-400" />
            <span className="text-stone-100 font-medium">{webhook.name}</span>
          </div>
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
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500" suppressHydrationWarning>
            Last triggered {webhook.lastTriggered ? formatRelativeTime(webhook.lastTriggered) : "Never"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-400 hover:text-stone-200"
            onClick={() => copyToClipboard(webhook.url, "url")}
          >
            {copiedUrl ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-400 hover:text-stone-200"
          >
            {webhook.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-stone-400 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          <div className="max-w-4xl mx-auto px-8 py-10">
            {/* Webhook Info Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-stone-100 mb-2">{webhook.name}</h1>
              <p className="text-stone-400 mb-4">{webhook.description}</p>
              
              {/* URL Display */}
              <div className="flex items-center gap-2 mb-6">
                <code className="text-sm text-stone-300 font-mono bg-stone-800 px-3 py-1.5 rounded-lg">
                  {webhook.url}
                </code>
                <button
                  onClick={() => copyToClipboard(webhook.url, "url")}
                  className="text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {copiedUrl ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Stats Row - Simplified without large icons */}
              <div className="grid gap-4 md:grid-cols-4 pb-6 border-b border-stone-800">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Deliveries</p>
                  <p className="mt-1 text-2xl font-bold text-stone-100">
                    {webhook.totalDeliveries.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Success Rate</p>
                  <p className={`mt-1 text-2xl font-bold ${
                    webhook.successRate >= 98 ? "text-green-400" : 
                    webhook.successRate >= 95 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {webhook.successRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Target Agent</p>
                  <Link
                    href={`/agents/${webhook.targetAgentId}`}
                    className="mt-1 text-sm font-medium text-stone-200 hover:text-amber-500 flex items-center gap-1"
                  >
                    {webhook.targetAgentName}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">Last Triggered</p>
                  <p className="mt-1 text-sm font-medium text-stone-200" suppressHydrationWarning>
                    {webhook.lastTriggered ? formatRelativeTime(webhook.lastTriggered) : "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="configuration" className="space-y-6">
              <TabsList className="bg-stone-800 border-stone-700">
                <TabsTrigger value="configuration" className="data-[state=active]:bg-stone-700">
                  Configuration
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-stone-700">
                  Security
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-stone-700">
                  Logs
                </TabsTrigger>
              </TabsList>

              {/* Configuration Tab */}
              <TabsContent value="configuration">
                <Card className="bg-stone-900 border-stone-800">
                  <CardHeader>
                    <CardTitle className="text-stone-100">Webhook Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-stone-200">Name</Label>
                        <Input
                          defaultValue={webhook.name}
                          className="bg-stone-800 border-stone-700 text-stone-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-stone-200">Description</Label>
                        <Input
                          defaultValue={webhook.description}
                          className="bg-stone-800 border-stone-700 text-stone-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-stone-200">Endpoint URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={webhook.url}
                          readOnly
                          className="bg-stone-800 border-stone-700 text-stone-300 font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-stone-700"
                          onClick={() => copyToClipboard(webhook.url, "url")}
                        >
                          {copiedUrl ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-stone-200">Target Agent</Label>
                      <Select defaultValue={webhook.targetAgentId}>
                        <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                          <SelectValue />
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
                      <Label className="text-stone-200">Custom Headers</Label>
                      <div className="space-y-2">
                        {Object.entries(webhook.headers || {}).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <Input
                              defaultValue={key}
                              placeholder="Header name"
                              className="bg-stone-800 border-stone-700 text-stone-200 flex-1"
                            />
                            <Input
                              defaultValue={value}
                              placeholder="Header value"
                              className="bg-stone-800 border-stone-700 text-stone-200 flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-stone-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-stone-700 text-stone-300"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Header
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800">
                      <h3 className="text-sm font-medium text-stone-200 mb-4">Retry Configuration</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="text-stone-400">Max Retries</Label>
                          <Input
                            type="number"
                            defaultValue={webhook.retryConfig.maxRetries}
                            className="bg-stone-800 border-stone-700 text-stone-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-stone-400">Retry Delay (ms)</Label>
                          <Input
                            type="number"
                            defaultValue={webhook.retryConfig.retryDelayMs}
                            className="bg-stone-800 border-stone-700 text-stone-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-stone-400">Exponential Backoff</Label>
                          <Select
                            defaultValue={webhook.retryConfig.exponentialBackoff ? "true" : "false"}
                          >
                            <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-stone-800 border-stone-700">
                              <SelectItem value="true" className="text-stone-200 focus:bg-stone-700">
                                Enabled
                              </SelectItem>
                              <SelectItem value="false" className="text-stone-200 focus:bg-stone-700">
                                Disabled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-amber-600 hover:bg-amber-500 text-white">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="bg-stone-900 border-stone-800">
                  <CardHeader>
                    <CardTitle className="text-stone-100">Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-stone-200">Authentication Type</Label>
                      <Select defaultValue={webhook.security.authType}>
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

                    {webhook.security.authType === "hmac" && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-stone-200">HMAC Secret</Label>
                          <div className="flex gap-2">
                            <Input
                              type={showSecret ? "text" : "password"}
                              value={webhook.security.hmacSecret || ""}
                              readOnly
                              className="bg-stone-800 border-stone-700 text-stone-300 font-mono"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-stone-700"
                              onClick={() => setShowSecret(!showSecret)}
                            >
                              {showSecret ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-stone-700"
                              onClick={() =>
                                copyToClipboard(webhook.security.hmacSecret || "", "secret")
                              }
                            >
                              {copiedSecret ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-stone-500">
                            Use this secret to verify webhook signatures in your source application.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-stone-200">HMAC Algorithm</Label>
                          <Select defaultValue={webhook.security.hmacAlgorithm || "sha256"}>
                            <SelectTrigger className="bg-stone-800 border-stone-700 text-stone-200 w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-stone-800 border-stone-700">
                              <SelectItem value="sha256" className="text-stone-200 focus:bg-stone-700">
                                SHA-256
                              </SelectItem>
                              <SelectItem value="sha512" className="text-stone-200 focus:bg-stone-700">
                                SHA-512
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t border-stone-800">
                      <h3 className="text-sm font-medium text-stone-200 mb-4">IP Allowlist</h3>
                      <div className="space-y-2">
                        {(webhook.security.ipAllowlist || []).map((ip, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              defaultValue={ip}
                              className="bg-stone-800 border-stone-700 text-stone-200 font-mono"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-stone-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-stone-700 text-stone-300"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add IP Address
                        </Button>
                      </div>
                      <p className="text-xs text-stone-500 mt-2">
                        Leave empty to allow requests from any IP address.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-800">
                      <h3 className="text-sm font-medium text-stone-200 mb-4">Rate Limiting</h3>
                      <div className="space-y-2">
                        <Label className="text-stone-400">Requests per minute</Label>
                        <Input
                          type="number"
                          defaultValue={webhook.security.rateLimitPerMinute || 100}
                          className="bg-stone-800 border-stone-700 text-stone-200 w-48"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-amber-600 hover:bg-amber-500 text-white">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs">
                <Card className="bg-stone-900 border-stone-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-stone-100">Delivery Logs</CardTitle>
                    <Button variant="outline" size="sm" className="border-stone-700 text-stone-300">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-stone-800">
                      {deliveries.length > 0 ? (
                        deliveries.map((delivery) => (
                          <div key={delivery.id}>
                            <div
                              className="flex items-center gap-4 px-6 py-4 hover:bg-stone-800/50 cursor-pointer transition-colors"
                              onClick={() =>
                                setExpandedDelivery(
                                  expandedDelivery === delivery.id ? null : delivery.id
                                )
                              }
                            >
                              <button className="text-stone-500">
                                {expandedDelivery === delivery.id ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              {getDeliveryStatusIcon(delivery.status)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-sm text-stone-200"
                                    suppressHydrationWarning
                                  >
                                    {formatRelativeTime(delivery.timestamp)}
                                  </span>
                                  {getDeliveryStatusBadge(delivery.status)}
                                </div>
                                <p className="text-xs text-stone-500 mt-0.5">
                                  {delivery.sourceIp} • {delivery.duration}ms
                                  {delivery.retryCount > 0 && ` • ${delivery.retryCount} retries`}
                                </p>
                              </div>
                              {delivery.responseStatus && (
                                <Badge
                                  variant="outline"
                                  className={
                                    delivery.responseStatus >= 200 && delivery.responseStatus < 300
                                      ? "bg-green-950 text-green-400 border-green-800"
                                      : "bg-red-950 text-red-400 border-red-800"
                                  }
                                >
                                  {delivery.responseStatus}
                                </Badge>
                              )}
                              {delivery.status === "failed" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-stone-700 text-stone-300"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Retry
                                </Button>
                              )}
                            </div>

                            {expandedDelivery === delivery.id && (
                              <div className="px-6 py-4 bg-stone-950 border-t border-stone-800">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label className="text-stone-400 text-xs">Request Payload</Label>
                                    <pre className="text-xs text-stone-300 font-mono bg-stone-900 p-3 rounded-lg overflow-auto max-h-48">
                                      {JSON.stringify(delivery.requestPayload, null, 2)}
                                    </pre>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-stone-400 text-xs">Response</Label>
                                    {delivery.error ? (
                                      <div className="bg-red-950/50 border border-red-800 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                                          <p className="text-xs text-red-300">{delivery.error}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <pre className="text-xs text-stone-300 font-mono bg-stone-900 p-3 rounded-lg overflow-auto max-h-48">
                                        {delivery.responseBody || "No response body"}
                                      </pre>
                                    )}
                                  </div>
                                </div>
                                {delivery.executionId && (
                                  <div className="mt-4 pt-4 border-t border-stone-800">
                                    <Link
                                      href={`/activity?execution=${delivery.executionId}`}
                                      className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1"
                                    >
                                      View Execution Trace
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-12 text-center">
                          <p className="text-stone-400">No deliveries yet</p>
                          <p className="text-sm text-stone-500 mt-1">
                            Deliveries will appear here when the webhook receives requests.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
