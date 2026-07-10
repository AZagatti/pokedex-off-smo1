<script lang="ts">
	import { getTypeColor, getTypeTextColor } from '$lib/constants/type-colors';
	import { capitalize } from '$lib/utils';

	const { type }: { type: string } = $props();
</script>

<span
	class="rounded-full px-2.5 py-0.5 font-semibold text-xs capitalize shadow-sm"
	style:background-color={getTypeColor(type)}
	style:color={getTypeTextColor(type)}
>
	{capitalize(type)}
</span>
