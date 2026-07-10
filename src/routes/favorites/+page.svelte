<script lang="ts">
	import { base } from '$app/paths';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { favoritesStore } from '$lib/stores/favorites.svelte';
</script>

<svelte:head>
	<title>Favorites — Pokédex</title>
	<meta name="description" content="Your favorited Pokémon, saved on this device." />
</svelte:head>

<h1 class="mb-4 font-bold text-3xl">Favorites</h1>

{#if favoritesStore.names.length === 0}
	<div class="flex flex-col items-center gap-2 py-20 text-center">
		<p class="font-semibold text-lg text-slate-700 dark:text-slate-200">No favorites yet</p>
		<p class="text-slate-500 text-sm">
			Tap the heart on any Pokémon card or detail page to save it here.
		</p>
		<a
			href={`${base}/`}
			class="mt-2 rounded-full bg-red-500 px-4 py-2 font-medium text-sm text-white hover:bg-red-600"
		>
			Browse the Pokédex
		</a>
	</div>
{:else}
	<ul
		class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		aria-label="Favorite Pokémon"
	>
		{#each favoritesStore.names as name (name)}
			<li>
				<PokemonCard {name} />
			</li>
		{/each}
	</ul>
{/if}
