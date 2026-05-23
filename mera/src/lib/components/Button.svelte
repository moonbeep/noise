<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onClick?: () => void;
		className?: string;
		disabled?: boolean;
		active?: boolean;
		border?: boolean;
		children?: Snippet;
	}

	let {
		onClick = () => {},
		className = '',
		disabled = false,
		active = false,
		border = true,
		children
	}: Props = $props();
</script>

<button
	onclick={onClick}
	{disabled}
	class="cursor-pointer rounded border-subtext px-4 py-2.5 font-mono text-sm font-bold tracking-widest text-content transition-all duration-100 hover:border-content disabled:cursor-not-allowed disabled:opacity-50 light:border-l-subtext light:text-l-content light:hover:border-(--color-l-content) {active
		? 'bg-backdrop light:bg-l-backdrop'
		: ''} {border ? 'border-2' : 'border-0'} {className}"
>
	{@render children?.()}
</button>
