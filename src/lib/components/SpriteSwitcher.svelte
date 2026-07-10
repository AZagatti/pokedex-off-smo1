<script lang="ts">
	import type { Pokemon } from '$lib/api/schemas';
	import { formatPokemonName } from '$lib/utils';

	const { pokemon }: { pokemon: Pokemon } = $props();

	const SPRITE_KEYS = [
		['front_default', 'Front'],
		['back_default', 'Back'],
		['front_shiny', 'Shiny front'],
		['back_shiny', 'Shiny back']
	] as const;

	const variants = $derived(
		SPRITE_KEYS.flatMap(([key, label]) => {
			const url = pokemon.sprites[key];
			return url ? [{ label, url }] : [];
		})
	);

	let selected = $state(0);
	$effect(() => {
		void pokemon.name;
		selected = 0;
	});

	const current = $derived(variants[selected]);
</script>

{#if variants.length > 0}
	<div class="flex flex-col items-center gap-2">
		{#if current}
			<img
				src={current.url}
				alt={`${formatPokemonName(pokemon.name)} — ${current.label} sprite`}
				width="96"
				height="96"
				class="h-24 w-24 object-contain [image-rendering:pixelated]"
			/>
		{/if}
		<div class="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Sprite variant">
			{#each variants as v, i (v.label)}
				<button
					type="button"
					onclick={() => (selected = i)}
					aria-pressed={selected === i}
					class="rounded-full border px-2.5 py-1 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500
					{selected === i
						? 'border-red-500 bg-red-500 text-white'
						: 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'}"
				>
					{v.label}
				</button>
			{/each}
		</div>
	</div>
{/if}
