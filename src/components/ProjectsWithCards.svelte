<script lang="ts">
  import ProjectCard from "./ProjectCard.svelte";

  let projects = [
    {
      projectName: "inContext",
      description:
        "inContext is a language-learning browser extension that builds tailored, context-informed definitions of words and displays them in the webpage.",
      url: "https://incontext.fun",
      videoUrl:
        "https://www.youtube.com/embed/rZlKI_I89ZI?showinfo=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=rZlKI_I89ZI",
      label: "",
    },
    {
      projectName: "Compass",
      description:
        "An app for building guides for family & friends when they visit cities that you know, and you want to share your favorite spots.",
      url: "https://thelittlecompass.com",
      videoUrl: "",
      label: "",
    },
  ];
</script>

<h2 class="heading-2">Projects</h2>

<div class="project-cards masonry">
  {#each projects as project}
    <div class="masonry-item">
      <ProjectCard {project} />
    </div>
  {/each}
</div>

<style>
  .project-cards {
    padding-top: 2rem;
  }
</style>
