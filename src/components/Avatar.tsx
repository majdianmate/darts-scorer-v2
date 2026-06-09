import React, { type FC } from 'react'
import type { User } from '../../types/user-types'

interface AvatarProps {
  user: User
  size: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const Avatar: FC<AvatarProps> = ({ user, size, className }) => {
  const initials =
    user.displayName
      ?.split(' ')
      .map((name) => name[0])
      .join('') ||
    user.username.slice(0, 2) ||
    '?'

  const sizeClasses = {
    xs: 'h-5 w-5 text-[9px]',
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  }

  return (
    <div
      className={`relative flex shrink-0 overflow-hidden rounded-full border bg-muted shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {user.image ? (
        <img
          src={user.image || undefined}
          alt={user.displayName || 'User avatar'}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold bg-secondary text-secondary-foreground">
          {initials}
        </div>
      )}
    </div>
  )
}

export default Avatar
