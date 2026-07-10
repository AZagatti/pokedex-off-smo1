<script lang="ts">
	const { onIntersect }: { onIntersect: () => void } = $props();

	// oxlint-disable-next-line prefer-const -- reassigned via bind:this below
	let sentinel: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!sentinel) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					onIntersect();
				}
			},
			{ rootMargin: '400px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<div bind:this={sentinel} aria-hidden="true" class="h-1 w-full"></div>
