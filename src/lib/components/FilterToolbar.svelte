<script lang="ts">
	import { Search, X } from 'lucide-svelte';
	import { POKEMON_TYPES } from '$lib/api/pokeapi';
	import { getTypeColor, getTypeTextColor } from '$lib/constants/type-colors';
	import type { PokedexListState } from '$lib/pokedex/list-state.svelte';
	import { capitalize } from '$lib/utils';

	const { state }: { state: PokedexListState } = $props();

	const generations = Array.from({ length: 9 }, (_, i) => i + 1);
</script>

<div
	class="sticky top-[57px] z-30 -mx-4 border-slate-200 border-b bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
>
	<div class="flex flex-wrap items-center gap-3">
		<label class="relative flex-1 min-w-[200px]">
			<span class="sr-only">Search Pokémon by name</span>
			<Search
				size={16}
				aria-hidden="true"
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
			/>
			<input
				type="search"
				placeholder="Search Pokémon by name"
				value={state.searchInput}
				oninput={(e) => state.setSearchInput(e.currentTarget.value)}
				class="w-full rounded-full border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 dark:border-slate-700 dark:bg-slate-900"
			/>
		</label>

		<label class="flex items-center gap-2 text-sm">
			<span class="text-slate-600 dark:text-slate-400">Generation</span>
			<select
				value={state.selectedGeneration ?? ''}
				onchange={(e) => {
					const v = e.currentTarget.value;
					state.setGeneration(v === '' ? null : Number(v));
				}}
				class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus-visible:border-red-500 dark:border-slate-700 dark:bg-slate-900"
			>
				<option value="">All</option>
				{#each generations as g (g)}
					<option value={g}>Gen {g}</option>
				{/each}
			</select>
		</label>

		<label class="flex items-center gap-2 text-sm">
			<span class="text-slate-600 dark:text-slate-400">Sort</span>
			<select
				value={state.sortMode}
				onchange={(e) => state.setSortMode(e.currentTarget.value as 'dex' | 'stat-total')}
				class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus-visible:border-red-500 dark:border-slate-700 dark:bg-slate-900"
			>
				<option value="dex">Dex number</option>
				<option value="stat-total">Base stat total</option>
			</select>
		</label>

		{#if state.hasActiveFilters}
			<button
				type="button"
				onclick={() => state.clearFilters()}
				class="flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-slate-600 text-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
			>
				<X size={14} aria-hidden="true" />
				Clear filters
			</button>
		{/if}
	</div>

	<div class="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
		{#each POKEMON_TYPES as type (type)}
			{@const active = state.selectedTypes.has(type)}
			<button
				type="button"
				onclick={() => state.toggleType(type)}
				aria-pressed={active}
				style:background-color={active ? getTypeColor(type) : undefined}
				style:border-color={getTypeColor(type)}
				style:color={active ? getTypeTextColor(type) : undefined}
				class="rounded-full border px-2.5 py-1 font-medium text-xs capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500
				{active ? '' : 'bg-transparent text-slate-600 dark:text-slate-300'}"
			>
				{capitalize(type)}
			</button>
		{/each}
	</div>

	{#if state.filterError}
		<p role="alert" class="mt-2 text-red-600 text-sm dark:text-red-400">{state.filterError}</p>
	{/if}
</div>
