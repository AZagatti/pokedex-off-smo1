import {
  berrySchema,
  evolutionChainSchema,
  namedApiResourceListSchema,
  pokemonSchema,
} from "$lib/api/schemas";
import { describe, expect, it } from "vitest";

describe("namedApiResourceListSchema", () => {
  it("parses a valid list response", () => {
    const result = namedApiResourceListSchema.parse({
      count: 1,
      next: null,
      previous: null,
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      ],
    });
    expect(result.results).toHaveLength(1);
  });

  it("rejects a malformed response", () => {
    expect(() =>
      namedApiResourceListSchema.parse({ count: "not-a-number" })
    ).toThrow();
  });
});

describe("pokemonSchema", () => {
  it("parses a minimal valid pokemon payload", () => {
    const payload = {
      abilities: [
        {
          ability: {
            name: "overgrow",
            url: "https://pokeapi.co/api/v2/ability/65/",
          },
          is_hidden: false,
          slot: 1,
        },
      ],
      height: 7,
      id: 1,
      moves: [],
      name: "bulbasaur",
      species: {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon-species/1/",
      },
      sprites: {
        back_default: null,
        back_shiny: null,
        front_default: null,
        front_shiny: null,
      },
      stats: [
        {
          base_stat: 45,
          stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" },
        },
      ],
      types: [
        {
          slot: 1,
          type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
        },
      ],
      weight: 69,
    };
    const result = pokemonSchema.parse(payload);
    expect(result.name).toBe("bulbasaur");
  });
});

describe("evolutionChainSchema", () => {
  it("parses a recursive evolution chain", () => {
    const result = evolutionChainSchema.parse({
      chain: {
        evolves_to: [
          {
            evolves_to: [],
            species: {
              name: "ivysaur",
              url: "https://pokeapi.co/api/v2/pokemon-species/2/",
            },
          },
        ],
        species: {
          name: "bulbasaur",
          url: "https://pokeapi.co/api/v2/pokemon-species/1/",
        },
      },
    });
    expect(result.chain.evolves_to[0]?.species.name).toBe("ivysaur");
  });
});

describe("berrySchema", () => {
  it("parses a valid berry payload", () => {
    const result = berrySchema.parse({
      firmness: {
        name: "soft",
        url: "https://pokeapi.co/api/v2/berry-firmness/2/",
      },
      flavors: [
        {
          flavor: {
            name: "spicy",
            url: "https://pokeapi.co/api/v2/berry-flavor/1/",
          },
          potency: 10,
        },
      ],
      growth_time: 3,
      id: 1,
      max_harvest: 5,
      name: "cheri",
      natural_gift_power: 60,
      size: 20,
      smoothness: 25,
      soil_dryness: 15,
    });
    expect(result.name).toBe("cheri");
  });
});
