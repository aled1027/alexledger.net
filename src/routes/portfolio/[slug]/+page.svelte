<script lang="ts">
	let { data } = $props();
	import PortfolioItem from '$lib/components/PortfolioItem.svelte';
</script>

<PortfolioItem item={data.item} />
