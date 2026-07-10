<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { base } from '$app/paths';
	import EvolutionStage from '$lib/components/EvolutionStage.svelte';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import PlayCryButton from '$lib/components/PlayCryButton.svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import SpriteSwitcher from '$lib/components/SpriteSwitcher.svelte';
	import StatBar from '$lib/components/StatBar.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { getTypeColor, getTypeTextColor } from '$lib/constants/type-colors';
	import { motionDuration } from '$lib/motion';
	import { formatDexNumber, formatPokemonName } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const pokemon = $derived(data.pokemon);
	const primaryColor = $derived(getTypeColor(pokemon.types[0]?.type.name ?? 'normal'));
	const headerTextColor = $derived(getTypeTextColor(pokemon.types[0]?.type.name ?? 'normal'));
	const artwork = $derived(
		pokemon.sprites.other?.['official-artwork']?.front_default ?? pokemon.sprites.front_default
	);
	const heightM = $derived((pokemon.height / 10).toFixed(1));
	const weightKg = $derived((pokemon.weight / 10).toFixed(1));
	const genus = $derived(
		data.species?.genera.find((g) => g.language.name === 'en')?.genus ?? null
	);
	const cryUrl = $derived(pokemon.cries?.latest ?? pokemon.cries?.legacy ?? null);
</script>

<svelte:head>
	<title>{formatPokemonName(pokemon.name)} — Pokédex</title>
	<meta name="description" content={`Stats, types, abilities and evolutions for ${formatPokemonName(pokemon.name)}.`} />
</svelte:head>

<a
	href={`${base}/`}
	class="mb-4 inline-flex items-center gap-1.5 font-medium text-slate-600 text-sm transition-colors hover:text-red-500 dark:text-slate-300"
>
	<ArrowLeft size={16} aria-hidden="true" />
	Back to Pokédex
</a>

{#key pokemon.name}
	<article
		in:fly={{ y: 16, duration: motionDuration(300) }}
		class="overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800"
	>
		<header
			class="relative flex flex-col items-center gap-3 px-6 py-8"
			style:background={`linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`}
			style:color={headerTextColor}
		>
			<div class="absolute top-4 right-4">
				<FavoriteButton name={pokemon.name} />
			</div>
			<span class="font-semibold text-sm opacity-80">{formatDexNumber(pokemon.id)}</span>
			<PokemonImage
				src={artwork}
				alt={formatPokemonName(pokemon.name)}
				size={192}
				loading="eager"
				class="drop-shadow-lg"
			/>
			<h1 class="font-bold text-3xl capitalize">{formatPokemonName(pokemon.name)}</h1>
			{#if genus}
				<p class="text-sm opacity-80">{genus}</p>
			{/if}
			<div class="flex gap-2">
				{#each pokemon.types as t (t.type.name)}
					<TypeBadge type={t.type.name} />
				{/each}
			</div>
		</header>

		<div class="grid gap-8 p-6 md:grid-cols-2">
			<section aria-labelledby="about-heading">
				<h2 id="about-heading" class="mb-3 font-semibold text-lg">About</h2>
				<dl class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<dt class="text-slate-500 dark:text-slate-400">Height</dt>
						<dd class="font-medium">{heightM} m</dd>
					</div>
					<div>
						<dt class="text-slate-500 dark:text-slate-400">Weight</dt>
						<dd class="font-medium">{weightKg} kg</dd>
					</div>
				</dl>

				<h3 class="mt-6 mb-2 font-semibold">Abilities</h3>
				<ul class="flex flex-wrap gap-2">
					{#each pokemon.abilities as a (a.ability.name)}
						<li
							class="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm capitalize dark:bg-slate-800"
						>
							{formatPokemonName(a.ability.name)}
							{#if a.is_hidden}
								<span
									class="rounded-full bg-slate-300 px-1.5 py-0.5 text-[10px] text-slate-700 uppercase dark:bg-slate-700 dark:text-slate-200"
								>
									Hidden
								</span>
							{/if}
						</li>
					{/each}
				</ul>

				<h3 class="mt-6 mb-2 font-semibold">Example moves</h3>
				<ul class="flex flex-wrap gap-2">
					{#each pokemon.moves.slice(0, 8) as m (m.move.name)}
						<li class="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize dark:bg-slate-800">
							{formatPokemonName(m.move.name)}
						</li>
					{/each}
				</ul>

				<h3 class="mt-6 mb-2 font-semibold">Sprites</h3>
				<SpriteSwitcher {pokemon} />

				{#if cryUrl}
					<div class="mt-4">
						<PlayCryButton {cryUrl} />
					</div>
				{/if}
			</section>

			<section aria-labelledby="stats-heading">
				<h2 id="stats-heading" class="mb-3 font-semibold text-lg">Base stats</h2>
				<div class="flex flex-col gap-2">
					{#each pokemon.stats as s (s.stat.name)}
						<StatBar name={s.stat.name} value={s.base_stat} color={primaryColor} />
					{/each}
				</div>

				{#if data.evolutionChain}
					<h2 class="mt-8 mb-3 font-semibold text-lg">Evolution chain</h2>
					<EvolutionStage link={data.evolutionChain.chain} />
				{/if}
			</section>
		</div>
	</article>
{/key}
