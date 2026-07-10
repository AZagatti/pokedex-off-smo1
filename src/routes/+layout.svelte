<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
		{@render children()}
	</main>
	<footer class="border-slate-200 border-t py-6 text-center text-slate-500 text-xs dark:border-slate-800">
		Data from <a href="https://pokeapi.co" class="underline" target="_blank" rel="noreferrer">PokéAPI</a
		>. Not affiliated with Nintendo, Game Freak, or The Pokémon Company.
	</footer>
</div>
