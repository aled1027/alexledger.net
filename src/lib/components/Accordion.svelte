<script lang="ts">
	import { ChevronUp } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	let items = $state([
		{
			title: 'Artificial Intelligence & Predictive Analytics',
			content: `Leverage AI, machine learning, and predictive modeling to uncover patterns, optimize decision-making, and forecast future trends. From risk modeling to automated insights, we turn complex data into strategic advantages.`,
			state: 'closed'
		},
		{
			title: 'Earth Observation & Geospatial Intelligence',
			content: `Harness satellite imagery and remote sensing to monitor environmental changes, assess climate risks, and inform policy and business decisions. Our expertise in Earth Observation brings clarity to dynamic landscapes.`,
			state: 'closed'
		},
		{
			title: 'Natural Language Processing & Knowledge Discovery',
			content: `Extract meaningful insights from unstructured data, documents, and text sources. Our NLP solutions enable automated information retrieval, sentiment analysis, and enhanced decision-making across industries.`,
			state: 'closed'
		},
		{
			title: 'Causal Inference & Impact Evaluation',
			content: `Go beyond correlation and uncover cause-and-effect relationships to drive better policy and business strategies. We apply cutting-edge econometrics and statistical methods to measure impact and inform key decisions.`,
			state: 'closed'
		},
		{
			title: 'Sustainability, ESG & Resilience Consulting',
			content: `Transform environmental, social, and governance (ESG) data into actionable insights. We help organizations measure sustainability performance, assess climate risks, and develop resilient strategies for a changing world.`,
			state: 'closed'
		},
		{
			title: 'Data Management & Strategic Insights',
			content: `Ensure data quality, integration, and accessibility with our advanced data management solutions. We help organizations build scalable analytics pipelines and translate raw data into clear, actionable intelligence.`,
			state: 'closed'
		}
	]);

	// Add a function to generate unique IDs for panels
	const getPanelId = (idx: number) => `accordion-panel-${idx}`;
	const getButtonId = (idx: number) => `accordion-button-${idx}`;

	function toggleItem(itemIdx: number) {
		const item = items[itemIdx];
		const isOpen = item.state === 'open';

		// Close all other items
		items.forEach((item, idx) => {
			if (idx == itemIdx) {
				item.state = isOpen ? 'closed' : 'open';
			} else {
				item.state = 'closed';
			}
		});
	}
</script>

<div class="accordion">
	{#each items as item, itemIdx}
		<div class="accordion__item" data-state={item.state}>
			<button
				class="accordion__item__button"
				onclick={() => toggleItem(itemIdx)}
				id={getButtonId(itemIdx)}
				aria-controls={getPanelId(itemIdx)}
				aria-expanded={item.state === 'open'}
			>
				<span class="accordion__item__button-text">{item.title}</span>
				<div class="accordion__item__button-icon" data-state={item.state}>
					<ChevronUp />
				</div>
			</button>
			{#if item.state === 'open'}
				<div
					class="accordion__item__content"
					transition:slide
					role="region"
					id={getPanelId(itemIdx)}
					aria-labelledby={getButtonId(itemIdx)}
				>
					<p>{item.content}</p>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.accordion {
		display: flex;
		flex-direction: column;
		gap: 0;
		max-width: 1000px;
		margin-inline: auto;
	}

	.accordion__item {
		border-bottom: 1px solid var(--color-text-mid);
		padding-block: 1rem;
		padding-inline: 0;
	}

	.accordion__item__button {
		font-size: var(--size-step-1);
		line-height: 1.2;
		font-weight: 700;
		display: inline-flex;
		gap: 1rem;
		justify-content: space-between;
		padding-inline: 0;
		align-items: center;
		width: 100%;
		border: none;
		cursor: pointer;
		color: var(--color-text);
		background: transparent;
		text-align: left;
	}

	.accordion__item__button-icon {
		transform: rotate(0deg);
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 0.2s;
	}

	.accordion__item__button-icon[data-state='open'] {
		transform: rotate(-180deg);
	}

	.accordion__item__content {
		padding-block: 1.25rem 0.75rem;
		padding-inline: 0;
		font-size: var(--size-step-0);
		font-weight: 400;
	}

	.accordion__item__content p {
		margin-block: 0;
	}
</style>
