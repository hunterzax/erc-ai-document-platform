import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/tags`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch models')
    }

    const data = await response.json()
    
    return NextResponse.json({
      models: data.models || []
    })

  } catch (error) {
    console.error('Models API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new Error('Failed to pull model')
    }

    return NextResponse.json({
      message: `Model ${name} is being downloaded`
    })

  } catch (error) {
    console.error('Pull model API error:', error)
    return NextResponse.json(
      { error: 'Failed to pull model' },
      { status: 500 }
    )
  }
}
