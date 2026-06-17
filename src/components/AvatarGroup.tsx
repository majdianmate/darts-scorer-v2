import { type FC } from 'react'
import type { User } from '#/features/authentication/types/user-types'
import Avatar from './Avatar'
import { cn } from '#/lib/utils.ts'

interface AvatarGroupProps {
  users: User[]
  max?: number
  className?: string
}

const AvatarGroup: FC<AvatarGroupProps> = ({
  users,
  max = 3,
  className,
}) => {
  const visibleUsers = users.slice(0, max)
  const overflowCount = users.length - max

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex items-center -space-x-2.5">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="relative transition-transform duration-200 hover:z-10 hover:-translate-y-0.5"
          >
            <Avatar
              name={user.name}
              image={user.image}
              size="sm"
              className="ring-2 ring-background"
            />
          </div>
        ))}

        {overflowCount > 0 && (
          <div className="relative flex size-8 items-center justify-center rounded-full border border-border bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
            +{overflowCount}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarGroup