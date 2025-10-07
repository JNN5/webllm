import { Bot, Clock, Calculator, Clipboard, Database, Globe, Copy } from 'lucide-react'

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void
  disabled?: boolean
}

const examplePrompts = [
  {
    icon: Calculator,
    title: "Math with Thinking",
    prompt: "Calculate the compound interest on $1000 invested at 5% annually for 3 years. Show your step-by-step reasoning.",
    description: "Demonstrates thinking tokens with mathematical calculations"
  },
  {
    icon: Clock,
    title: "Time Tools",
    prompt: "What time is it now? Also, calculate how many hours until midnight.",
    description: "Shows tool usage for time operations"
  },
  {
    icon: Clipboard,
    title: "Clipboard Operations",
    prompt: "Copy the text 'Hello from WebLLM!' to my clipboard, then read what's currently in my clipboard.",
    description: "Demonstrates clipboard read/write tools"
  },
  {
    icon: Database,
    title: "Data Storage",
    prompt: "Store my favorite color as 'blue' in browser storage, then retrieve it to confirm it was saved.",
    description: "Shows browser storage capabilities"
  },
  {
    icon: Globe,
    title: "Browser Info",
    prompt: "Tell me about this webpage and my browser environment. Think through what information would be most useful.",
    description: "Combines thinking with browser information tools"
  }
]

export function ExamplePrompts({ onSelectPrompt, disabled }: ExamplePromptsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fca311] to-[#ff9500] flex items-center justify-center mx-auto mb-3">
          <Bot size={24} className="text-[#14213d]" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Try these examples</h3>
        <p className="text-white/60 text-sm">
          Explore thinking tokens and browser-based AI tools
        </p>
      </div>
      
      <div className="grid gap-3">
        {examplePrompts.map((example, index) => {
          const IconComponent = example.icon
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(example.prompt)}
              disabled={disabled}
              className="glass-card-light p-3 text-left hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#fca311]/30 transition-colors">
                  <IconComponent size={16} className="text-[#fca311]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-white text-sm">
                      {example.title}
                    </h4>
                    <Copy size={12} className="text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {example.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
      
      <div className="text-center">
        <p className="text-xs text-white/40">
          💡 Try asking questions that require reasoning or use browser capabilities
        </p>
      </div>
    </div>
  )
}