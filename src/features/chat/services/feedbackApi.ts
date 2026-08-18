import { apiConfig } from "@/config/api"
import type {
  ChatMessage,
  FeedbackRating,
  MessageActionResponse,
} from "@/features/chat/types/chat"

interface ApiFeedbackResponse {
  conversationId: string
  message: Omit<ChatMessage, "status">
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

export async function submitAssistantFeedback(
  conversationId: string,
  messageId: string,
  rating: FeedbackRating,
  comment: string,
): Promise<MessageActionResponse> {
  const response = await fetch(
    `${apiConfig.baseUrl}/conversations/${encodeURIComponent(
      conversationId,
    )}/messages/${encodeURIComponent(
      messageId,
    )}/feedback`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
        comment,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data =
    (await response.json()) as ApiFeedbackResponse

  return {
    conversationId: data.conversationId,
    message: {
      ...data.message,
      status: "sent",
    },
  }
}