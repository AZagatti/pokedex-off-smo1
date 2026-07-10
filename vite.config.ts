import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const base = (process.env.BASE_PATH ?? "") as "" | `/${string}`;

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter({
        assets: "build",
        fallback: "404.html",
        pages: "build",
        precompress: false,
        strict: true,
      }),
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/u).includes("node_modules") ? undefined : true,
      },
      paths: {
        base,
      },
      prerender: {
        handleHttpError: "warn",
      },
    }),
  ],
});
