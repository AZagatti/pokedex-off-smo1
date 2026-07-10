import { z } from "zod";

export const namedApiResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});
export type NamedApiResource = z.infer<typeof namedApiResourceSchema>;

export const namedApiResourceListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(namedApiResourceSchema),
});
export type NamedApiResourceList = z.infer<typeof namedApiResourceListSchema>;

export const pokemonSpritesSchema = z.object({
  back_default: z.string().nullable(),
  back_shiny: z.string().nullable(),
  front_default: z.string().nullable(),
  front_shiny: z.string().nullable(),
  other: z
    .object({
      "official-artwork": z
        .object({
          front_default: z.string().nullable(),
          front_shiny: z.string().nullable().optional(),
        })
        .optional(),
    })
    .optional(),
});

export const pokemonSchema = z.object({
  abilities: z.array(
    z.object({
      ability: namedApiResourceSchema,
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  cries: z
    .object({
      latest: z.string().nullable().optional(),
      legacy: z.string().nullable().optional(),
    })
    .optional(),
  height: z.number(),
  id: z.number(),
  moves: z.array(
    z.object({
      move: namedApiResourceSchema,
    })
  ),
  name: z.string(),
  species: namedApiResourceSchema,
  sprites: pokemonSpritesSchema,
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: namedApiResourceSchema,
    })
  ),
  types: z.array(
    z.object({
      slot: z.number(),
      type: namedApiResourceSchema,
    })
  ),
  weight: z.number(),
});
export type Pokemon = z.infer<typeof pokemonSchema>;

export const pokemonSpeciesSchema = z.object({
  evolution_chain: z.object({ url: z.string() }).nullable(),
  genera: z.array(
    z.object({ genus: z.string(), language: namedApiResourceSchema })
  ),
});
export type PokemonSpecies = z.infer<typeof pokemonSpeciesSchema>;

export interface EvolutionChainLink {
  evolves_to: EvolutionChainLink[];
  species: NamedApiResource;
}

export const evolutionChainLinkSchema: z.ZodType<EvolutionChainLink> = z.lazy(
  () =>
    z.object({
      evolves_to: z.array(evolutionChainLinkSchema),
      species: namedApiResourceSchema,
    })
);

export const evolutionChainSchema = z.object({
  chain: evolutionChainLinkSchema,
});
export type EvolutionChain = z.infer<typeof evolutionChainSchema>;

export const generationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(namedApiResourceSchema),
});
export type Generation = z.infer<typeof generationSchema>;

export const typeDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: namedApiResourceSchema,
      slot: z.number(),
    })
  ),
});
export type TypeDetail = z.infer<typeof typeDetailSchema>;

export const berrySchema = z.object({
  firmness: namedApiResourceSchema,
  flavors: z.array(
    z.object({
      flavor: namedApiResourceSchema,
      potency: z.number(),
    })
  ),
  growth_time: z.number(),
  id: z.number(),
  item: namedApiResourceSchema,
  max_harvest: z.number(),
  name: z.string(),
  natural_gift_power: z.number(),
  natural_gift_type: namedApiResourceSchema,
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
});
export type Berry = z.infer<typeof berrySchema>;
