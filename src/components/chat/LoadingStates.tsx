import { Bot } from 'lucide-react'

export function WebLLMLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center">
          <Bot size={32} className="text-[#14213d]" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">
          Loading Chat Interface...
        </h3>
        <p className="text-white/70">Preparing WebLLM components</p>
      </div>
    </div>
  )
}

export function InitializationLoading({
  onInit,
  onPreload,
  error,
}: {
  onInit: () => void
  onPreload: () => void
  error: string | null
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center">
          <Bot size={32} className="text-[#14213d]" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Welcome to WebLLM Chat
        </h2>
        <p className="text-white/70 max-w-md">
          Initialize your private AI assistant that runs entirely in your
          browser. No data leaves your device.
        </p>
        <p className="text-sm text-white/50">
          First initialization may take a few minutes and requires internet
          connection to download the model.
        </p>
      </div>
      <button
        onClick={onInit}
        onMouseEnter={onPreload}
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

export function ModelLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center">
          <Bot size={32} className="text-[#14213d]" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">
          Loading AI Model...
        </h3>
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
