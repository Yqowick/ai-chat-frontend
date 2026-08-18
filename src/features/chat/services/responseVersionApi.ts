import { apiConfig } from "@/config/api"
import type {
  ChatMessage,
  ChatMessageVersion,
  ChatRole,
  MessageActionResponse,
} from "@/features/chat/types/chat"

interface ApiMessageVersion {
  id: string
  content: string
  createdAt: string
}

interface ApiAssistantMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  versions?: ApiMessageVersion[]
  activeVersionIndex?: number
}

interface ApiMessageActionResponse {
  conversationId: string
  message: ApiAssistantMessage
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

function mapVersion(
  version: ApiMessageVersion,
): ChatMessageVersion {
  return {
    id: version.id,
    content: version.content,
    createdAt: version.createdAt,
  }
}

function mapAssistantMessage(
  message: ApiAssistantMessage,
): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    status: "sent",
    versions: message.versions?.map(mapVersion),
    activeVersionIndex:
      message.activeVersionIndex ?? 0,
  }
}

export async function regenerateAssistantResponse(
  conversationId: string,
  messageId: string,
): Promise<MessageActionResponse> {
  const response = await fetch(
    `${apiConfig.baseUrl}/conversations/${encodeURIComponent(
      conversationId,
    )}/messages/${encodeURIComponent(
      messageId,
    )}/regenerate`,
    {
      method: "POST",
    },
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data =
    (await response.json()) as ApiMessageActionResponse

  return {
    conversationId: data.conversationId,
    message: mapAssistantMessage(data.message),
  }
}

export async function switchAssistantResponseVersion(
  conversationId: string,
  messageId: string,
  versionIndex: number,
): Promise<MessageActionResponse> {
  const response = await fetch(
    `${apiConfig.baseUrl}/conversations/${encodeURIComponent(
      conversationId,
    )}/messages/${encodeURIComponent(
      messageId,
    )}/versions/${versionIndex}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data =
    (await response.json()) as ApiMessageActionResponse

  return {
    conversationId: data.conversationId,
    message: mapAssistantMessage(data.message),
  }
}