export type ChatRole =
  | "user"
  | "assistant"

export type MessageStatus =
  | "sending"
  | "sent"
  | "error"

export type FeedbackRating =
  | "up"
  | "down"

export interface ChatSource {
  citationNumber?: number
  title: string
  url?: string
}

export interface ChatMessageVersion {
  id: string
  content: string
  createdAt: string
  sources?: ChatSource[]
}

export interface ChatMessageFeedback {
  rating: FeedbackRating
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  status: MessageStatus
  sources?: ChatSource[]
  versions?: ChatMessageVersion[]
  activeVersionIndex?: number
  feedback?: ChatMessageFeedback
}

export interface SendMessageRequest {
  message: string
  conversationId?: string
}

export interface SendMessageResponse {
  conversationId?: string
  message: ChatMessage
}

export interface ConversationHistoryResponse {
  conversationId: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface StreamMessageHandlers {
  onConversationId: (
    conversationId: string,
  ) => void

  onChunk: (
    text: string,
  ) => void
}

export interface StreamMessageResult {
  conversationId: string
}

export interface ConversationLastMessage {
  role: ChatRole
  content: string
  createdAt: string
}

export interface ConversationSummary {
  conversationId: string
  title: string
  messageCount: number
  lastMessage:
    | ConversationLastMessage
    | null
  createdAt: string
  updatedAt: string
}

export interface ConversationListResponse {
  conversations:
    ConversationSummary[]
}

export interface MessageActionResponse {
  conversationId: string
  message: ChatMessage
}