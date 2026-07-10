<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { Heart, Moon, Sun, Sparkles, Apple } from 'lucide-svelte';

	const links = [
		{ href: `${base}/`, icon: Sparkles, label: 'Pokédex' },
		{ href: `${base}/berries`, icon: Apple, label: 'Berries' },
		{ href: `${base}/favorites`, icon: Heart, label: 'Favorites' }
	];

	const isActive = (href: string) => {
		const path = page.url.pathname;
		if (href === `${base}/`) {
			return path === `${base}/` || path === base || path === '/';
		}
		return path.startsWith(href);
	};
</script>

<header
	class="sticky top-0 z-40 border-slate-200 border-b bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
		<a href={`${base}/`} class="flex items-center gap-2 font-bold text-lg tracking-tight">
			<span
				class="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm"
			>
				<span class="h-3 w-3 rounded-full border-2 border-white bg-white"></span>
			</span>
			Pokédex
		</a>

		<nav aria-label="Primary" class="flex items-center gap-1">
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					class="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500
					{isActive(link.href)
						? 'bg-red-500 text-white'
						: 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}"
				>
					<link.icon size={16} aria-hidden="true" />
					<span class="hidden sm:inline">{link.label}</span>
				</a>
			{/each}

			<button
				type="button"
				onclick={() => themeStore.toggle()}
				aria-label={themeStore.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				class="ml-1 grid h-9 w-9 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:text-slate-300 dark:hover:bg-slate-800"
			>
				{#if themeStore.current === 'dark'}
					<Sun size={18} aria-hidden="true" />
				{:else}
					<Moon size={18} aria-hidden="true" />
				{/if}
			</button>
		</nav>
	</div>
</header>
