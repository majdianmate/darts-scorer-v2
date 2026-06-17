import { usePageHeader } from '#/components/Header/Header'
import { createFileRoute } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { useMemo } from 'react'

export const Route = createFileRoute('/_protected/friends')({
  component: RouteComponent,
})

function RouteComponent() {
  const header = useMemo(
    () => ({
      title: 'Friends',
      buttons: [
        {
          label: 'Add friend',
          icon: UserPlus,
          onClick: () => {
            console.log('Add friend')
          },
        },
      ],
    }),
    [],
  )

  usePageHeader(header)

  return <div>Hello "/_protected/friends"!</div>
}
