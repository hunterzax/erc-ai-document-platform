import { ChatOllama } from '@langchain/community/chat_models/ollama'
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages'

// Initialize Ollama chat model
export const createOllamaModel = (modelName?: string) => {
  return new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: modelName || process.env.OLLAMA_MODEL || 'llama3.2',
    temperature: 0.7,
  })
}

// Convert chat messages to LangChain format
export const convertToLangChainMessages = (messages: any[]) => {
  return messages.map((msg) => {
    switch (msg.role) {
      case 'user':
        return new HumanMessage(msg.content)
      case 'assistant':
        return new AIMessage(msg.content)
      case 'system':
        return new SystemMessage(msg.content)
      default:
        return null
    }
  }).filter(Boolean)
}

// Add system prompt to messages
export const addSystemPrompt = (messages: any[], systemPrompt: string) => {
  const systemMessage = new SystemMessage(systemPrompt)
  return [systemMessage, ...convertToLangChainMessages(messages)]
}

// Chat completion with error handling
export const chatCompletion = async (
  messages: any[],
  modelName?: string,
  systemPrompt?: string
) => {
  try {
    const model = createOllamaModel(modelName)
    
    let langchainMessages
    if (systemPrompt) {
      langchainMessages = addSystemPrompt(messages, systemPrompt)
    } else {
      langchainMessages = convertToLangChainMessages(messages)
    }

    const response = await model.invoke(langchainMessages)
    
    return {
      success: true,
      content: response.content,
      role: 'assistant'
    }
  } catch (error) {
    console.error('LangChain chat completion error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Stream chat completion
export const streamChatCompletion = async function* (
  messages: any[],
  modelName?: string,
  systemPrompt?: string
) {
  try {
    const model = createOllamaModel(modelName)
    
    let langchainMessages
    if (systemPrompt) {
      langchainMessages = addSystemPrompt(messages, systemPrompt)
    } else {
      langchainMessages = convertToLangChainMessages(messages)
    }

    const stream = await model.stream(langchainMessages)
    
    for await (const chunk of stream) {
      if (chunk.content) {
        yield chunk.content
      }
    }
  } catch (error) {
    console.error('LangChain stream error:', error)
    yield `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
  }
}
