<script lang="ts">
	import FilterToolbar from '$lib/components/FilterToolbar.svelte';
	import InfiniteScrollSentinel from '$lib/components/InfiniteScrollSentinel.svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { PokedexListState } from '$lib/pokedex/list-state.svelte';
	import { untrack } from 'svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	// `data.pokemonIndex` is only ever the build-time snapshot for this route —
	// the mutable state class owns everything reactive from here on.
	const state = new PokedexListState(untrack(() => data.pokemonIndex));
</script>

<svelte:head>
	<title>Pokédex</title>
	<meta name="description" content="Browse, search, and filter every Pokémon." />
</svelte:head>

<h1 class="sr-only">Pokédex</h1>

<FilterToolbar {state} />

<div class="pt-4">
	{#if state.loadingStats}
		<p class="mb-3 text-slate-500 text-sm" role="status">Loading stats for sorting…</p>
	{:else if state.sortMode === 'stat-total' && state.statSortCapped}
		<p class="mb-3 text-slate-500 text-sm" role="status">
			Sorted the first 200 matching Pokémon by stat total — narrow your filters to sort more.
		</p>
	{/if}

	{#if state.visible.length === 0}
		<div class="flex flex-col items-center gap-2 py-20 text-center">
			<p class="font-semibold text-lg text-slate-700 dark:text-slate-200">No Pokémon found</p>
			<p class="text-slate-500 text-sm">Try adjusting your search or filters.</p>
			{#if state.hasActiveFilters}
				<button
					type="button"
					onclick={() => state.clearFilters()}
					class="mt-2 rounded-full bg-red-500 px-4 py-2 font-medium text-sm text-white hover:bg-red-600"
				>
					Clear filters
				</button>
			{/if}
		</div>
	{:else}
		<ul
			class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
			aria-label="Pokémon list"
		>
			{#each state.visible as p (p.name)}
				<li>
					<PokemonCard name={p.name} url={p.url} />
				</li>
			{/each}
		</ul>

		{#if state.hasMore}
			<InfiniteScrollSentinel onIntersect={() => state.loadMore()} />
		{/if}
	{/if}
</div>
