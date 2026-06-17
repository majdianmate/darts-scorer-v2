import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Sidebar from '#/components/Sidebar/Sidebar'
import { useStore } from '../../store/store'
import Header, { HeaderProvider, useHeader } from '#/components/Header/Header'
import { GravityStarsBackground } from '#/components/animate-ui/components/backgrounds/gravity-stars'
import { cn } from '#/lib/utils'
import { getAuthenticatedUser } from '#/features/authentication/service/auth-service'
import { useAuthentication } from '#/features/authentication/hooks/use-authentication'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(['user'])

    if (user) return
    if (typeof window === 'undefined') return

    const authenticatedUser = await getAuthenticatedUser()

    if (!authenticatedUser) {
      throw redirect({ to: '/sign-in' })
    }

    context.queryClient.setQueryData(['user'], authenticatedUser)
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  const { user, isLoading } = useAuthentication()
  if (isLoading || !user) return null

  return (
    <HeaderProvider>
      <ProtectedLayoutContent />
    </HeaderProvider>
  )
}

function ProtectedLayoutContent() {
  const sidebarOpen = useStore((state) => state.sidebarOpen)
  const { header } = useHeader()

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={header.title} buttons={header.buttons} />
        <div className="h-full w-full flex-1 bg-background">
          <main
            className={cn(
              'relative isolate h-full w-full min-w-0 flex-1 overflow-auto bg-background transition-[border-radius] duration-300',
              sidebarOpen && 'rounded-tl-xl',
            )}
          >
            <GravityStarsBackground className="absolute inset-0 z-0" />
            <div className="relative z-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
