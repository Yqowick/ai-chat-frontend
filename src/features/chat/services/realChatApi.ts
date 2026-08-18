import { apiConfig } from "@/config/api"
import type {
  ChatMessage,
  ChatRole,
  ConversationHistoryResponse,
  FeedbackRating,
  SendMessageRequest,
  SendMessageResponse,
  StreamMessageHandlers,
  StreamMessageResult,
} from "@/features/chat/types/chat"

interface ApiMessageVersion {
  id: string
  content: string
  createdAt: string
}

interface ApiMessageFeedback {
  rating: FeedbackRating
  comment: string
  createdAt: string
  updatedAt: string
}

interface ApiMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  versions?: ApiMessageVersion[]
  activeVersionIndex?: number
  feedback?: ApiMessageFeedback
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

interface ApiStreamEventData {
  conversationId?: string
  text?: string
  message?: string
}

function toChatMessage(
  message: ApiMessage,
): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    status: "sent",
    versions: message.versions,
    activeVersionIndex:
      message.activeVersionIndex,
    feedback: message.feedback,
  }
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

export async function sendRealMessage(
  request: SendMessageRequest,
): Promise<SendMessageResponse> {
  const response = await fetch(
    `${apiConfig.baseUrl}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data =
    (await response.json()) as ApiSendMessageResponse

  const assistantMessage = [...data.messages]
    .reverse()
    .find(
      (message) => message.role === "assistant",
    )

  if (!assistantMessage) {
    throw new Error(
      "The server did not return an assistant message.",
    )
  }

  return {
    conversationId: data.conversationId,
    message: toChatMessage(assistantMessage),
  }
}

export async function streamRealMessage(
  request: SendMessageRequest,
  handlers: StreamMessageHandlers,
): Promise<StreamMessageResult> {
  const response = await fetch(
    `${apiConfig.baseUrl}/chat/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported by this browser.",
    )
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let buffer = ""
  let resolvedConversationId =
    request.conversationId || ""

  while (true) {
    const { value, done } = await reader.read()

    if (done) {
      break
    }

    buffer += decoder.decode(value, {
      stream: true,
    })

    buffer = buffer.replace(/\r\n/g, "\n")

    const eventBlocks = buffer.split("\n\n")

    buffer = eventBlocks.pop() || ""

    for (const eventBlock of eventBlocks) {
      if (!eventBlock.trim()) {
        continue
      }

      const lines = eventBlock.split("\n")

      const eventLine = lines.find((line) =>
        line.startsWith("event:"),
      )

      const dataLines = lines
        .filter((line) =>
          line.startsWith("data:"),
        )
        .map((line) =>
          line.slice(5).trim(),
        )

      if (dataLines.length === 0) {
        continue
      }

      const eventName = eventLine
        ? eventLine.slice(6).trim()
        : "message"

      const eventData = JSON.parse(
        dataLines.join("\n"),
      ) as ApiStreamEventData

      if (
        eventName === "conversation" &&
        eventData.conversationId
      ) {
        resolvedConversationId =
          eventData.conversationId

        handlers.onConversationId(
          eventData.conversationId,
        )
      }

      if (
        eventName === "chunk" &&
        eventData.text
      ) {
        handlers.onChunk(eventData.text)
      }

      if (eventName === "done") {
        if (eventData.conversationId) {
          resolvedConversationId =
            eventData.conversationId
        }
      }

      if (eventName === "error") {
        throw new Error(
          eventData.message ||
            "The response stream failed.",
        )
      }
    }
  }

  if (!resolvedConversationId) {
    throw new Error(
      "The server did not return a conversation ID.",
    )
  }

  return {
    conversationId: resolvedConversationId,
  }
}

export async function getRealConversation(
  conversationId: string,
): Promise<ConversationHistoryResponse> {
  const response = await fetch(
    `${apiConfig.baseUrl}/conversations/${encodeURIComponent(
      conversationId,
    )}`,
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