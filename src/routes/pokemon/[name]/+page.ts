import {
  getEvolutionChain,
  getPokemon,
  getPokemonSpecies,
} from "$lib/api/pokeapi";
import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const prerender = false;
export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  let pokemon: Awaited<ReturnType<typeof getPokemon>>;
  try {
    pokemon = await getPokemon(params.name, fetch);
  } catch {
    error(404, `Pokémon "${params.name}" not found`);
  }

  const species = await getPokemonSpecies(pokemon.species.name, fetch).catch(
    () => null
  );
  const evolutionChain = species?.evolution_chain
    ? await getEvolutionChain(species.evolution_chain.url, fetch).catch(
        () => null
      )
    : null;

  return { evolutionChain, pokemon, species };
};
