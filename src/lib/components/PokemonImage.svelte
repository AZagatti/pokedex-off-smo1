<script lang="ts">
	const {
		src,
		alt,
		size = 96,
		loading = 'lazy',
		class: className = ''
	}: { src: string | null; alt: string; size?: number; loading?: 'lazy' | 'eager'; class?: string } =
		$props();
</script>

{#if src}
	<img
		{src}
		{alt}
		{loading}
		width={size}
		height={size}
		style:width="{size}px"
		style:height="{size}px"
		class="object-contain {className}"
	/>
{:else}
	<div
		class="skeleton rounded-full"
		style:width="{size}px"
		style:height="{size}px"
		role="img"
		aria-label={alt}
	></div>
{/if}
