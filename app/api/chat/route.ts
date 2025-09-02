import { NextRequest, NextResponse } from 'next/server'
import { n8nChatCompletion, getDefaultWebhookUrl } from '@/lib/n8n'

export async function POST(request: NextRequest) {
  try {
    const { messages, webhookUrl, systemPrompt } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Get response from n8n webhook
    const result = await n8nChatCompletion(messages, webhookUrl, systemPrompt)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: result.content,
      role: result.role,
      metadata: result.metadata
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check webhook configuration
export async function GET() {
  try {
    const webhookUrl = getDefaultWebhookUrl()
    
    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'No webhook URL configured' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      webhookUrl,
      configured: true,
      message: 'Webhook is configured and ready to use'
    })

  } catch (error) {
    console.error('Webhook check error:', error)
    return NextResponse.json(
      { error: 'Failed to check webhook configuration' },
      { status: 500 }
    )
  }
}
