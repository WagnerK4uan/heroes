export interface CatalogHero {
  id: string;
  name: string;
  initials: string;
  trait: string;
  c: [string, string];
}

export const HEROES: CatalogHero[] = [
  {
    id: 'deadpool',
    name: 'Deadpool',
    initials: 'DP',
    trait: 'Regeneração',
    c: ['oklch(0.56 0.2 25)', 'oklch(0.3 0.11 25)'],
  },
  {
    id: 'superman',
    name: 'Superman',
    initials: 'S',
    trait: 'Força',
    c: ['oklch(0.55 0.16 252)', 'oklch(0.5 0.18 25)'],
  },
  {
    id: 'ironman',
    name: 'Homem de Ferro',
    initials: 'HF',
    trait: 'Tecnologia',
    c: ['oklch(0.58 0.19 30)', 'oklch(0.76 0.15 78)'],
  },
  {
    id: 'spiderman',
    name: 'Homem-Aranha',
    initials: 'HA',
    trait: 'Agilidade',
    c: ['oklch(0.56 0.2 22)', 'oklch(0.5 0.16 255)'],
  },
  {
    id: 'wonderwoman',
    name: 'Mulher-Maravilha',
    initials: 'MM',
    trait: 'Justiça',
    c: ['oklch(0.74 0.14 80)', 'oklch(0.52 0.18 18)'],
  },
];

export function getHero(id: string | null | undefined): CatalogHero | null {
  if (!id) {
    return null;
  }
  return HEROES.find((hero) => hero.id === id) ?? null;
}

const AVATAR_HUES = [280, 255, 200, 155, 25, 330, 95, 45];

export function hueFor(seed: string): number {
  let h = 0;
  for (const ch of seed) {
    h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  }
  return AVATAR_HUES[h % AVATAR_HUES.length];
}
