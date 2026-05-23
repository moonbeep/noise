<script lang="ts">
	import FrequencyGrid from '$lib/components/FrequencyGrid.svelte';
	import PresetButtons from '$lib/components/PresetButtons.svelte';
	import PlaybackControl from '$lib/components/PlaybackControl.svelte';
	import Button from '$lib/components/Button.svelte';
	import { ThemeManager } from '$lib/components/Theme.svelte';
	import { defaultWeights, play, stop, setVolume, applyWeights } from '$lib/utils/noiseGenerator';
	import type { Weights } from '$lib/utils/noiseGenerator';
	import { BANNER } from '$lib/constants';

	import { onMount } from 'svelte';

	let weights: Weights = $state([...defaultWeights]);
	let volume = $state(5);
	let isPlaying = $state(false);
	let activePreset = $state<string | null>('white');

	// Snapshot used by toggle() — ensures play() always receives the live weights array
	const currentWeights = $derived([...weights]);

	onMount(() => {
		ThemeManager.apply();
	});

	function handleWeights(w: Weights) {
		weights = w;
		activePreset = null;
		if (isPlaying) applyWeights(w);
	}

	function handlePreset(name: string, w: Weights) {
		weights = [...w];
		activePreset = name;
		if (isPlaying) applyWeights(weights);
	}

	function handleVolume(v: number) {
		volume = v;
		setVolume(v);
	}

	function toggle() {
		if (isPlaying) {
			stop();
			isPlaying = false;
		} else {
			play(currentWeights, volume).then(() => {
				isPlaying = true;
			});
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.code === 'Space') {
			e.preventDefault();
			toggle();
		}
	}

	$effect(() => () => stop());

	console.log(BANNER + '\nVersion:', __APP_VERSION__, '\nRelease date:', __BUILD_TIME__);
</script>

<svelte:window onkeydown={onKeyDown} />

<main
	class="mx-auto box-border grid min-h-dvh w-full max-w-210 grid-rows-[auto_1fr_auto] bg-backdrop px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vw,2rem)] light:bg-l-backdrop"
>
	<header class="mb-10 grid grid-cols-[1fr_auto] items-center">
		<span
			class="font-mono text-[clamp(0.7rem,2vw,0.9rem)] font-bold tracking-[0.25em] text-subtext light:text-l-subtext"
		>
			// NOISE MAKER
		</span>
		<span
			class="font-mono text-[clamp(0.7rem,2vw,0.9rem)] font-bold tracking-[0.15em] transition-colors duration-200 {isPlaying
				? 'text-green light:text-l-green'
				: 'text-muted light:text-l-muted'}">{isPlaying ? '● LIVE' : '○ IDLE'}</span
		>
	</header>

	<div
		class="grid self-center border-2 border-content/30 p-[clamp(1rem,3vw,1.75rem)] light:border-(--color-l-content)/20"
	>
		<section class="grid gap-3.5 py-5">
			<p class="section-label">// FREQ BANDS</p>
			<FrequencyGrid {weights} onchange={handleWeights} />
		</section>

		<div class="divider"></div>

		<section class="grid gap-3.5 py-5">
			<p class="section-label">// PRESET</p>
			<PresetButtons active={activePreset} onSelect={handlePreset} />
		</section>

		<div class="divider"></div>

		<section class="grid gap-3.5 py-5">
			<p class="section-label">// OUTPUT</p>
			<PlaybackControl {volume} {isPlaying} onVolumeChange={handleVolume} onToggle={toggle} />
		</section>
	</div>

	<footer class="mt-8 grid place-items-center">
		<Button onClick={ThemeManager.toggle} border={false}>
			{ThemeManager.current === 'Dark' ? '○ LIGHT MODE' : '● DARK MODE'}
		</Button>
	</footer>
</main>

<style>
	@reference '../routes/layout.css';

	.section-label {
		@apply m-0 font-mono text-xs font-bold tracking-[0.2em] text-content/50 light:text-l-content/40;
	}

	.divider {
		@apply h-px bg-content/18 light:bg-l-content/12;
	}
</style>
