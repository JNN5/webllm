import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Loader2, Bot } from 'lucide-react'
import './styles.css'

// Lazy load the WebLLM component to reduce initial bundle size
const WebLLMChatArea = lazy(() => import('./components/WebLLMChatArea'))

// Loading component for the WebLLM chat area
function WebLLMLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center">
          <Bot size={32} className="text-[#14213d]" />
        </div>
        <Loader2 size={24} className="absolute -top-1 -right-1 text-[#fca311] animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Loading Chat Interface...</h3>
        <p className="text-white/70">
          Preparing WebLLM components
        </p>
      </div>
    </div>
  )
}

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
          <Suspense fallback={<WebLLMLoading />}>
            <WebLLMChatArea />
          </Suspense>
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

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#14213d] via-[#1a2a4a] to-[#0f1b36]">
      <HomePage />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
], {
  basename: import.meta.env.PROD ? "/webllm" : undefined,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)