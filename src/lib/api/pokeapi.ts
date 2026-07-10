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

export const getPokemonList = (
  limit: number,
  offset: number,
  fetchImpl?: typeof fetch
) =>
  cachedFetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    (data) => namedApiResourceListSchema.parse(data),
    fetchImpl
  );

export const getPokemon = (
  nameOrId: string | number,
  fetchImpl?: typeof fetch
) =>
  cachedFetch(
    `${BASE_URL}/pokemon/${nameOrId}`,
    (data) => pokemonSchema.parse(data),
    fetchImpl
  );

export const getPokemonSpecies = (
  nameOrId: string | number,
  fetchImpl?: typeof fetch
) =>
  cachedFetch(
    `${BASE_URL}/pokemon-species/${nameOrId}`,
    (data) => pokemonSpeciesSchema.parse(data),
    fetchImpl
  );

export const getEvolutionChain = (url: string, fetchImpl?: typeof fetch) =>
  cachedFetch(url, (data) => evolutionChainSchema.parse(data), fetchImpl);

export const getGeneration = (id: number, fetchImpl?: typeof fetch) =>
  cachedFetch(
    `${BASE_URL}/generation/${id}`,
    (data) => generationSchema.parse(data),
    fetchImpl
  );

export const getType = (name: string, fetchImpl?: typeof fetch) =>
  cachedFetch(
    `${BASE_URL}/type/${name}`,
    (data) => typeDetailSchema.parse(data),
    fetchImpl
  );

export const getBerryList = (
  limit: number,
  offset: number,
  fetchImpl?: typeof fetch
) =>
  cachedFetch(
    `${BASE_URL}/berry?limit=${limit}&offset=${offset}`,
    (data) => namedApiResourceListSchema.parse(data),
    fetchImpl
  );

export const getBerry = (nameOrId: string | number, fetchImpl?: typeof fetch) =>
  cachedFetch(
    `${BASE_URL}/berry/${nameOrId}`,
    (data) => berrySchema.parse(data),
    fetchImpl
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
