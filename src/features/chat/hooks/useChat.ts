import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { apiConfig } from "@/config/api"
import { mockMessages } from "@/features/chat/data/mockMessages"
import { loadConversationThreads } from "@/features/chat/services/conversationApi"
import {
  loadConversation,
  streamMessage as streamChatMessage,
} from "@/features/chat/services/chatApi"
import type {
  ChatMessage,
  ConversationSummary,
} from "@/features/chat/types/chat"

const conversationStorageKey =
  "ai-chat-conversation-id"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    apiConfig.useMockApi ? mockMessages : [],
  )

  const [conversationId, setConversationId] = useState<
    string | null
  >(() =>
    apiConfig.useMockApi
      ? null
      : localStorage.getItem(conversationStorageKey),
  )

  const [conversations, setConversations] = useState<
    ConversationSummary[]
  >([])

  const [isResponding, setIsResponding] = useState(false)

  const [isLoadingHistory, setIsLoadingHistory] =
    useState(false)

  const [
    isLoadingConversations,
    setIsLoadingConversations,
  ] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const refreshConversations = useCallback(async () => {
    setIsLoadingConversations(true)

    try {
      const response = await loadConversationThreads()
      setConversations(response.conversations)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load conversations.",
      )
    } finally {
      setIsLoadingConversations(false)
    }
  }, [])

  useEffect(() => {
    void refreshConversations()
  }, [refreshConversations])

  useEffect(() => {
    if (apiConfig.useMockApi || !conversationId) {
      return
    }

    let isCancelled = false

    async function restoreConversation() {
      setIsLoadingHistory(true)
      setError(null)

      try {
        const history = await loadConversation(
          conversationId!,
        )

        if (!isCancelled) {
          setMessages(history.messages)
        }
      } catch (caughtError) {
        if (!isCancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Failed to load the conversation history.",
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingHistory(false)
        }
      }
    }

    void restoreConversation()

    return () => {
      isCancelled = true
    }
  }, [conversationId])

  const selectConversation = useCallback(
    (selectedConversationId: string) => {
      if (
        isResponding ||
        isLoadingHistory ||
        selectedConversationId === conversationId
      ) {
        return
      }

      localStorage.setItem(
        conversationStorageKey,
        selectedConversationId,
      )

      setMessages([])
      setConversationId(selectedConversationId)
      setError(null)
    },
    [
      conversationId,
      isLoadingHistory,
      isResponding,
    ],
  )

  const startNewConversation = useCallback(() => {
    if (isResponding || isLoadingHistory) {
      return
    }

    localStorage.removeItem(conversationStorageKey)

    setConversationId(null)
    setMessages([])
    setError(null)
  }, [isLoadingHistory, isResponding])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim()

      if (
        !trimmedContent ||
        isResponding ||
        isLoadingHistory
      ) {
        return
      }

      const userMessageId = crypto.randomUUID()
      const assistantMessageId = crypto.randomUUID()

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

      let streamConversationId = conversationId

      try {
        const result = await streamChatMessage(
          {
            message: trimmedContent,
            conversationId: conversationId ?? undefined,
          },
          {
            onConversationId: (
              receivedConversationId,
            ) => {
              streamConversationId =
                receivedConversationId
            },

            onChunk: (text) => {
              setMessages((currentMessages) => {
                const assistantMessageExists =
                  currentMessages.some(
                    (message) =>
                      message.id === assistantMessageId,
                  )

                if (!assistantMessageExists) {
                  const assistantMessage: ChatMessage = {
                    id: assistantMessageId,
                    role: "assistant",
                    content: text,
                    createdAt: new Date().toISOString(),
                    status: "sending",
                  }

                  return [
                    ...currentMessages,
                    assistantMessage,
                  ]
                }

                return currentMessages.map((message) =>
                  message.id === assistantMessageId
                    ? {
                        ...message,
                        content: `${message.content}${text}`,
                      }
                    : message,
                )
              })
            },
          },
        )

        const finalConversationId =
          result.conversationId ||
          streamConversationId

        if (finalConversationId) {
          localStorage.setItem(
            conversationStorageKey,
            finalConversationId,
          )

          if (finalConversationId !== conversationId) {
            setConversationId(finalConversationId)
          }
        }

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === userMessageId ||
            message.id === assistantMessageId
              ? {
                  ...message,
                  status: "sent" as const,
                }
              : message,
          ),
        )

        void refreshConversations()
      } catch (caughtError) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === userMessageId ||
            message.id === assistantMessageId
              ? {
                  ...message,
                  status: "error" as const,
                }
              : message,
          ),
        )

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong while streaming the response.",
        )
      } finally {
        setIsResponding(false)
      }
    },
    [
      conversationId,
      isLoadingHistory,
      isResponding,
      refreshConversations,
    ],
  )

  return {
    messages,
    conversationId,
    conversations,
    isResponding,
    isLoadingHistory,
    isLoadingConversations,
    error,
    sendMessage,
    selectConversation,
    startNewConversation,
    clearChat: startNewConversation,
    refreshConversations,
  }
}