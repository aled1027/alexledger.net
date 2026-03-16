<script lang="ts">
	let { data } = $props();
	const item = data.item;
</script>

<section class="flow">
	<h1>{item.slug}</h1>
	<img src={item.imageUrl} alt={item.imageAlt} style="view-transition-name: {item.label}" />
</section>
