<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { base } from '$app/paths';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import { motionDuration } from '$lib/motion';
	import { berrySpriteUrl, capitalize } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const berry = $derived(data.berry);
</script>

<svelte:head>
	<title>{capitalize(berry.name)} Berry — Pokédex</title>
	<meta name="description" content={`Firmness, flavors, growth time and size for the ${capitalize(berry.name)} Berry.`} />
</svelte:head>

<a
	href={`${base}/berries`}
	class="mb-4 inline-flex items-center gap-1.5 font-medium text-slate-600 text-sm transition-colors hover:text-red-500 dark:text-slate-300"
>
	<ArrowLeft size={16} aria-hidden="true" />
	Back to Berries
</a>

{#key berry.name}
	<article
		in:fly={{ y: 16, duration: motionDuration(300) }}
		class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800"
	>
		<header
			class="flex flex-col items-center gap-3 bg-gradient-to-br from-green-500 to-green-600 px-6 py-8 text-white"
		>
			<PokemonImage
				src={berrySpriteUrl(berry.item.name)}
				alt={`${capitalize(berry.name)} Berry`}
				size={96}
				loading="eager"
				class="drop-shadow-lg"
			/>
			<h1 class="font-bold text-3xl capitalize">{berry.name} Berry</h1>
		</header>

		<dl class="grid grid-cols-2 gap-6 p-6 text-sm sm:grid-cols-3">
			<div>
				<dt class="text-slate-500 dark:text-slate-400">Firmness</dt>
				<dd class="font-medium capitalize">{berry.firmness.name}</dd>
			</div>
			<div>
				<dt class="text-slate-500 dark:text-slate-400">Growth time</dt>
				<dd class="font-medium">{berry.growth_time} hours/stage</dd>
			</div>
			<div>
				<dt class="text-slate-500 dark:text-slate-400">Size</dt>
				<dd class="font-medium">{berry.size} mm</dd>
			</div>
			<div>
				<dt class="text-slate-500 dark:text-slate-400">Max harvest</dt>
				<dd class="font-medium">{berry.max_harvest}</dd>
			</div>
			<div>
				<dt class="text-slate-500 dark:text-slate-400">Smoothness</dt>
				<dd class="font-medium">{berry.smoothness}</dd>
			</div>
			<div>
				<dt class="text-slate-500 dark:text-slate-400">Natural gift</dt>
				<dd class="font-medium capitalize">
					{berry.natural_gift_power} power ({berry.natural_gift_type.name})
				</dd>
			</div>
		</dl>

		<div class="border-slate-200 border-t p-6 dark:border-slate-800">
			<h2 class="mb-3 font-semibold text-lg">Flavors</h2>
			<ul class="grid grid-cols-2 gap-2 sm:grid-cols-5">
				{#each berry.flavors.filter((f) => f.potency > 0) as f (f.flavor.name)}
					<li class="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800">
						<p class="font-medium capitalize">{f.flavor.name}</p>
						<p class="text-slate-500 text-xs dark:text-slate-400">{f.potency}</p>
					</li>
				{:else}
					<li class="col-span-full text-slate-500 text-sm">No dominant flavor.</li>
				{/each}
			</ul>
		</div>
	</article>
{/key}
