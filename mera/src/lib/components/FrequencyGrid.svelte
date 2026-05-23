<script lang="ts">
	import { FREQS, N } from '$lib/utils/noiseGenerator';
	import { GAP, GRID_COLS, GRID_ROWS, CELL } from '$lib/constants';
	import type { Weights } from '$lib/utils/noiseGenerator';

	interface Props {
		weights: Weights;
		onchange: (w: Weights) => void;
	}

	let { weights, onchange }: Props = $props();

	let dragging = $state(false);
	let hoverCol = $state(-1);
	let wrapW = $state(0);

	// Cell size fills wrapper width exactly; falls back to CELL before first measure
	const cellSize = $derived(
		wrapW > 0 ? Math.max(8, Math.floor((wrapW - (GRID_COLS - 1) * GAP) / GRID_COLS)) : CELL
	);
	const slot = $derived(cellSize + GAP);
	const gridW = $derived(GRID_COLS * cellSize + (GRID_COLS - 1) * GAP);

	// Centre-x of column i, used for axis label positioning
	const cx = (i: number) => i * slot + cellSize / 2;

	const midCol = Math.floor((GRID_COLS - 1) / 2);

	function tier(row: number) {
		return row < 3 ? 'r' : row < 7 ? 'a' : 'g';
	}

	function hit(e: MouseEvent): { col: number; row: number } | null {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		const col = Math.floor((e.clientX - r.left) / slot);
		const row = Math.floor((e.clientY - r.top) / slot);
		if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return null;
		return { col, row };
	}

	function apply(e: MouseEvent) {
		const h = hit(e);
		if (!h) return;
		const next = [...weights];
		next[h.col] = GRID_ROWS - h.row;
		onchange(next);
	}

	function fmt(hz: number) {
		return hz >= 1000 ? `${(hz / 1000).toFixed(hz >= 10000 ? 0 : 1)}k` : `${hz}`;
	}
</script>

<svelte:window onmouseup={() => (dragging = false)} />

<div class="grid w-full justify-items-center gap-2 overflow-x-hidden" bind:clientWidth={wrapW}>
	<div
		class="grid cursor-crosshair select-none"
		style="grid-template-columns:repeat({GRID_COLS},{cellSize}px); grid-template-rows:repeat({GRID_ROWS},{cellSize}px); gap:{GAP}px"
		onmousedown={(e) => {
			dragging = true;
			apply(e);
		}}
		onmousemove={(e) => {
			const h = hit(e);
			hoverCol = h ? h.col : -1;
			if (dragging) apply(e);
		}}
		onmouseleave={() => (hoverCol = -1)}
		role="grid"
		tabindex="0"
		aria-label="Frequency bands"
	>
		{#each Array(GRID_ROWS * GRID_COLS) as _, i (i)}
			{@const col = i % GRID_COLS}
			{@const row = Math.floor(i / GRID_COLS)}
			<div
				class="grid-cell h-full w-full {tier(row) === 'g' && row >= GRID_ROWS - weights[col]
					? 'lit-green'
					: tier(row) === 'a' && row >= GRID_ROWS - weights[col]
						? 'lit-amber'
						: tier(row) === 'r' && row >= GRID_ROWS - weights[col]
							? 'lit-red'
							: col === hoverCol && row < GRID_ROWS - weights[col]
								? 'hover'
								: ''}"
			></div>
		{/each}
	</div>

	<div class="relative h-5" style="width:{gridW}px">
		<span class="freq-axis-label absolute top-0" style="left:{cx(0)}px">{fmt(FREQS[0])}</span>
		<span
			class="freq-axis-label absolute top-0"
			style="left:{cx(midCol)}px; transform:translateX(-50%)">{fmt(FREQS[midCol])}</span
		>
		<span
			class="freq-axis-label absolute top-0"
			style="left:{cx(N - 1)}px; transform:translateX(-100%)">{fmt(FREQS[N - 1])}</span
		>
	</div>
</div>

<style>
	@reference '../../routes/layout.css';

	.freq-axis-label {
		@apply font-mono text-xs font-semibold tracking-tight whitespace-nowrap text-subtext light:text-l-subtext;
	}
</style>
