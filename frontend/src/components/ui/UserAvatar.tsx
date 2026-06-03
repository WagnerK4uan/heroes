import { getHero } from '../../data/heroes';
import { Avatar } from './Avatar';
import { HeroBadge } from './HeroBadge';

interface UserAvatarProps {
  user?: { name?: string; character?: string } | null;
  size?: number;
  ring?: boolean;
}

export function UserAvatar({ user, size = 32, ring = false }: UserAvatarProps) {
  const hero = getHero(user?.character);
  if (hero) {
    return <HeroBadge hero={hero} size={size} ring={ring} />;
  }
  return <Avatar name={user?.name} size={size} ring={ring} />;
}
