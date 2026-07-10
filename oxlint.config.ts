import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import svelte from "ultracite/oxlint/svelte";

export default defineConfig({
  extends: [core, svelte],
  ignorePatterns: core.ignorePatterns,
  overrides: [
    {
      // Svelte components use PascalCase filenames by ecosystem convention
      // (SvelteKit docs, every starter template) — keep that instead of
      // unicorn's kebab-case default, which ultracite's (currently empty)
      // svelte preset doesn't yet account for.
      files: ["**/*.svelte"],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
  ],
});
