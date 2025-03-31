<script lang="ts">
</script>

<section class="contact" data-narrow-main>
	<h1 class="font-decorative">Contact</h1>
	<p>I'd love to chat with you about how I can help you with your website.</p>
	<p>
		You can book an initial call by filling out the form below or emailing me at
		hello@alexledger.net.
	</p>
	<form class="mt-l" name="contact" method="POST" data-netlify="true">
		<input type="hidden" name="form-name" value="contact" />
		<div class="input-group">
			<label for="name">Name</label>
			<input type="text" id="name" name="name" required />
		</div>
		<div class="input-group">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" required />
		</div>
		<div class="input-group">
			<label for="message">Message</label>
			<textarea id="message" name="message" required></textarea>
		</div>
		<button class="button mt-m" type="submit">Submit</button>
	</form>
</section>

<style>
	.contact button {
		padding-inline: 1.5em;
		padding-block: 1em;
		font-weight: var(--font-bold);
	}

	.contact .input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
</style>
