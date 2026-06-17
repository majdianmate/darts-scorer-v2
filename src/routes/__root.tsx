import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import { Toaster } from 'sonner'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useStore } from '../../store/store'
import { initAuthSync } from '#/features/authentication/service/auth-service'
import { ThemeProvider } from '../../providers/theme-provider'
import { DialogProvider } from '../../providers/dialog-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'TanStack Start Starter' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const setUser = useStore((state) => state.setUser)
  const clearUser = useStore((state) => state.clearUser)

  useEffect(() => {
    const unsub = initAuthSync((user) => {
      if (user) setUser(user)
      else clearUser()
    })
    return () => unsub()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DialogProvider>
        <div className="relative z-[2] min-h-dvh w-full">
          <Outlet />
        </div>
      </DialogProvider>
      <Toaster />
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-screen w-screen overflow-hidden">
        <Toaster />
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
