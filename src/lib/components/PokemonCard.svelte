<script lang="ts">
	import { base } from '$app/paths';
	import { getPokemon } from '$lib/api/pokeapi';
	import type { Pokemon } from '$lib/api/schemas';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { formatDexNumber, formatPokemonName, idFromResourceUrl } from '$lib/utils';

	const { name, url }: { name: string; url?: string } = $props();

	let pokemon: Pokemon | undefined = $state();
	const id = $derived(pokemon?.id ?? (url ? idFromResourceUrl(url) : 0));
	let failed = $state(false);

	$effect(() => {
		pokemon = undefined;
		failed = false;
		let cancelled = false;

		(async () => {
			try {
				const p = await getPokemon(name);
				if (!cancelled) {
					pokemon = p;
				}
			} catch {
				if (!cancelled) {
					failed = true;
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	});

	const artwork = $derived(
		pokemon?.sprites.other?.['official-artwork']?.front_default ??
			pokemon?.sprites.front_default ??
			null
	);
</script>

<div
	class="group relative flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
>
	<div class="absolute top-2 right-2 z-10">
		<FavoriteButton {name} />
	</div>

	<a
		href={`${base}/pokemon/${name}`}
		class="flex flex-col items-center gap-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
	>
		{#if pokemon || url}
			<div class="text-slate-400 text-xs dark:text-slate-500">{formatDexNumber(id)}</div>
		{/if}

		{#if pokemon}
			<PokemonImage
				src={artwork}
				alt={formatPokemonName(name)}
				size={96}
				class="transition-transform duration-200 group-hover:scale-110"
			/>
			<p class="font-semibold text-slate-900 capitalize dark:text-white">
				{formatPokemonName(name)}
			</p>
			<div class="flex flex-wrap justify-center gap-1">
				{#each pokemon.types as t (t.type.name)}
					<TypeBadge type={t.type.name} />
				{/each}
			</div>
		{:else if failed}
			<div class="flex h-24 w-24 items-center justify-center text-slate-400 text-xs">
				Failed to load
			</div>
			<p class="font-semibold text-slate-500 capitalize">{formatPokemonName(name)}</p>
		{:else}
			<PokemonImage src={null} alt={formatPokemonName(name)} size={96} />
			<div class="skeleton h-4 w-20 rounded"></div>
			<div class="skeleton h-4 w-24 rounded-full"></div>
		{/if}
	</a>
</div>
