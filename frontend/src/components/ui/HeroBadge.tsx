import type { CatalogHero } from '../../data/heroes';

interface HeroBadgeProps {
  hero: CatalogHero | null;
  size?: number;
  ring?: boolean;
}

export function HeroBadge({ hero, size = 32, ring = false }: HeroBadgeProps) {
  if (!hero) {
    return null;
  }
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        letterSpacing: '-0.02em',
        background: `linear-gradient(150deg, ${hero.c[0]}, ${hero.c[1]})`,
        boxShadow: ring
          ? '0 0 0 2px var(--surface), 0 0 0 3.5px var(--border-strong)'
          : undefined,
      }}
    >
      {hero.initials}
    </span>
  );
}
