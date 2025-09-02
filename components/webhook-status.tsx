"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  TestTube,
  Server,
  Wifi,
  WifiOff
} from 'lucide-react'
import { checkN8nHealth, getDefaultWebhookUrl } from '@/lib/n8n'

interface WebhookStatusProps {
  onTestMessage: (message: string) => void
}

export function WebhookStatus({ onTestMessage }: WebhookStatusProps) {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy' | 'error'>('checking')
  const [message, setMessage] = useState('')
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setStatus('checking')
    setMessage('Checking n8n status...')
    
    try {
      // Check n8n health
      const healthResult = await checkN8nHealth()
      
      if (healthResult.healthy) {
        // Check webhook URL
        const webhook = getDefaultWebhookUrl()
        setWebhookUrl(webhook)
        
        if (webhook) {
          setStatus('healthy')
          setMessage('n8n is running and webhook is configured')
        } else {
          setStatus('unhealthy')
          setMessage('n8n is running but no webhook URL configured')
        }
      } else {
        setStatus('unhealthy')
        setMessage(healthResult.message)
      }
      
      setLastChecked(new Date())
    } catch (error) {
      setStatus('error')
      setMessage('Failed to check n8n status')
      console.error('Status check error:', error)
    }
  }

  const handleTestMessage = () => {
    const testMessage = "Hello! This is a test message to verify the webhook is working."
    onTestMessage(testMessage)
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'unhealthy':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'unhealthy':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'checking':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Connected'
      case 'unhealthy':
        return 'Warning'
      case 'error':
        return 'Error'
      case 'checking':
        return 'Checking...'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`flex items-center gap-1 ${getStatusColor()}`}
      >
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={checkStatus}
        disabled={status === 'checking'}
        className="h-8 px-2"
        title="Refresh status"
      >
        <Server className="h-4 w-4" />
      </Button>
      
      {status === 'healthy' && webhookUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTestMessage}
          className="h-8 px-2 text-xs"
          title="Test webhook"
        >
          <TestTube className="h-4 w-4" />
        </Button>
      )}
      
      {/* Status Details Tooltip */}
      <div className="relative group">
        <div className="absolute bottom-full right-0 mb-2 w-80 p-3 bg-background border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {getStatusIcon()}
                n8n Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {getStatusText()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Message:</span>
                  <span className="text-muted-foreground">{message}</span>
                </div>
                
                {webhookUrl && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Webhook:</span>
                    <span className="text-muted-foreground text-xs max-w-32 truncate">
                      {webhookUrl.split('/').pop()}
                    </span>
                  </div>
                )}
                
                {lastChecked && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Last Check:</span>
                    <span className="text-muted-foreground text-xs">
                      {lastChecked.toLocaleTimeString()}
                    </span>
                  </div>
                )}
                
                {status === 'unhealthy' && (
                  <Alert className="mt-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}
                
                {status === 'error' && (
                  <Alert className="mt-2">
                    <XCircle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      {message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
