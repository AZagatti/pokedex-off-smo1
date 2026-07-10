<script lang="ts">
	import { Heart } from 'lucide-svelte';
	import { favoritesStore } from '$lib/stores/favorites.svelte';
	import { formatPokemonName } from '$lib/utils';

	const { name, size = 18 }: { name: string; size?: number } = $props();

	const isFavorite = $derived(favoritesStore.has(name));

	const handleClick = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		favoritesStore.toggle(name);
	};
</script>

<button
	type="button"
	onclick={handleClick}
	aria-pressed={isFavorite}
	aria-label={isFavorite
		? `Remove ${formatPokemonName(name)} from favorites`
		: `Add ${formatPokemonName(name)} to favorites`}
	class="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 shadow-sm backdrop-blur transition-all hover:scale-110 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:bg-slate-900/80 dark:text-slate-400"
>
	<Heart size={size} aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} class={isFavorite ? 'text-red-500' : ''} />
</button>
