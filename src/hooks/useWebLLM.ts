import { useCallback, useEffect, useState } from 'react'
import * as webllm from '@mlc-ai/web-llm'

export interface ChatMessage {
  id: string
  text: string
  user: string
  timestamp: number
  isBot?: boolean
}

export function useWebLLM() {
  const [engine, setEngine] = useState<webllm.MLCEngine | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [error, setError] = useState<string | null>(null)

  const initEngine = useCallback(async () => {
    if (engine || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const chatEngine = new webllm.MLCEngine()

      await chatEngine.reload('Llama-3.2-3B-Instruct-q4f32_1-MLC')

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
  }, [engine, isLoading])

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
        }

        setMessages((prev) => [...prev, botMessage])

        let fullResponse = ''

        const asyncChunkGenerator = await engine.chat.completions.create({
          messages: [{ role: 'user', content: text.trim() }],
          stream: true,
        })

        for await (const chunk of asyncChunkGenerator) {
          const deltaContent = chunk.choices[0]?.delta?.content || ''
          if (deltaContent) {
            fullResponse += deltaContent

            // Update the bot message with streaming response
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botMessageId ? { ...msg, text: fullResponse } : msg,
              ),
            )
          }
        }
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
  }
}
