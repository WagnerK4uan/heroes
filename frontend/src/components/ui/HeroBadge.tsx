import type { CatalogHero } from '../../data/heroes';
import { HERO_ICONS } from './heroIcons';

interface HeroBadgeProps {
  hero: CatalogHero | null;
  size?: number;
  ring?: boolean;
}

export function HeroBadge({ hero, size = 32, ring = false }: HeroBadgeProps) {
  if (!hero) {
    return null;
  }
  const icon = HERO_ICONS[hero.id];
  return (
    <span
      className="avatar"
      style={{
        position: 'relative',
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
      {icon ? (
        <>
          <span
            style={{
              position: 'absolute',
              inset: size * 0.1,
              borderRadius: '50%',
              background: 'white',
            }}
          />
          <img
            src={icon}
            alt={hero.name}
            style={{
              position: 'relative',
              width: size * 0.66,
              height: size * 0.66,
              objectFit: 'contain',
            }}
          />
        </>
      ) : (
        hero.initials
      )}
    </span>
  );
}
