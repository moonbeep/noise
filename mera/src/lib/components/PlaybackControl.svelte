<script lang="ts">
	import { GAP, VOL_COLS, VOL_ROWS } from '$lib/constants';
	import Button from './Button.svelte';

	interface Props {
		volume: number; // 0–10
		isPlaying: boolean;
		onVolumeChange: (v: number) => void;
		onToggle: () => void;
	}

	let { volume, isPlaying, onVolumeChange, onToggle }: Props = $props();

	let dragging = $state(false);

	// Number of lit cells maps 0–10 volume to 0–VOL_COLS in exact 1-cell steps
	const filled = $derived(Math.round((volume / 10) * VOL_COLS));

	function tier(col: number) {
		return col < Math.floor(VOL_COLS * 0.35) ? 'g' : col < Math.floor(VOL_COLS * 0.7) ? 'a' : 'r';
	}

	function apply(e: MouseEvent) {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const x = Math.max(0, Math.min(e.clientX - r.left, r.width - 0.001));
		const col = Math.floor((x / r.width) * VOL_COLS);
		onVolumeChange(((col + 1) / VOL_COLS) * 10);
	}
</script>

<svelte:window onmouseup={() => (dragging = false)} />

<div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
	<span class="font-mono text-sm font-bold tracking-widest text-subtext light:text-l-subtext">
		VOL
	</span>

	<div
		class="grid w-full cursor-crosshair select-none"
		style="gap:{GAP}px; grid-template-columns:repeat({VOL_COLS},1fr); grid-template-rows:repeat({VOL_ROWS},auto)"
		onmousedown={(e) => {
			dragging = true;
			apply(e);
		}}
		onmousemove={(e) => {
			if (dragging) apply(e);
		}}
		role="slider"
		tabindex="0"
		aria-valuenow={filled}
		aria-valuemin={0}
		aria-valuemax={VOL_COLS}
		aria-label="Volume"
	>
		{#each Array(VOL_ROWS * VOL_COLS) as _, i (i)}
			{@const col = i % VOL_COLS}
			<div
				class="grid-cell aspect-square {tier(col) === 'g' && col < filled
					? 'lit-green'
					: tier(col) === 'a' && col < filled
						? 'lit-amber'
						: tier(col) === 'r' && col < filled
							? 'lit-red'
							: ''}"
			></div>
		{/each}
	</div>

	<Button onClick={onToggle} active={isPlaying}>
		{isPlaying ? ' HLT ' : ' RUN '}
	</Button>
</div>
