<script>	
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import favicon from '$lib/assets/favicon.svg';
	import AppHeader from '$lib/components/custom_ui/app_header.svelte';
	import { Toaster } from "$lib/components/ui/sonner/index.js";

	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster />
<div>
	<AppHeader />
	{@render children?.()}

</div>
