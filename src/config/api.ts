export const apiConfig = {
  baseUrl:
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api",

  useMockApi:
    import.meta.env.VITE_USE_MOCK_API !== "false",
} as const