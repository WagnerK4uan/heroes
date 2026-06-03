import { hueFor } from '../../data/heroes';

interface AvatarProps {
  name?: string;
  size?: number;
  ring?: boolean;
}

export function Avatar({ name, size = 30, ring = false }: AvatarProps) {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const h = hueFor(name || 'x');
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(150deg, oklch(0.62 0.15 ${h}), oklch(0.5 0.17 ${h}))`,
        boxShadow: ring
          ? '0 0 0 2px var(--surface), 0 0 0 3.5px var(--border-strong)'
          : undefined,
      }}
    >
      {initials}
    </span>
  );
}
