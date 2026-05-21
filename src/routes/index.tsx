import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-8">
        <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
        <p className="mt-4 text-lg">
          Edit <code>src/routes/index.tsx</code> to get started.
        </p>
      </div>
    </QueryClientProvider>
  )
}
