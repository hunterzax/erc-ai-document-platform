import { NextRequest, NextResponse } from 'next/server'
import { createN8nClient } from '@/lib/n8n'

export async function GET() {
  try {
    const client = createN8nClient()
    
    // Test connection first
    const isConnected = await client.testConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to n8n. Please check if n8n is running.' },
        { status: 503 }
      )
    }

    // Get all workflows
    const workflows = await client.getWorkflows()
    
    return NextResponse.json({
      workflows: workflows.filter(w => w.active), // Only return active workflows
      total: workflows.length,
      active: workflows.filter(w => w.active).length
    })

  } catch (error) {
    console.error('Workflows API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workflowId, data } = await request.json()

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const client = createN8nClient()
    
    // Test connection first
    const isConnected = await client.testConnection()
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to n8n. Please check if n8n is running.' },
        { status: 503 }
      )
    }

    // Execute workflow
    const execution = await client.executeWorkflow(workflowId, data || {})
    
    if (!execution) {
      return NextResponse.json(
        { error: 'Failed to execute workflow' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Workflow executed successfully',
      executionId: execution.id,
      status: execution.status,
      result: execution.resultData
    })

  } catch (error) {
    console.error('Execute workflow API error:', error)
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    )
  }
}
