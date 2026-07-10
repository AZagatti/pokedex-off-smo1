<script lang="ts">
	import { MAX_STAT_VALUE, STAT_LABELS } from '$lib/constants/stat-labels';

	const { name, value, color }: { name: string; value: number; color: string } = $props();

	const label = $derived(STAT_LABELS[name] ?? name);
	const percent = $derived(Math.min(100, Math.round((value / MAX_STAT_VALUE) * 100)));
</script>

<div class="flex items-center gap-3">
	<span class="w-16 shrink-0 font-semibold text-slate-500 text-xs uppercase dark:text-slate-400">
		{label}
	</span>
	<span class="w-8 shrink-0 text-right font-mono text-slate-700 text-sm dark:text-slate-300">
		{value}
	</span>
	<div
		class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
		role="meter"
		aria-label={label}
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={MAX_STAT_VALUE}
	>
		<div
			class="stat-bar-fill h-full rounded-full"
			style:width="{percent}%"
			style:background-color={color}
		></div>
	</div>
</div>
