# AI Chat Frontend

A responsive AI knowledge assistant built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

The application connects to a Node.js backend powered by Gemini, MongoDB, Server-Sent Events, and Wikipedia-grounded citations.

## Features

- Responsive React chat interface
- Real Gemini API integration
- Server-Sent Events response streaming
- Markdown and GFM rendering
- Code syntax highlighting
- Copy-to-clipboard for code blocks
- Loading indicator and error UI
- Chat message state management
- Automatic scrolling
- Conversation persistence
- Thread list and conversation resume
- Responsive mobile conversation sidebar
- Inline citations with hover tooltips
- Wikipedia source links
- Response regeneration
- Response version switching
- Persistent thumbs up/down feedback modal
- Response metadata accordion
- In-app guided tour
- Mock API development mode
- Project-specific AI instructions

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- React Markdown
- Remark GFM
- Rehype Highlight
- Highlight.js
- Lucide React
- Oxlint

## Prerequisites

Install:

- Node.js 20 or later
- npm
- Git

The backend should run on:

```text
http://localhost:8000
```

## Setup in Under 5 Minutes

Clone the repository:

```powershell
git clone https://github.com/Yqowick/ai-chat-frontend.git

cd ai-chat-frontend
```

Install dependencies:

```powershell
npm install
```

Create the local environment file:

```powershell
Copy-Item .env.example .env.local
```

The real backend configuration is:

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8000/api
```

Start the frontend:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

## Full-Stack Startup

Open two PowerShell terminals.

### Terminal 1: Backend

```powershell
cd "D:\Projects\AI-Chat-Project\backend"

npm run dev
```

Backend URL:

```text
http://localhost:8000
```

### Terminal 2: Frontend

```powershell
cd "D:\Projects\AI-Chat-Project\frontend"

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment Configuration

### Real Backend

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8000/api
```

### Mock API

```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:8000/api
```

Restart Vite after changing environment variables.

## Available Scripts

Start the development server:

```powershell
npm run dev
```

Create a production build:

```powershell
npm run build
```

Run lint checks:

```powershell
npm run lint
```

Preview the production build:

```powershell
npm run preview
```

## Final Verification

```powershell
npm run build

npm run lint
```

The expected lint result is:

```text
0 errors
```

A non-blocking Fast Refresh warning may appear for the shared shadcn button variants.

## Happy Path

1. Open the application.
2. Start a new conversation.
3. Send a question.
4. Watch the answer stream into the interface.
5. Hover over an inline citation.
6. Open its Wikipedia source.
7. Regenerate the answer.
8. Switch between response versions.
9. Submit thumbs up or thumbs down feedback.
10. Open response metadata.
11. Refresh the page.
12. Resume the saved conversation.
13. Run the guided tour.

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/chat/stream` | Stream a Gemini answer |
| GET | `/api/conversations` | Load conversation threads |
| GET | `/api/conversations/:conversationId` | Resume a conversation |
| POST | `/api/conversations/:conversationId/messages/:messageId/regenerate` | Regenerate an answer |
| PATCH | `/api/conversations/:conversationId/messages/:messageId/versions/:versionIndex` | Switch response version |
| PUT | `/api/conversations/:conversationId/messages/:messageId/feedback` | Save feedback |

## Citation Experience

The backend returns Markdown citation links and source metadata.

Example:

```markdown
Node.js was created by Ryan Dahl [[1]](https://en.wikipedia.org/wiki/Ryan_Dahl).
```

The frontend:

- Renders citation numbers inline
- Shows source details on hover
- Opens the original Wikipedia page
- Restores citations after refresh
- Preserves sources across response versions

## Conversation Persistence

The frontend stores the active conversation ID locally.

MongoDB stores:

- Conversations and messages
- Response versions
- Active response version
- Citation sources
- Feedback
- Creation and update timestamps

The conversation sidebar loads saved threads and allows users to resume previous chats.

## Project Structure

```text
frontend/
  src/
    components/
      layout/
      ui/
    config/
    features/
      chat/
        components/
        data/
        hooks/
        services/
        styles/
        types/
    lib/
    pages/
    App.tsx
    index.css
    main.tsx
  .env.example
  CLAUDE.md
  package.json
```

## API Architecture

The frontend uses:

```text
src/features/chat/services/chatApi.ts
```

It switches between:

```text
mockChatApi.ts
realChatApi.ts
```

Separate service modules handle:

- Conversation threads
- Response versions
- Persistent feedback

## Guided Tour

The guided tour:

- Starts automatically for first-time users
- Highlights major interface areas
- Includes Next, Back, Finish, and Close controls
- Saves completion in local storage
- Can be restarted with the Tour button

## AI Customization Artifact

Project-specific AI instructions are checked into:

```text
CLAUDE.md
```

The file defines project architecture, coding conventions, API boundaries, and verification requirements.

## Backend Repository

```text
https://github.com/Yqowick/ai-chat-backend
```

## Security

- `.env.local` is ignored by Git.
- The Gemini API key exists only in the backend.
- The frontend never stores the Gemini API key.
- External citation links open in a separate tab.