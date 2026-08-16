# AI Chat Frontend

A responsive AI chat interface built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

The project currently uses a mock API, allowing frontend development to continue without waiting for the backend. It can switch to the real API using one environment variable.

## Features

- Responsive AI chat interface
- User and assistant message bubbles
- Mock AI responses
- Loading and error states
- Message timestamps and delivery status
- Sources displayed with AI responses
- Automatic scrolling to the latest message
- Clear conversation action
- Enter to send
- Shift + Enter for a new line
- Switchable mock and real API layers
- Accessible shadcn/ui components
- Project-specific AI agent instructions

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Oxlint

## Getting Started

### Prerequisites

Install:

- Node.js 20.19 or later
- npm
- Git

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd ai-chat-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Run lint checks:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Configuration

Create a `.env` file based on `.env.example`.

Use the mock API:

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8000/api
```

Connect to the real backend:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8000/api
```

Restart the development server after changing environment variables.

## API Contract

Endpoint:

```text
POST /api/chat
```

Request:

```json
{
  "message": "What is a RAG system?"
}
```

Expected response:

```json
{
  "message": {
    "id": "message-id",
    "role": "assistant",
    "content": "AI response",
    "createdAt": "2026-08-16T08:00:00.000Z",
    "status": "sent",
    "sourcessources": [
      {
        "title": "Source title",
        "url": "https://example.com"
      }
    ]
  }
}
```

## Project Structure

```text
src/
├── components/
│   ├── layout/
│   └── ui/
├── config/
├── features/
│   └── chat/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── services/
│       └── types/
├── lib/
├── pages/
├── App.tsx
├── index.css
└── main.tsx
```

## API Architecture

The UI imports the unified API function from:

```text
src/features/chat/services/chatApi.ts
```

The API layer selects one of:

```text
mockChatApi.ts
realChatApi.ts
```

This keeps the React components independent from the backend implementation.

## Git Workflow

Frontend work is developed on:

```text
feature/frontend-setup
```

Before committing changes:

```bash
npm run lint
npm run build
git status
```

## AI Tooling

Project-specific AI coding instructions are available in:

```text
CLAUDE.md
```