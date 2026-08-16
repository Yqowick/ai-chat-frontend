# AI Chat Frontend — Agent Instructions

## Goal

Build and maintain a responsive AI chat frontend. The application currently uses a mock API and must remain ready to connect to a real backend without changing UI components.

## Stack

- React with TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui with Radix UI
- Lucide React icons
- Oxlint

## Commands

- Install dependencies: `npm install`
- Start development: `npm run dev`
- Run lint checks: `npm run lint`
- Create production build: `npm run build`

## Architecture

- `src/components/ui`: generated shadcn components.
- `src/components/layout`: reusable layout components.
- `src/features/chat/components`: chat UI components.
- `src/features/chat/data`: mock chat data.
- `src/features/chat/hooks`: chat state and behavior.
- `src/features/chat/services`: mock and real API implementations.
- `src/features/chat/types`: TypeScript chat types.
- `src/config`: environment and API configuration.
- `src/pages`: complete application pages.

## Development Rules

- Use the `@/` alias for imports.
- Keep chat logic inside `src/features/chat`.
- Keep API calls out of React UI components.
- UI components must call the API through `chatApi.ts`.
- Preserve the mock/real API switch.
- Use strict TypeScript and avoid `any`.
- Prefer existing shadcn components before creating new UI primitives.
- Keep components accessible and responsive.
- Never add API keys, passwords, tokens, or secrets to frontend code.
- Vite environment variables must start with `VITE_`.
- Do not commit `.env`, `node_modules`, or `dist`.

## API Contract

Request: `POST /api/chat`

Request body: `{ "message": "User question" }`

The response must match the `SendMessageResponse` type defined in `src/features/chat/types/chat.ts`.

## API Modes

- Mock mode: `VITE_USE_MOCK_API=true`
- Real mode: `VITE_USE_MOCK_API=false`
- Backend URL: `VITE_API_BASE_URL=http://localhost:8000/api`

## Before Completing Changes

1. Check the current Git branch.
2. Review existing types and architecture.
3. Make the smallest necessary change.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Review `git status`.
7. Confirm that no secrets are included.