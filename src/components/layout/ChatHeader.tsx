import { Bot, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  onClearChat: () => void
}

export function ChatHeader({
  onClearChat,
}: ChatHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bot className="size-5" />
        </div>

        <div>
          <h1 className="font-semibold leading-none">
            AI Knowledge Assistant
          </h1>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />

            <p className="text-xs text-muted-foreground">
              Online · Mock API
            </p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClearChat}
        aria-label="Clear conversation"
        title="Clear conversation"
      >
        <Trash2 className="size-5" />
      </Button>
    </header>
  )
}