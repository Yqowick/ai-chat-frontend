import {
  Bot,
  Menu,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { apiConfig } from "@/config/api"

interface ChatHeaderProps {
  isBusy: boolean
  onNewConversation: () => void
  onToggleSidebar: () => void
}

export function ChatHeader({
  isBusy,
  onNewConversation,
  onToggleSidebar,
}: ChatHeaderProps) {
  const apiLabel = apiConfig.useMockApi
    ? "Mock API"
    : "Gemini API"

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onToggleSidebar}
          aria-label="Open conversations"
          title="Open conversations"
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bot className="size-5" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate font-semibold leading-none">
            AI Knowledge Assistant
          </h1>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="truncate text-xs text-muted-foreground">
              Online {"\u00B7"} {apiLabel}
            </p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={onNewConversation}
        disabled={isBusy}
        aria-label="Start new conversation"
        title="Start new conversation"
      >
        <Plus className="size-5" />
      </Button>
    </header>
  )
}