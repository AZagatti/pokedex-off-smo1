<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#main-content"
	class="-translate-y-16 fixed top-2 left-2 z-50 rounded-full bg-red-500 px-4 py-2 font-medium text-sm text-white transition-transform focus-visible:translate-y-0"
>
	Skip to content
</a>

<div class="flex min-h-screen flex-col">
	<Header />
	<main id="main-content" class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
		{@render children()}
	</main>
	<footer class="border-slate-200 border-t py-6 text-center text-slate-500 text-xs dark:border-slate-800">
		Data from <a href="https://pokeapi.co" class="underline" target="_blank" rel="noreferrer">PokéAPI</a
		>. Not affiliated with Nintendo, Game Freak, or The Pokémon Company.
	</footer>
</div>
