import { Send, User } from 'lucide-react'

interface ChatInputProps {
  inputMessage: string
  setInputMessage: (message: string) => void
  user: string
  setUser: (user: string) => void
  onSendMessage: () => void
  isInitialized: boolean
  error: string | null
}

export default function ChatInput({
  inputMessage,
  setInputMessage,
  user,
  setUser,
  onSendMessage,
  isInitialized,
  error,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage()
    }
  }

  return (
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
            onClick={onSendMessage}
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
  )
}
