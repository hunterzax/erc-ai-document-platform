"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Play, Zap, Settings } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  active: boolean
}

interface WorkflowSelectorProps {
  onWorkflowChange: (workflowId: string) => void
  onWebhookChange: (webhookUrl: string) => void
  currentWorkflowId?: string
  currentWebhookUrl?: string
}

export function WorkflowSelector({ 
  onWorkflowChange, 
  onWebhookChange, 
  currentWorkflowId, 
  currentWebhookUrl 
}: WorkflowSelectorProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookUrl || '')
  const [useWebhook, setUseWebhook] = useState(!!currentWebhookUrl)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking')

  useEffect(() => {
    fetchWorkflows()
  }, [])

  useEffect(() => {
    if (useWebhook && webhookUrl) {
      onWebhookChange(webhookUrl)
    } else if (!useWebhook && currentWorkflowId) {
      onWorkflowChange(currentWorkflowId)
    }
  }, [useWebhook, webhookUrl, currentWorkflowId, onWebhookChange, onWorkflowChange])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/workflows')
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.workflows || [])
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('failed')
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
      setConnectionStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  const handleWorkflowChange = (workflowId: string) => {
    if (!useWebhook) {
      onWorkflowChange(workflowId)
    }
  }

  const handleWebhookChange = (url: string) => {
    setWebhookUrl(url)
    if (useWebhook && url) {
      onWebhookChange(url)
    }
  }

  const toggleMode = () => {
    setUseWebhook(!useWebhook)
    if (useWebhook) {
      // Switching to workflow mode
      onWebhookChange('')
      if (currentWorkflowId) {
        onWorkflowChange(currentWorkflowId)
      }
    } else {
      // Switching to webhook mode
      onWorkflowChange('')
      if (webhookUrl) {
        onWebhookChange(webhookUrl)
      }
    }
  }

  const testConnection = async () => {
    try {
      setConnectionStatus('checking')
      const response = await fetch('/api/workflows')
      if (response.ok) {
        setConnectionStatus('connected')
        fetchWorkflows()
      } else {
        setConnectionStatus('failed')
      }
    } catch (error) {
      setConnectionStatus('failed')
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'connected':
        return <Zap className="h-4 w-4 text-green-500" />
      case 'failed':
        return <Settings className="h-4 w-4 text-red-500" />
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'Checking connection...'
      case 'connected':
        return 'Connected to n8n'
      case 'failed':
        return 'Connection failed'
    }
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        {getConnectionStatusIcon()}
        <span className={connectionStatus === 'failed' ? 'text-red-500' : 'text-foreground'}>
          {getConnectionStatusText()}
        </span>
        {connectionStatus === 'failed' && (
          <Button variant="outline" size="sm" onClick={testConnection}>
            Retry
          </Button>
        )}
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={!useWebhook ? "default" : "outline"}
          size="sm"
          onClick={() => setUseWebhook(false)}
        >
          <Play className="h-4 w-4 mr-2" />
          Workflow
        </Button>
        <Button
          variant={useWebhook ? "default" : "outline"}
          size="sm"
          onClick={() => setUseWebhook(true)}
        >
          <Zap className="h-4 w-4 mr-2" />
          Webhook
        </Button>
      </div>

      {/* Workflow Selection */}
      {!useWebhook && (
        <div className="space-y-2">
          <Label htmlFor="workflow-select">Select Workflow</Label>
          <Select
            value={currentWorkflowId || ''}
            onValueChange={handleWorkflowChange}
            disabled={loading || connectionStatus !== 'connected'}
          >
            <SelectTrigger id="workflow-select">
              <SelectValue placeholder="Select a workflow" />
            </SelectTrigger>
            <SelectContent>
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {workflows.length === 0 && connectionStatus === 'connected' && (
            <p className="text-sm text-muted-foreground">
              No active workflows found. Create a workflow in n8n first.
            </p>
          )}
        </div>
      )}

      {/* Webhook URL Input */}
      {useWebhook && (
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://your-n8n-instance.com/webhook/abc123"
            value={webhookUrl}
            onChange={(e) => handleWebhookChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Enter the webhook URL from your n8n workflow
          </p>
        </div>
      )}

      {/* Current Selection Display */}
      <div className="text-sm text-muted-foreground">
        {useWebhook ? (
          webhookUrl ? (
            <span>Using webhook: {webhookUrl}</span>
          ) : (
            <span>No webhook URL configured</span>
          )
        ) : (
          currentWorkflowId ? (
            <span>Using workflow: {workflows.find(w => w.id === currentWorkflowId)?.name}</span>
          ) : (
            <span>No workflow selected</span>
          )
        )}
      </div>
    </div>
  )
}

