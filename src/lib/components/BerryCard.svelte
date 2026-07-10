<script lang="ts">
	import { base } from '$app/paths';
	import { getBerry } from '$lib/api/pokeapi';
	import type { Berry } from '$lib/api/schemas';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import { berrySpriteUrl, capitalize } from '$lib/utils';

	const { name }: { name: string } = $props();

	let berry: Berry | undefined = $state();
	let failed = $state(false);

	$effect(() => {
		berry = undefined;
		failed = false;
		let cancelled = false;

		(async () => {
			try {
				const b = await getBerry(name);
				if (!cancelled) {
					berry = b;
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
</script>

<a
	href={`${base}/berries/${name}`}
	class="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-slate-800 dark:bg-slate-900"
>
	{#if berry}
		<PokemonImage
			src={berrySpriteUrl(berry.item.name)}
			alt={`${capitalize(berry.name)} Berry`}
			size={64}
			class="transition-transform duration-200 group-hover:scale-110"
		/>
		<p class="font-semibold text-slate-900 capitalize dark:text-white">{berry.name} Berry</p>
		<p class="text-slate-500 text-xs capitalize dark:text-slate-400">{berry.firmness.name} firmness</p>
	{:else if failed}
		<div class="flex h-16 w-16 items-center justify-center text-slate-400 text-xs">
			Failed to load
		</div>
		<p class="font-semibold text-slate-500 capitalize">{name} Berry</p>
	{:else}
		<PokemonImage src={null} alt={`${capitalize(name)} Berry`} size={64} />
		<div class="skeleton h-4 w-24 rounded"></div>
		<div class="skeleton h-3 w-16 rounded"></div>
	{/if}
</a>
