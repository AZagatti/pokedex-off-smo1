import { cachedFetch } from "$lib/api/cache";
import {
  berrySchema,
  evolutionChainSchema,
  generationSchema,
  namedApiResourceListSchema,
  pokemonSchema,
  pokemonSpeciesSchema,
  typeDetailSchema,
} from "$lib/api/schemas";

const BASE_URL = "https://pokeapi.co/api/v2";

export const getPokemonList = (limit: number, offset: number) =>
  cachedFetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, (data) =>
    namedApiResourceListSchema.parse(data)
  );

export const getPokemon = (nameOrId: string | number) =>
  cachedFetch(`${BASE_URL}/pokemon/${nameOrId}`, (data) =>
    pokemonSchema.parse(data)
  );

export const getPokemonSpecies = (nameOrId: string | number) =>
  cachedFetch(`${BASE_URL}/pokemon-species/${nameOrId}`, (data) =>
    pokemonSpeciesSchema.parse(data)
  );

export const getEvolutionChain = (url: string) =>
  cachedFetch(url, (data) => evolutionChainSchema.parse(data));

export const getGeneration = (id: number) =>
  cachedFetch(`${BASE_URL}/generation/${id}`, (data) =>
    generationSchema.parse(data)
  );

export const getType = (name: string) =>
  cachedFetch(`${BASE_URL}/type/${name}`, (data) =>
    typeDetailSchema.parse(data)
  );

export const getBerryList = (limit: number, offset: number) =>
  cachedFetch(`${BASE_URL}/berry?limit=${limit}&offset=${offset}`, (data) =>
    namedApiResourceListSchema.parse(data)
  );

export const getBerry = (nameOrId: string | number) =>
  cachedFetch(`${BASE_URL}/berry/${nameOrId}`, (data) =>
    berrySchema.parse(data)
  );

export const POKEMON_TYPES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];
