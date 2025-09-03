import axios from 'axios'

interface HealthResponse {
  status: string
  version: string
}

interface Workflow {
  id: string
  name: string
  active: boolean
  nodes: any[]
}

interface WebhookResponse {
  success: boolean
  data?: any
  error?: string
}

interface ChatCompletionResult {
  success: boolean
  content?: string
  role?: string
  metadata?: any
  error?: string
}

// Get default webhook URL from environment variables
export function getDefaultWebhookUrl(): string | null {
  return process.env._WEBHOOK_URL || null
}

// Check  health
export async function checkHealth(): Promise<{ healthy: boolean; message: string }> {
  try {
    const baseUrl = process.env._BASE_URL || 'http://localhost:5678'
    // console.log('=========>',baseUrl)
    const response = await axios.get(`${baseUrl}/api/v1/health`, {
      timeout: 5000
    })
    
    if (response.status === 200) {
      return { healthy: true, message: ' is running and healthy' }
    } else {
      return { healthy: false, message: ' is running but not healthy' }
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return { healthy: false, message: 'Cannot connect to  Please make sure  is running on http://localhost:5678' }
    } else if (error.code === 'ENOTFOUND') {
      return { healthy: false, message: 'Cannot resolve  hostname. Please check your network connection and  URL.' }
    } else if (error.response?.status === 404) {
      return { healthy: false, message: ' API endpoint not found. Please check if  is running the correct version.' }
    } else {
      return { healthy: false, message: `Connection error: ${error.message}` }
    }
  }
}

// Get active workflows
export async function getActiveWorkflows(): Promise<Workflow[]> {
  try {
    const baseUrl = process.env._BASE_URL || 'http://localhost:5678'
    const apiKey = process.env._API_KEY
    
    const headers: any = {}
    if (apiKey) {
      headers['X--API-KEY'] = apiKey
    }
    
    const response = await axios.get(`${baseUrl}/api/v1/workflows`, {
      headers,
      timeout: 10000
    })
    
    if (response.status === 200) {
      return response.data.data.filter((workflow: Workflow) => workflow.active)
    }
    
    return []
  } catch (error: any) {
    console.error('Failed to get workflows:', error.message)
    return []
  }
}

// Execute a specific workflow
export async function executeWorkflow(workflowId: string, data: any): Promise<WebhookResponse> {
  try {
    const baseUrl = process.env._BASE_URL || 'http://localhost:5678'
    const apiKey = process.env._API_KEY
    
    const headers: any = {
      'Content-Type': 'application/json'
    }
    if (apiKey) {
      headers['X--API-KEY'] = apiKey
    }
    
    const response = await axios.post(`${baseUrl}/api/v1/workflows/${workflowId}/trigger`, data, {
      headers,
      timeout: 30000
    })
    
    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to execute workflow'
    }
  }
}

// Execute webhook directly
export async function executeWebhook(webhookUrl: string, data: any): Promise<WebhookResponse> {
  try {
    // Validate webhook URL
    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return {
        success: false,
        error: 'Invalid webhook URL provided'
      }
    }

    // Check if webhook URL is accessible
    try {
      const response = await axios.post(webhookUrl, data, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      return {
        success: true,
        data: response.data
      }
    } catch (webhookError: any) {
      // Handle specific webhook errors
      if (webhookError.response?.status === 404) {
        return {
          success: false,
          error: `Webhook not found (404). The webhook "${webhookUrl.split('/').pop()}" is not registered in  Please make sure the workflow is active and the webhook is enabled.`
        }
      } else if (webhookError.response?.status === 500) {
        return {
          success: false,
          error: `Webhook server error (500). There was an error processing your request in the  workflow.`
        }
      } else if (webhookError.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: `Cannot connect to  Please make sure  is running on ${new URL(webhookUrl).origin}`
        }
      } else if (webhookError.code === 'ENOTFOUND') {
        return {
          success: false,
          error: `Cannot resolve hostname. Please check your network connection and  URL.`
        }
      } else {
        return {
          success: false,
          error: webhookError.response?.data?.message || webhookError.message || 'Unknown webhook error occurred'
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error occurred while executing webhook'
    }
  }
}

// Main chat completion function
export async function ChatCompletion(
  messages: any[],
  webhookUrl?: string,
  systemPrompt?: string
): Promise<ChatCompletionResult> {
  try {
    // Use provided webhook URL or default from environment
    const targetWebhookUrl = webhookUrl || getDefaultWebhookUrl()
    // console.log('=========>',targetWebhookUrl)
    if (!targetWebhookUrl) {
      return {
        success: false,
        error: 'No webhook URL provided and no default webhook URL configured in environment variables'
      }
    }

    // Prepare the data to send to 
    const data = {
      messages,
      systemPrompt: systemPrompt || 'You are a helpful AI assistant.',
      timestamp: new Date().toISOString()
    }

    // Execute the webhook
    const result = await executeWebhook(targetWebhookUrl, data)
    // console.log(result)
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Unknown error occurred while executing webhook'
      }
    }

    // Extract the AI response from the result
    const aiResponse = result.data?.aiResponse || result.data?.response || result.data?.message || result.data

    if (!aiResponse) {
      return {
        success: false,
        error: 'No AI response received from  workflow'
      }
    }

    // Handle different response formats
    let content: string
    let role: string = 'assistant'
    let metadata: any = {}

    if (typeof aiResponse === 'string') {
      content = aiResponse
    } else if (typeof aiResponse === 'object') {
      content = aiResponse.content || aiResponse.text || aiResponse.message || JSON.stringify(aiResponse)
      role = aiResponse.role || 'assistant'
      metadata = aiResponse.metadata || aiResponse
    } else {
      content = String(aiResponse)
    }

    return {
      success: true,
      content,
      role,
      metadata
    }

  } catch (error: any) {
    console.error('ChatCompletion error:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred in  chat completion'
    }
  }
}
