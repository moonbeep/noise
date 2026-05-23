<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Mera</title>
	<meta name="description" content="White/Pink/Brown noise generator." />
</svelte:head>

{@render children()}
