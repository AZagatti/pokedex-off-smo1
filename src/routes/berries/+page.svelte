<script lang="ts">
	import BerryCard from '$lib/components/BerryCard.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Berries — Pokédex</title>
	<meta name="description" content="Browse every berry from the Pokémon world." />
</svelte:head>

<h1 class="mb-4 font-bold text-3xl">Berries</h1>

{#if data.berries.length === 0}
	<p class="text-slate-500">No berries found.</p>
{:else}
	<ul
		class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
		aria-label="Berry list"
	>
		{#each data.berries as b (b.name)}
			<li>
				<BerryCard name={b.name} />
			</li>
		{/each}
	</ul>
{/if}
