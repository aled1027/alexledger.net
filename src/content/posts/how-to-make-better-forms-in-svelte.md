---
title: "How To Make Better Forms In Svelte"
date: 2024-09-29T08:00:00.000Z
draft: false
includeToc: false
tags:
  - svelte
  - javascript
  - html
  - forms
  - accessibility
---

Making good forms isn't easy. It's always looks like it's going to be straightforward, but there's so many things to consider, like accessibility, validation, user experience, prettiness and more.

I was making forms for one of my Svelte projects and after some digging, I found Josh Collinsworth's [contact page code](<https://github.com/josh-collinsworth/joco-sveltekit/blob/main/src/routes/(site)/contact/%2Bpage.svelte>), which is a fantastically implemented svelte form.

I've generalized and adapted it here: [svelte repl link](https://svelte.dev/repl/ade4b4d9f42c457283ed82239a04f9bf?version=4.2.19).

And here's the code for reading:

```svelte
<script>
  let formData = {
    name: '',
    favoriteLetter: ''
  };

  let hasSubmitted = false;
  let showError = false;

  async function handleSubmit(e) {
    let badName = formData.name === '';
    let badLetter = formData.favoriteLetter === '';

    if (badName || badLetter) {
      showError = true;
      return;
    }

    console.log('Submitting', formData);
  }
</script>

<h1>Form Demo!</h1>

{#if !hasSubmitted}
  <form on:submit|preventDefault={handleSubmit}>
    <!-- Pressing enter or pressing the submit button calls handleSubmit-->
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name" bind:value={formData.name} placeholder="Billy" required />
    </div>
    <div>
      <label for="letter">Favorite letter:</label>
      <input
        type="text"
        id="letter"
        bind:value={formData.favoriteLetter}
        placeholder="z"
        maxlength="1"
        minlength="1"
        required
      />
    </div>

    {#if showError}
      <div class="error">Please be sure all above fields are filled out. Thanks!</div>
    {/if}

    <button type="submit">Submit</button>
  </form>
{:else}
  <h3>Thanks for your form!</h3>
{/if}
```
