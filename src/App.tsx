function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-10 text-center shadow-2xl">
        <h1 className="text-4xl font-bold text-white">
          AI Chat Frontend
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          React, TypeScript, Vite and Tailwind CSS are ready.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500">
          Start Chatting
        </button>
      </div>
    </main>
  )
}

export default App