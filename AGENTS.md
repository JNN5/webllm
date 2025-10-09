# AGENTS.md

## Project Overview

This is a WebLLM-powered AI chat application that runs entirely in the browser. It features:

- **Private AI Assistant**: Uses WebLLM to run language models locally in the browser
- **No Data Transmission**: All processing happens client-side, no data leaves the device
- **Thinking Tokens**: Displays AI reasoning process step-by-step
- **Browser Tools**: AI can interact with clipboard, storage, time, and browser info
- **Modern UI**: Glass morphism design with responsive layout

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **AI Engine**: WebLLM (@mlc-ai/web-llm)
- **Styling**: Tailwind CSS + Custom glass effect CSS
- **Routing**: React Router
- **Markdown**: ReactMarkdown for message rendering
- **Icons**: Lucide React

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000, or next available)
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── pages/                    # Page-level components
│   ├── HomePage.tsx         # Main layout and app container
│   ├── ChatPage.tsx         # Main chat interface
│   └── index.ts            # Clean exports
├── components/
│   ├── chat/               # Chat-specific components
│   │   ├── Message.tsx     # Individual message component
│   │   ├── ChatInput.tsx   # Chat input form
│   │   ├── LoadingStates.tsx # Loading states
│   │   └── index.ts        # Clean exports
│   ├── ExamplePrompts.tsx  # Example prompts for new users
│   └── ThinkingComponents.tsx # Thinking & tool calls display
├── hooks/
│   └── useWebLLM.ts        # WebLLM engine management
├── utils/
│   └── tools.ts            # Browser tools (clipboard, storage, etc.)
├── lib/
│   └── utils.ts            # Utility functions
├── main.tsx                # App entry point
└── styles.css              # Global styles & glass effects
```

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- Use functional components with hooks
- Prefer arrow functions for components
- Use explicit return types for hooks and utilities
- Import types using `type` keyword: `import { type ChatMessage }`

### Component Patterns

- **Pages**: Handle layout, routing, and high-level state
- **Components**: Focus on UI rendering and user interaction
- **Hooks**: Manage stateful logic and side effects
- **Utils**: Pure functions and browser APIs

### CSS Guidelines

- Use Tailwind classes for most styling
- Custom CSS in `styles.css` for glass morphism effects
- CSS variables defined in `:root` for consistent theming
- Responsive design with mobile-first approach

### State Management

- React hooks for local state
- `useWebLLM` hook centralizes AI engine management
- Props drilling for simple data flow (no external state management)

## Key Files to Understand

### `src/hooks/useWebLLM.ts`

- Manages WebLLM engine initialization and lifecycle
- Handles message streaming and tool execution
- Contains model configuration (currently uses Qwen3-4B-q4f16_1-MLC)

### `src/utils/tools.ts`

- Defines browser-based tools the AI can use
- Implements clipboard, storage, time, and browser info tools
- Tool execution framework for the AI

### `src/components/chat/Message.tsx`

- Renders individual chat messages
- Handles thinking tokens and tool calls display
- **Important**: Uses CSS classes `.message-user` and `.message-assistant` for positioning
- **Do not use Flexbox wrapper** - let CSS margin auto handle alignment

### `src/styles.css`

- Glass morphism design system
- Message styling (`.message-user`, `.message-assistant`)
- Responsive breakpoints and accessibility features

## Common Tasks

### Adding New Tools

1. Define tool in `src/utils/tools.ts`
2. Add to `AVAILABLE_TOOLS` array
3. Implement execution logic
4. Test with AI prompts

### Modifying UI Components

1. Check existing component structure in `src/components/`
2. Use glass effect classes: `.glass-card`, `.glass-btn-primary`, `.input-glass`
3. Maintain responsive design with mobile breakpoints
4. Test with different message types (thinking, tools, errors)

### Changing AI Model

1. Update model name in `useWebLLM.ts` (line ~59)
2. Ensure model is available in WebLLM catalog
3. Test initialization and performance

### Styling Messages

- **Never use Flexbox on message containers** - breaks CSS positioning
- Use `.message-user` for user messages (right-aligned)
- Use `.message-assistant` for AI messages (left-aligned)
- Classes handle margin, max-width, and border-radius automatically

## Testing Instructions

```bash
# Build test (checks for compilation errors)
npm run build

# Type checking
npx tsc --noEmit

# Manual testing checklist:
# 1. App loads without errors
# 2. Initialize WebLLM button works
# 3. Chat input accepts messages
# 4. Messages display with proper styling
# 5. Thinking tokens expand/collapse
# 6. Tool calls execute and show results
# 7. Example prompts work
# 8. Responsive design on mobile
```

## Known Issues & Considerations

### Performance

- First model download is ~2GB, takes 2-5 minutes
- Model runs entirely in browser memory
- Large models may not work on low-memory devices

### Browser Compatibility

- Requires modern browsers with WebAssembly support
- Best performance in Chrome/Edge with SharedArrayBuffer
- May have limited support in older browsers

### WebLLM Integration

- Model initialization is async and can fail
- Streaming responses require careful state management
- Tool execution happens during message streaming

## Security Notes

- All processing happens client-side
- No API keys or external services required
- Browser tools have limited scope for security
- Clipboard access requires user permission

## Deployment

- Static site - can be deployed to any CDN
- No server-side requirements
- Set correct `basename` in router for subdirectory deployments
- Ensure proper MIME types for `.wasm` files

## AI Agent Tips

### When Working on Messages

- Always preserve the CSS class-based positioning system
- Test message alignment with both user and assistant messages
- Check thinking tokens and tool calls display correctly

### When Adding Features

- Follow the pages → components → hooks pattern
- Keep components focused and reusable
- Use TypeScript interfaces for data structures
- Test with actual AI interactions, not just mock data

### When Debugging

- Check browser console for WebLLM errors
- Verify tool execution in network tab
- Test on different screen sizes
- Ensure accessibility features work

## Common Pitfalls

1. **Message Styling**: Don't use Flexbox wrappers on messages
2. **WebLLM Loading**: Always handle async initialization properly
3. **Tool Execution**: Tools run during streaming - handle state carefully
4. **Responsive Design**: Test on mobile devices, not just browser resize
5. **TypeScript**: Use proper type imports and avoid `any` types
