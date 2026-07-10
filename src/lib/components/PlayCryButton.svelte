<script lang="ts">
	import { Volume2 } from 'lucide-svelte';

	const { cryUrl }: { cryUrl: string } = $props();

	let audio: HTMLAudioElement | undefined;
	let playing = $state(false);

	const play = async () => {
		if (!audio) {
			audio = new Audio(cryUrl);
			audio.addEventListener('ended', () => {
				playing = false;
			});
			audio.addEventListener('pause', () => {
				playing = false;
			});
		}
		playing = true;
		try {
			await audio.play();
		} catch {
			playing = false;
		}
	};
</script>

<button
	type="button"
	onclick={play}
	disabled={playing}
	class="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 font-medium text-slate-600 text-sm transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
>
	<Volume2 size={16} aria-hidden="true" />
	{playing ? 'Playing…' : 'Play cry'}
</button>
