<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>{page.status} — Pokédex</title>
</svelte:head>

<div class="flex flex-col items-center gap-3 py-24 text-center">
	<p class="font-bold text-6xl text-red-500">{page.status}</p>
	<p class="font-semibold text-lg text-slate-700 dark:text-slate-200">
		{page.error?.message ?? 'Something went wrong.'}
	</p>
	<a
		href={`${base}/`}
		class="mt-2 rounded-full bg-red-500 px-4 py-2 font-medium text-sm text-white hover:bg-red-600"
	>
		Back to Pokédex
	</a>
</div>
