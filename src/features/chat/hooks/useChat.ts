import { useCallback, useState } from "react"

import { mockMessages } from "@/features/chat/data/mockMessages"
import { sendMessage as sendChatMessage } from "@/features/chat/services/chatApi"
import type { ChatMessage } from "@/features/chat/types/chat"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [isResponding, setIsResponding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim()

      if (!trimmedContent || isResponding) {
        return
      }

      const userMessageId = crypto.randomUUID()

      const userMessage: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: trimmedContent,
        createdAt: new Date().toISOString(),
        status: "sending",
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        userMessage,
      ])

      setIsResponding(true)
      setError(null)

      try {
        const response = await sendChatMessage({
          message: trimmedContent,
        })

        setMessages((currentMessages) => [
          ...currentMessages.map((message) =>
            message.id === userMessageId
              ? { ...message, status: "sent" as const }
              : message,
          ),
          response.message,
        ])
      } catch (caughtError) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === userMessageId
              ? { ...message, status: "error" as const }
              : message,
          ),
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while sending the message.",
        )
      } finally {
        setIsResponding(false)
      }
    },
    [isResponding],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isResponding,
    error,
    sendMessage,
    clearChat,
  }
}