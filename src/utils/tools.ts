export interface ThinkingStep {
  id: string
  content: string
  timestamp: number
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
  error?: string
}

export interface Tool {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
    }>
    required: string[]
  }
  implementation: (args: Record<string, any>) => Promise<any> | any
}

export const browserTools: Tool[] = [
  {
    name: 'get_current_time',
    description: 'Get the current date and time',
    parameters: {
      type: 'object',
      properties: {
        format: {
          type: 'string',
          description: 'Format for the time (ISO, locale, or timestamp)',
          enum: ['ISO', 'locale', 'timestamp']
        }
      },
      required: []
    },
    implementation: (args) => {
      const now = new Date()
      switch (args.format) {
        case 'ISO':
          return now.toISOString()
        case 'timestamp':
          return now.getTime()
        case 'locale':
        default:
          return now.toLocaleString()
      }
    }
  },
  {
    name: 'copy_to_clipboard',
    description: 'Copy text to the clipboard',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Text to copy to clipboard'
        }
      },
      required: ['text']
    },
    implementation: async (args) => {
      try {
        await navigator.clipboard.writeText(args.text)
        return { success: true, message: 'Text copied to clipboard' }
      } catch (error) {
        return { success: false, error: 'Failed to copy to clipboard' }
      }
    }
  },
  {
    name: 'read_from_clipboard',
    description: 'Read text from the clipboard',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    implementation: async () => {
      try {
        const text = await navigator.clipboard.readText()
        return { success: true, text }
      } catch (error) {
        return { success: false, error: 'Failed to read from clipboard or permission denied' }
      }
    }
  },
  {
    name: 'store_data',
    description: 'Store data in browser local storage',
    parameters: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Storage key'
        },
        value: {
          type: 'string',
          description: 'Value to store (will be JSON stringified if object)'
        }
      },
      required: ['key', 'value']
    },
    implementation: (args) => {
      try {
        const valueToStore = typeof args.value === 'object' 
          ? JSON.stringify(args.value) 
          : String(args.value)
        localStorage.setItem(`webllm_${args.key}`, valueToStore)
        return { success: true, message: `Data stored with key: ${args.key}` }
      } catch (error) {
        return { success: false, error: 'Failed to store data' }
      }
    }
  },
  {
    name: 'retrieve_data',
    description: 'Retrieve data from browser local storage',
    parameters: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Storage key to retrieve'
        }
      },
      required: ['key']
    },
    implementation: (args) => {
      try {
        const value = localStorage.getItem(`webllm_${args.key}`)
        if (value === null) {
          return { success: false, error: 'Key not found' }
        }
        
        // Try to parse as JSON, fallback to string
        try {
          const parsed = JSON.parse(value)
          return { success: true, value: parsed }
        } catch {
          return { success: true, value }
        }
      } catch (error) {
        return { success: false, error: 'Failed to retrieve data' }
      }
    }
  },
  {
    name: 'get_page_info',
    description: 'Get information about the current page',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    implementation: () => {
      return {
        url: window.location.href,
        title: document.title,
        hostname: window.location.hostname,
        userAgent: navigator.userAgent,
        language: navigator.language,
        onlineStatus: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      }
    }
  },
  {
    name: 'calculate',
    description: 'Perform mathematical calculations safely',
    parameters: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'Mathematical expression to evaluate (basic operations only)'
        }
      },
      required: ['expression']
    },
    implementation: (args) => {
      try {
        // Simple safe math evaluation - only allow numbers and basic operations
        const sanitized = args.expression.replace(/[^0-9+\-*/.() ]/g, '')
        if (sanitized !== args.expression) {
          return { success: false, error: 'Invalid characters in expression' }
        }
        
        const result = Function(`"use strict"; return (${sanitized})`)()
        return { success: true, result, expression: args.expression }
      } catch (error) {
        return { success: false, error: 'Invalid mathematical expression' }
      }
    }
  }
]

export async function executeTool(toolName: string, args: Record<string, any>) {
  const tool = browserTools.find(t => t.name === toolName)
  if (!tool) {
    throw new Error(`Tool '${toolName}' not found`)
  }
  
  try {
    const result = await tool.implementation(args)
    return { success: true, result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export function getToolsPrompt(): string {
  return `You are an AI assistant with access to browser-based tools. You MUST always respond with valid JSON in the exact format specified below.

Available tools:
${browserTools.map(tool => `**${tool.name}**: ${tool.description}
Parameters: ${JSON.stringify(tool.parameters, null, 2)}`).join('\n\n')}

CRITICAL: You MUST ALWAYS respond with a valid JSON object. Never respond with plain text.

For requests that need tools:
{
  "thinking": ["I need to analyze this request", "This requires using X tool", "Let me call the tool with these parameters"],
  "tool_calls": [
    {
      "name": "tool_name",
      "arguments": { "param": "value" }
    }
  ],
  "response": "Your response to the user explaining what you did"
}

For requests that don't need tools:
{
  "thinking": ["Let me think about this", "This is a straightforward question", "I can answer directly"],
  "response": "Your direct answer to the user"
}

IMPORTANT RULES:
1. ALWAYS respond with valid JSON only
2. ALWAYS include "thinking" array with your reasoning steps
3. Use "tool_calls" array only when tools are needed
4. ALWAYS include "response" with your final answer
5. Never include any text outside the JSON object
6. Think step by step in the "thinking" array`
}