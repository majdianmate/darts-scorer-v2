import React, { type FC } from 'react'
import type { Friendship } from '../../types/friend-types'

export interface FriendCardProps {
  friend: Friendship
}

const FriendCard: FC<FriendCardProps> = ({ friend }) => {
  return (
    <div>{friend.friend.displayName}</div>
  )
}

export default FriendCard