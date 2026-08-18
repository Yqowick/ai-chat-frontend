export type ChatRole = "user" | "assistant"

export type MessageStatus = "sending" | "sent" | "error"

export interface ChatSource {
  title: string
  url?: string
}

export interface ChatMessageVersion {
  id: string
  content: string
  createdAt: string
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

export interface ConversationLastMessage {
  role: ChatRole
  content: string
  createdAt: string
}

export interface ConversationSummary {
  conversationId: string
  title: string
  messageCount: number
  lastMessage: ConversationLastMessage | null
  createdAt: string
  updatedAt: string
}

export interface ConversationListResponse {
  conversations: ConversationSummary[]
}

export interface MessageActionResponse {
  conversationId: string
  message: ChatMessage
}

export interface StreamMessageHandlers {
  onConversationId: (conversationId: string) => void
  onChunk: (text: string) => void
}

export interface StreamMessageResult {
  conversationId: string
}