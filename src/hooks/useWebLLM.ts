import { useCallback, useState } from 'react'
import { type ToolCall, type ThinkingStep } from '../utils/tools'

export interface ChatMessage {
  id: string
  text: string
  user: string
  timestamp: number
  isBot?: boolean
  thinking?: ThinkingStep[]
  toolCalls?: ToolCall[]
  isStreaming?: boolean
}

export function useWebLLM() {
  const [engine, setEngine] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [error, setError] = useState<string | null>(null)
  const [webllmModule, setWebllmModule] = useState<any>(null)

  const preloadWebLLM = useCallback(async () => {
    if (webllmModule) return
    
    try {
      // Just preload the module without setting it to state to avoid triggering re-renders
      await import('@mlc-ai/web-llm')
    } catch (err) {
      // Silently fail on preload - we'll handle errors during actual initialization
      console.warn('Failed to preload WebLLM:', err)
    }
  }, [webllmModule])

  const loadWebLLM = useCallback(async () => {
    if (webllmModule) return webllmModule
    
    try {
      const module = await import('@mlc-ai/web-llm')
      setWebllmModule(module)
      return module
    } catch (err) {
      setError('Failed to load WebLLM library')
      throw err
    }
  }, [webllmModule])

  const initEngine = useCallback(async () => {
    if (engine || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const webllm = await loadWebLLM()
      const chatEngine = new webllm.MLCEngine()

      // await chatEngine.reload('Llama-3.2-3B-Instruct-q4f32_1-MLC')
      await chatEngine.reload('Qwen3-4B-q4f16_1-MLC')

      setEngine(chatEngine)
      setIsInitialized(true)

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Hello! I'm your AI assistant running locally in your browser. How can I help you today?",
        user: 'Assistant',
        timestamp: Date.now(),
        isBot: true,
      }
      setMessages([welcomeMessage])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to initialize WebLLM',
      )
      console.error('WebLLM initialization error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [engine, isLoading, loadWebLLM])

  const sendMessage = useCallback(
    async (text: string, user: string) => {
      if (!engine || !text.trim()) return

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        user,
        timestamp: Date.now(),
        isBot: false,
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        const botMessageId = (Date.now() + 1).toString()

        // Add placeholder for bot response
        const botMessage: ChatMessage = {
          id: botMessageId,
          text: '',
          user: 'Assistant',
          timestamp: Date.now(),
          isBot: true,
          thinking: [],
          toolCalls: [],
          isStreaming: true,
        }

        setMessages((prev) => [...prev, botMessage])

        let fullResponse = ''
        let currentThinking: ThinkingStep[] = []
        let currentToolCalls: ToolCall[] = []

        // Enhanced prompt with tool calling capabilities
        const { executeTool, getToolsPrompt } = await import('../utils/tools')
        const systemPrompt = `You are a helpful AI assistant with access to browser-based tools.

${getToolsPrompt()}

Always think through your response step by step, and use tools when they would be helpful.`

        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text.trim() }
        ]

        const asyncChunkGenerator = await engine.chat.completions.create({
          messages,
          stream: true,
        })

        for await (const chunk of asyncChunkGenerator) {
          const deltaContent = chunk.choices[0]?.delta?.content || ''
          if (deltaContent) {
            fullResponse += deltaContent

            // Try to parse as JSON for structured responses
            try {
              const parsed = JSON.parse(fullResponse)
              
              if (parsed.thinking && Array.isArray(parsed.thinking)) {
                currentThinking = parsed.thinking.map((step: string, index: number) => ({
                  id: `${botMessageId}-thinking-${index}`,
                  content: step,
                  timestamp: Date.now()
                }))
              }

              if (parsed.tool_calls && Array.isArray(parsed.tool_calls)) {
                currentToolCalls = []
                
                for (const toolCall of parsed.tool_calls) {
                  const toolCallId = `${botMessageId}-tool-${currentToolCalls.length}`
                  
                  try {
                    const result = await executeTool(toolCall.name, toolCall.arguments)
                    currentToolCalls.push({
                      id: toolCallId,
                      name: toolCall.name,
                      arguments: toolCall.arguments,
                      result: result.result,
                      error: result.success ? undefined : result.error
                    })
                  } catch (error) {
                    currentToolCalls.push({
                      id: toolCallId,
                      name: toolCall.name,
                      arguments: toolCall.arguments,
                      error: error instanceof Error ? error.message : 'Unknown error'
                    })
                  }
                }
              }

              // Update the bot message with structured response
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId ? {
                    ...msg,
                    text: parsed.response || parsed.content || fullResponse,
                    thinking: currentThinking,
                    toolCalls: currentToolCalls,
                    isStreaming: true
                  } : msg,
                ),
              )
            } catch {
              // Not valid JSON yet, continue streaming as regular text
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId ? { 
                    ...msg, 
                    text: fullResponse,
                    isStreaming: true
                  } : msg,
                ),
              )
            }
          }
        }

        // Final update - mark as not streaming
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, isStreaming: false } : msg,
          ),
        )

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        console.error('Message send error:', err)

        // Remove the placeholder message and add error message
        setMessages((prev) => {
          const filtered = prev.slice(0, -1) // Remove placeholder
          return [
            ...filtered,
            {
              id: Date.now().toString(),
              text: 'Sorry, I encountered an error processing your message.',
              user: 'Assistant',
              timestamp: Date.now(),
              isBot: true,
            },
          ]
        })
      }
    },
    [engine],
  )

  return {
    engine,
    isLoading,
    isInitialized,
    messages,
    error,
    initEngine,
    sendMessage,
    preloadWebLLM,
  }
}
