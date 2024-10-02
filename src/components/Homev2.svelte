<script lang="ts">
  // Inspo: https://pudding.cool/
</script>

<div class="landing-page">
  <section class="top-section | section">
    <h1 class="heading-1 fs-1000">Alex Ledger</h1>
    <p class="landing-page-text">
      <span class="sentence sentence1">
        is a software developer with skills spanning the full stack.
      </span>
      <span class="sentence sentence2">
        Alex loves building cool and useful things about <a href="/"
          >traveling</a
        >,
        <a href="/">language learning tools</a>
        leveraging the latest AI developments, and community tools to support Portland,
        OR.
      </span>
      <span class="sentence sentence3">
        Alex writes on his <a href="/posts">blog</a> about
        <a href="/tags/foo">tech</a>, <a href="/tags/foo">community</a>, and
        <a href="/tags/foo">more</a>.
      </span>
    </p>
  </section>

  <section class="section"></section>
</div>

<style>
  /* .landing-page { } */
  .section {
    margin-top: 4rem;
  }

  .landing-page-text {
    /* font-size: 2.5rem; */
    /* Font-size idea from pudding.cool */
    text-wrap: pretty;
    font-size: clamp(1.5rem, 3.25vw, 3.25rem);
    line-height: 1.5;
  }

  a {
    /* text-decoration: underline;
    text-decoration-thickness: 3px;
    text-decoration-skip-ink: none;
    text-decoration-color: hsl(255.65, 81.3%, 62.35%); */
  }

  .sentence {
    opacity: 0;
    animation: fadeIn 2s forwards;
  }
  .sentence a {
    animation-delay: 4s;
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-decoration-skip-ink: none;
    text-decoration-color: hsl(255.65, 81.3%, 62.35%);
  }
  .sentence1 {
    animation-delay: 0.5s;
  }

  .sentence2 {
    animation-delay: 1.5s;
  }

  .sentence3 {
    animation-delay: 3.5s;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
</style>
