import React from 'react'
import { useStore } from '../../../store/store';
import FriendCard from './components/FriendCard/FriendCard';

const Friends = () => {
  const friends = useStore((state) => state.friends);
  return (
    <div>
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  )
}

export default Friends