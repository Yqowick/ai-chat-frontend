import { apiConfig } from "@/config/api"
import type {
  ChatMessage,
  ChatRole,
  ConversationHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "@/features/chat/types/chat"

interface ApiMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
}

interface ApiSendMessageResponse {
  conversationId: string
  reply: string
  messages: ApiMessage[]
}

interface ApiConversationHistoryResponse {
  conversationId: string
  title: string
  messages: ApiMessage[]
  createdAt: string
  updatedAt: string
}

function toChatMessage(message: ApiMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    status: "sent",
  }
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: string
    }

    return data.error || "The server returned an unexpected error."
  } catch {
    return "The server returned an unexpected error."
  }
}

export async function sendRealMessage(
  request: SendMessageRequest,
): Promise<SendMessageResponse> {
  const response = await fetch(`${apiConfig.baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data = (await response.json()) as ApiSendMessageResponse

  const assistantMessage = [...data.messages]
    .reverse()
    .find((message) => message.role === "assistant")

  if (!assistantMessage) {
    throw new Error("The server did not return an assistant message.")
  }

  return {
    conversationId: data.conversationId,
    message: toChatMessage(assistantMessage),
  }
}

export async function getRealConversation(
  conversationId: string,
): Promise<ConversationHistoryResponse> {
  const response = await fetch(
    `${apiConfig.baseUrl}/conversations/${encodeURIComponent(conversationId)}`,
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data =
    (await response.json()) as ApiConversationHistoryResponse

  return {
    conversationId: data.conversationId,
    title: data.title,
    messages: data.messages.map(toChatMessage),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}