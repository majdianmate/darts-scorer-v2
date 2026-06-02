import { type FC } from 'react'

import Avatar from '#/components/Avatar'
import { cn } from '#/lib/utils'

import { teamCardPlayerRingStyle } from './team-card-utils'

type TeamCardPlayerAvatarSize = 'lg' | 'sm'

interface TeamCardPlayerAvatarProps {
  name: string
  image: string
  isActive: boolean
  accent: string
  size?: TeamCardPlayerAvatarSize
  className?: string
}

const SIZE_CONFIG: Record<
  TeamCardPlayerAvatarSize,
  { avatar: string; ringPadding: string; dashInset: string; borderWidth: string }
> = {
  lg: {
    avatar: 'h-14 w-14 text-base',
    ringPadding: 'p-[3px]',
    dashInset: '-inset-[6px]',
    borderWidth: 'border-2',
  },
  sm: {
    avatar: 'border-2 border-zinc-950/90',
    ringPadding: 'p-[2px]',
    dashInset: '-inset-[5px]',
    borderWidth: 'border-[1.5px]',
  },
}

const TeamCardPlayerAvatar: FC<TeamCardPlayerAvatarProps> = ({
  name,
  image,
  isActive,
  accent,
  size = 'lg',
  className,
}) => {
  const config = SIZE_CONFIG[size]

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0',
        isActive && size === 'lg' && 'scale-[1.03]',
        isActive && size === 'sm' && 'scale-[1.02]',
        className,
      )}
    >
      {isActive ? (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute rounded-full border-dashed border-foreground/50 motion-safe:animate-[spin_12s_linear_infinite] motion-reduce:animate-none',
            config.dashInset,
            config.borderWidth,
          )}
        />
      ) : null}

      <div
        className={cn('relative rounded-full', config.ringPadding)}
        style={teamCardPlayerRingStyle(accent, isActive)}
      >
        <Avatar
          name={name}
          image={image}
          size={size === 'lg' ? 'lg' : 'sm'}
          className={cn(
            size === 'lg' && 'h-14 w-14 border-2 border-zinc-950/90 text-base shadow-sm',
            size === 'sm' && config.avatar,
            !isActive && (size === 'lg' ? 'opacity-75 saturate-[0.85]' : 'opacity-70'),
          )}
        />
      </div>
    </div>
  )
}

export default TeamCardPlayerAvatar
