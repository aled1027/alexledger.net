<script lang="ts">
  interface Project {
    projectName: string;
    description: string;
    url: string;
    videoUrl: string;
    imageUrl: string;
    label: string;
    linkLabel?: string;
    blogPost?: string;
    youtube?: string;
  }
  export let project: Project;

  // TODO: figure out what goes in the label section
  // TODO: on hover, could do a diagonal animation sheen across the whole card, in the background
  // TODO: could incorporate the brand colors somewhere
  // TODO: could have video pop-outable like https://cleanshot.com/
  // TODO: improvements could include tags of technology used

  let label = "";

  let videoUrl = project.videoUrl;
  if (videoUrl !== "") {
    let youtubeId = project.videoUrl.split("/").pop();
    let videoPostfix =
      "?showinfo=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1";
    videoUrl = `https://www.youtube.com/embed/${youtubeId}${videoPostfix}&playlist=${youtubeId}`;
  }

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
  {#if project.imageUrl}
    <div class=".project-card__middle-entry padding-4">
      <div class="project-card__asset-wrapper">
        <img
          class="project-card__cover-asset"
          src={project.imageUrl}
          alt="{project.projectName} Image"
        />
      </div>
    </div>
  {/if}
  {#if project.videoUrl}
    <div class=".project-card__middle-entry padding-4">
      <div class="project-card__asset-wrapper">
        <iframe
          src={videoUrl}
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
    <div class="project-card__bottom-right">
      {#if project.blogPost}
        <a href={project.blogPost} target="_blank">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            height="24"
            width="24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </a>
      {/if}

      {#if project.youtube}
        <a href={project.youtube} target="_blank">
          <svg
            width="28"
            height="28"
            viewBox="0 0 1200 1200"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M858.61 281.53H341.39c-89.016 0-161.39 72.328-161.39 161.39v314.16c0 88.922 72.375 161.39 161.39 161.39H858.7c88.922 0 161.39-72.375 161.39-161.39l.047-314.16c-.14-89.062-72.516-161.39-161.53-161.39zM732 622.22 520.78 752.16c-17.297 10.547-39.469-1.781-39.469-22.078v-249.84c0-19.781 21.469-32.297 38.625-22.547l211.22 119.86c17.156 9.75 17.625 34.312.844 44.672z"
            /></svg
          >
        </a>
      {/if}
    </div>
  </div>
</div>
