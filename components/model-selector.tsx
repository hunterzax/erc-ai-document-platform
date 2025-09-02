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
import { Loader2, Download } from 'lucide-react'

interface Model {
  name: string
  size: number
  modified_at: string
}

interface ModelSelectorProps {
  onModelChange: (modelName: string) => void
  currentModel?: string
}

export function ModelSelector({ onModelChange, currentModel }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/models')
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadModel = async (modelName: string) => {
    try {
      setDownloading(modelName)
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      })

      if (response.ok) {
        // Wait a bit and refresh models
        setTimeout(() => {
          fetchModels()
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to download model:', error)
    } finally {
      setDownloading(null)
    }
  }

  const formatSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading models...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentModel || models[0]?.name}
        onValueChange={onModelChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.name} value={model.name}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatSize(model.size)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadModel('llama3.2')}
        disabled={downloading === 'llama3.2'}
      >
        {downloading === 'llama3.2' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="ml-2">Llama 3.2</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadModel('codellama')}
        disabled={downloading === 'codellama'}
      >
        {downloading === 'codellama' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="ml-2">CodeLlama</span>
      </Button>
    </div>
  )
}

