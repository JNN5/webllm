import { useState } from 'react'
import { ChevronDown, ChevronRight, Brain, Settings, CheckCircle, XCircle } from 'lucide-react'
import { type ThinkingStep, type ToolCall } from '../utils/tools'
import ReactMarkdown from 'react-markdown'

interface ThinkingSectionProps {
  thinking: ThinkingStep[]
}

export function ThinkingSection({ thinking }: ThinkingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!thinking || thinking.length === 0) return null

  return (
    <div className="mb-3 border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-blue-400" />
        ) : (
          <ChevronRight size={16} className="text-blue-400" />
        )}
        <Brain size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-blue-400">
          Thinking ({thinking.length} steps)
        </span>
      </button>
      
      {isExpanded && (
        <div className="p-3 bg-white/5 border-t border-white/10">
          <div className="space-y-2">
            {thinking.map((step, index) => (
              <div key={step.id} className="flex gap-2">
                <span className="text-xs text-white/40 mt-1 min-w-6">
                  {index + 1}.
                </span>
                <div className="text-sm text-white/80 leading-relaxed">
                  <ReactMarkdown>{step.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface ToolCallsSectionProps {
  toolCalls: ToolCall[]
}

export function ToolCallsSection({ toolCalls }: ToolCallsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Show tools by default

  if (!toolCalls || toolCalls.length === 0) return null

  return (
    <div className="mb-3 border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-green-400" />
        ) : (
          <ChevronRight size={16} className="text-green-400" />
        )}
        <Settings size={16} className="text-green-400" />
        <span className="text-sm font-medium text-green-400">
          Tools Used ({toolCalls.length})
        </span>
      </button>
      
      {isExpanded && (
        <div className="p-3 bg-white/5 border-t border-white/10 space-y-3">
          {toolCalls.map((toolCall) => (
            <div key={toolCall.id} className="border border-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {toolCall.error ? (
                  <XCircle size={16} className="text-red-400" />
                ) : (
                  <CheckCircle size={16} className="text-green-400" />
                )}
                <span className="text-sm font-medium text-white">
                  {toolCall.name}
                </span>
              </div>
              
              {/* Arguments */}
              <div className="mb-2">
                <div className="text-xs text-white/60 mb-1">Arguments:</div>
                <div className="text-xs font-mono bg-black/20 p-2 rounded border border-white/5">
                  {JSON.stringify(toolCall.arguments, null, 2)}
                </div>
              </div>
              
              {/* Result or Error */}
              {toolCall.error ? (
                <div>
                  <div className="text-xs text-red-400 mb-1">Error:</div>
                  <div className="text-xs text-red-300 bg-red-500/10 p-2 rounded border border-red-500/20">
                    {toolCall.error}
                  </div>
                </div>
              ) : toolCall.result !== undefined ? (
                <div>
                  <div className="text-xs text-green-400 mb-1">Result:</div>
                  <div className="text-xs font-mono bg-green-500/10 p-2 rounded border border-green-500/20 text-green-100">
                    {typeof toolCall.result === 'object' 
                      ? JSON.stringify(toolCall.result, null, 2)
                      : String(toolCall.result)
                    }
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}