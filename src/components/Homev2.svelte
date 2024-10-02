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
  .section {
    margin-top: 4rem;
  }

  .heading-1 {
    letter-spacing: -0.05em;
  }

  .landing-page-text {
    text-wrap: pretty;
    font-size: clamp(1.25rem, 3.25vw, 3.25rem);
    line-height: 1.6;
  }

  .sentence {
    opacity: 0;
    animation: fadeIn 2s forwards;
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

  .sentence a {
    text-decoration: none;
    position: relative;
  }

  .sentence a::after {
    content: "";
    opacity: 0;
    position: absolute;
    left: 0;
    bottom: 2px;
    width: 0;
    height: 3px;
    background-color: hsl(255.65, 81.3%, 62.35%);
    animation: drawUnderline 2s forwards;
  }

  @keyframes drawUnderline {
    to {
      width: 100%;
      opacity: 1;
    }
  }
</style>
