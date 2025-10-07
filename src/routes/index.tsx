import { createFileRoute } from '@tanstack/react-router'
import WebLLMChatArea from '../components/WebLLMChatArea'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          WebLLM AI Chat
        </h1>
        <p className="text-lg text-white/70">
          Private AI assistant running entirely in your browser
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="w-full max-w-4xl flex-1 flex flex-col min-h-0">
        <div className="chat-container flex-1 flex flex-col p-6">
          <WebLLMChatArea />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mt-4 text-center">
        <p className="text-sm text-white/50">
          No data leaves your device • Powered by WebLLM
        </p>
      </div>
    </div>
  )
}
