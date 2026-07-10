<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { getPokemon } from '$lib/api/pokeapi';
	import type { EvolutionChainLink } from '$lib/api/schemas';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import { formatPokemonName } from '$lib/utils';
	// oxlint-disable-next-line no-self-import, no-cycle -- recursive component, replaces deprecated <svelte:self>
	import EvolutionStage from './EvolutionStage.svelte';

	const { link }: { link: EvolutionChainLink } = $props();

	let artwork: string | null = $state(null);

	$effect(() => {
		let cancelled = false;

		(async () => {
			try {
				const p = await getPokemon(link.species.name);
				if (!cancelled) {
					artwork =
						p.sprites.other?.['official-artwork']?.front_default ??
						p.sprites.front_default;
				}
			} catch {
				// leave artwork null; the name still renders
			}
		})();

		return () => {
			cancelled = true;
		};
	});
</script>

<div class="flex flex-wrap items-center gap-2">
	<a
		href={`${base}/pokemon/${link.species.name}`}
		class="flex flex-col items-center gap-1 rounded-xl p-2 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:hover:bg-slate-800"
	>
		<PokemonImage src={artwork} alt={formatPokemonName(link.species.name)} size={64} />
		<span class="font-medium text-slate-800 text-sm capitalize dark:text-slate-100">
			{formatPokemonName(link.species.name)}
		</span>
	</a>

	{#if link.evolves_to.length > 0}
		<ChevronRight size={20} aria-hidden="true" class="shrink-0 text-slate-400" />
		<div class="flex flex-col gap-3">
			{#each link.evolves_to as next (next.species.name)}
				<EvolutionStage link={next} />
			{/each}
		</div>
	{/if}
</div>
