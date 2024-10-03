<script lang="ts">
  interface Project {
    projectName: string;
    description: string;
    url: string;
    videoUrl: string;
    label: string;
    linkLabel?: string;
  }
  export let project: Project;

  // TODO: figure out what goes in the label section
  // TODO: on hover, could do a diagonal animation sheen across the whole card, in the background
  // TODO: could incorporate the brand colors somewhere

  let label = "";

  // Ideas: add role
</script>

<div class="project-card">
  <div class="project-card__title-wrapper">
    <h3 class="heading-3">
      <a class="text-decoration-none" href={project.url} target="_blank"
        >{project.projectName}</a
      >
    </h3>
  </div>
  <div class="project-card__middle-entry">
    <p class="">
      {project.description}
    </p>
  </div>
  {#if project.videoUrl}
    <div class=".project-card__middle-entry padding-4">
      <div class="project-card__video-wrapper">
        <iframe
          src={project.videoUrl}
          width="100%"
          height="100%"
          title="{project.projectName} Video"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  {/if}
  <div class="project-card__bottom">
    <div class="project-card__bottom-left">
      <a href={project.url}>
        {project.linkLabel ? project.linkLabel : "View site"}
      </a>
    </div>
    <div class="project-card__bottom-right">{project.label}</div>
  </div>
</div>
