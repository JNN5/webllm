import { useState } from 'react'
import { useWebLLM } from '../hooks/useWebLLM'
import Message from '../components/chat/Message'
import ChatInput from '../components/chat/ChatInput'
import {
  InitializationLoading,
  ModelLoading,
} from '../components/chat/LoadingStates'
import { ExamplePrompts } from '../components/ExamplePrompts'

export default function ChatPage() {
  const {
    isLoading,
    isInitialized,
    messages,
    error,
    initEngine,
    sendMessage,
    preloadWebLLM,
  } = useWebLLM()
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

  if (!isInitialized && !isLoading) {
    return (
      <InitializationLoading
        onInit={initEngine}
        onPreload={preloadWebLLM}
        error={error}
      />
    )
  }

  if (isLoading) {
    return <ModelLoading />
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
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        user={user}
        setUser={setUser}
        onSendMessage={handleSendMessage}
        isInitialized={isInitialized}
        error={error}
      />
    </div>
  )
}
