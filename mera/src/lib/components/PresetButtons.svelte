<script lang="ts">
	import { presets } from '$lib/utils/noiseGenerator';
	import type { Weights } from '$lib/utils/noiseGenerator';
	import Button from './Button.svelte';

	interface Props {
		active: string | null;
		onSelect: (name: string, w: Weights) => void;
	}

	let { active, onSelect }: Props = $props();
</script>

<div class="grid grid-cols-3 gap-2">
	{#each Object.keys(presets) as name (name)}
		<Button
			active={active === name}
			onClick={() => onSelect(name, presets[name])}
			className="px-0 py-2.5 text-xs leading-tight"
		>
			{name.toUpperCase()}
		</Button>
	{/each}
</div>
