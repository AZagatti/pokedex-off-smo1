export const TYPE_COLORS: Record<string, string> = {
  bug: "#9fb911",
  dark: "#5c5366",
  dragon: "#0a6dc4",
  electric: "#f4d23c",
  fairy: "#ee97e6",
  fighting: "#e0306a",
  fire: "#e5710b",
  flying: "#89aae3",
  ghost: "#4c6ac4",
  grass: "#48b95a",
  ground: "#e3af6f",
  ice: "#3ec9c9",
  normal: "#919aa2",
  poison: "#9c4ba5",
  psychic: "#f9358a",
  rock: "#c4b57e",
  steel: "#5a8fa6",
  water: "#3894e0",
};

export const getTypeColor = (type: string): string =>
  TYPE_COLORS[type] ?? "#68a090";

// Backgrounds too light for white text to meet WCAG AA contrast.
const LIGHT_BACKGROUND_TYPES = new Set([
  "electric",
  "fairy",
  "ground",
  "ice",
  "normal",
  "rock",
]);

export const getTypeTextColor = (type: string): string =>
  LIGHT_BACKGROUND_TYPES.has(type) ? "#1e293b" : "#ffffff";
