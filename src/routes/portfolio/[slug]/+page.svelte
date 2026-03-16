<script lang="ts">
	let { data } = $props();
	import PortfolioItem from '$lib/components/PortfolioItem.svelte';
	import WipBanner from '$lib/components/WipBanner.svelte';
</script>

<WipBanner />
<PortfolioItem item={data.item} />
