<script lang="ts">
  let projectName = "inContext";
  let description =
    "inContext is a language-learning browser extension that builds tailored, context-informed definitions of words and displays them in the webpage.";
  let url = "https://incontext.fun";
  let videoUrl =
    "https://www.youtube.com/embed/rZlKI_I89ZI?showinfo=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=rZlKI_I89ZI";
  //   let videoUrl = "";

  // TODO: figure out what goes in the label section

  let label = "";

  // Ideas: add role
</script>

<div class="project-card">
  <div class="project-card__title-wrapper">
    <h3 class="heading-3">
      <a class="text-decoration-none" href={url} target="_blank"
        >{projectName}</a
      >
    </h3>
  </div>
  <div class="project-card__middle-entry">
    <p class="">
      {description}
    </p>
  </div>
  {#if videoUrl}
    <div class=".project-card__middle-entry padding-4">
      <div class="project-card__video-wrapper">
        <iframe
          src={videoUrl}
          width="100%"
          height="100%"
          title="{projectName} Video"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  {/if}
  <div class="project-card__bottom">
    <div class="project-card__bottom-left">
      <a href={url}>Visit site</a>
    </div>
    <div class="project-card__bottom-right">{label}</div>
  </div>
</div>
