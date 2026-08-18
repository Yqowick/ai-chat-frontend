import { apiConfig } from "@/config/api"
import { mockMessages } from "@/features/chat/data/mockMessages"
import type {
  ChatRole,
  ConversationListResponse,
  ConversationSummary,
} from "@/features/chat/types/chat"

interface ApiConversationLastMessage {
  role: ChatRole
  content: string
  createdAt: string
}

interface ApiConversationSummary {
  conversationId: string
  title: string
  messageCount: number
  lastMessage: ApiConversationLastMessage | null
  createdAt: string
  updatedAt: string
}

interface ApiConversationListResponse {
  conversations: ApiConversationSummary[]
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: string
    }

    return (
      data.error ||
      "The server returned an unexpected error."
    )
  } catch {
    return "The server returned an unexpected error."
  }
}

function createMockConversationList(): ConversationListResponse {
  const firstMessage = mockMessages.at(0)
  const lastMessage = mockMessages.at(-1)
  const now = new Date().toISOString()

  const mockConversation: ConversationSummary = {
    conversationId: "mock-conversation",
    title: firstMessage?.content || "Mock conversation",
    messageCount: mockMessages.length,
    lastMessage: lastMessage
      ? {
          role: lastMessage.role,
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
        }
      : null,
    createdAt: firstMessage?.createdAt || now,
    updatedAt: lastMessage?.createdAt || now,
  }

  return {
    conversations: [mockConversation],
  }
}

export async function loadConversationThreads(): Promise<ConversationListResponse> {
  if (apiConfig.useMockApi) {
    return createMockConversationList()
  }

  const response = await fetch(
    `${apiConfig.baseUrl}/conversations`,
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data =
    (await response.json()) as ApiConversationListResponse

  return {
    conversations: data.conversations.map(
      (conversation) => ({
        conversationId: conversation.conversationId,
        title: conversation.title,
        messageCount: conversation.messageCount,
        lastMessage: conversation.lastMessage,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      }),
    ),
  }
}