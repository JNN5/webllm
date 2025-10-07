import { useState } from 'react'
import { useWebLLM, type ChatMessage } from '../hooks/useWebLLM'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { ThinkingSection, ToolCallsSection } from './ThinkingComponents'
import { ExamplePrompts } from './ExamplePrompts'
import ReactMarkdown from 'react-markdown'

interface MessageProps {
  message: ChatMessage
  currentUser: string
}

function Message({ message, currentUser }: MessageProps) {
  const isCurrentUser = message.user === currentUser
  const isBot = message.isBot

  return (
    <div
      className={`flex ${isCurrentUser && !isBot ? 'justify-end' : 'justify-start'} mb-4 fade-in`}
    >
      <div
        className={`px-4 py-3 ${
          isBot
            ? 'message-assistant'
            : isCurrentUser
              ? 'message-user'
              : 'message-assistant'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {isBot ? (
            <Bot size={16} className="text-[#fca311]" />
          ) : (
            <User size={16} />
          )}
          <span className="text-sm font-medium">
            {isBot ? 'Assistant' : message.user}
          </span>
          <span className="text-xs opacity-60 ml-auto">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          {message.isStreaming && (
            <Loader2 size={12} className="text-[#fca311] animate-spin" />
          )}
        </div>
        
        {/* Thinking Section */}
        {message.thinking && message.thinking.length > 0 && (
          <ThinkingSection thinking={message.thinking} />
        )}
        
        {/* Tool Calls Section */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallsSection toolCalls={message.toolCalls} />
        )}
        
        {/* Main Response */}
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default function WebLLMChatArea() {
  const { isLoading, isInitialized, messages, error, initEngine, sendMessage, preloadWebLLM } =
    useWebLLM()
  const [inputMessage, setInputMessage] = useState('')
  const [user, setUser] = useState('You')

  const handleSendMessage = () => {
    if (inputMessage.trim().length && isInitialized) {
      sendMessage(inputMessage, user)
      setInputMessage('')
    }
  }

  const handleSelectPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isInitialized && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center">
            <Bot size={32} className="text-[#14213d]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome to WebLLM Chat</h2>
          <p className="text-white/70 max-w-md">
            Initialize your private AI assistant that runs entirely in your browser.
            No data leaves your device.
          </p>
          <p className="text-sm text-white/50">
            First initialization may take a few minutes and requires internet connection
            to download the model.
          </p>
        </div>
        <button
          onClick={initEngine}
          onMouseEnter={preloadWebLLM}
          disabled={isLoading}
          className="glass-btn-primary text-lg px-8 py-4 flex items-center gap-2"
        >
          <Bot size={20} />
          Initialize WebLLM
        </button>
        {error && (
          <div className="glass-card-light px-4 py-3 text-red-300 text-center max-w-md">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center">
            <Bot size={32} className="text-[#14213d]" />
          </div>
          <Loader2 size={24} className="absolute -top-1 -right-1 text-[#fca311] animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">Loading AI Model...</h3>
          <p className="text-white/70">
            Downloading and initializing the language model
          </p>
          <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#fca311] to-[#ff9500] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ExamplePrompts 
              onSelectPrompt={handleSelectPrompt}
              disabled={!isInitialized}
            />
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} currentUser={user} />
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10">
        <div className="glass-card-light p-4 space-y-4">
          {/* User Name Input */}
          <div className="flex items-center gap-3">
            <User size={16} className="text-[#fca311]" />
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Your name"
              className="input-glass flex-1 text-sm"
            />
          </div>

          {/* Message Input */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="input-glass w-full resize-none"
                rows={2}
                style={{ minHeight: '60px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || !isInitialized}
              className="glass-btn-primary px-4 py-3 flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </div>

          {error && (
            <div className="glass-card-light border border-red-400/30 px-3 py-2 text-red-300 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
