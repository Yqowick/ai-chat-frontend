import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <section className="w-full max-w-lg rounded-2xl border bg-card p-10 text-center shadow-xl">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Frontend setup
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          AI Chat Frontend
        </h1>

        <p className="mt-4 text-muted-foreground">
          React, TypeScript, Tailwind CSS and shadcn/ui are ready.
        </p>

        <Button className="mt-6">
          Start Chatting
        </Button>
      </section>
    </main>
  )
}

export default App