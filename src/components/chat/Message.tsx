import { Bot, User, Loader2 } from 'lucide-react'
import { ThinkingSection, ToolCallsSection } from '../ThinkingComponents'
import { type ChatMessage } from '../../hooks/useWebLLM'
import ReactMarkdown from 'react-markdown'

interface MessageProps {
  message: ChatMessage
  currentUser: string
}

export default function Message({ message, currentUser }: MessageProps) {
  const isCurrentUser = message.user === currentUser
  const isBot = message.isBot

  return (
    <div className="mb-4 fade-in">
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
