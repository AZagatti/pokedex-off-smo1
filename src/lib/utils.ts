export const idFromResourceUrl = (url: string): number => {
  const match = /\/(?<id>\d+)\/?$/u.exec(url);
  return match ? Number(match.groups?.id) : 0;
};

export const formatDexNumber = (id: number): string =>
  `#${String(id).padStart(3, "0")}`;

export const capitalize = (value: string): string =>
  value.length === 0 ? value : value[0].toUpperCase() + value.slice(1);

export const formatPokemonName = (name: string): string =>
  name
    .split("-")
    .map((part) => capitalize(part))
    .join(" ");

export const berrySpriteUrl = (itemName: string): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;
