<script lang="ts">
  let activeTab = "tab-1";

  let inContextBgColor = "hsl(195.37, 54.75%, 43.33%)";
  let inContextColor = "white";

  let compassBgColor = "hsl(256.32, 44.88%, 49.8%)";
  let compassColor = "white";

  let knowportlandBgColor = "hsl(150.87, 94.5%, 31.37%)";
  let knowPortlandColor = "white";

  // TODO: I don't understand why tabindex="-1" is needed for the buttons
  // but that's what's on https://accessibilitymadeeasy.org/accessible-tabs-a-step-by-step-guide/

  function setTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<!-- https://codepen.io/kevinpowell/pen/oNQgRKm?editors=1010 -->
<!-- https://accessibilitymadeeasy.org/accessible-tabs-a-step-by-step-guide/ -->
<!-- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role -->

<!-- Mark the active tab with aria-selected="true" -->

<h2 class="heading-1">Projects</h2>

<section class="tabs">
  <div role="tablist">
    <button
      class="tab-button"
      style="--bg-color: {inContextBgColor}; --color: {inContextColor};"
      role="tab"
      aria-controls="tabpanel-1"
      id="tab-1"
      aria-selected={activeTab === "tab-1" ? "true" : "false"}
      on:click={() => setTab("tab-1")}>inContext</button
    >
    <button
      class="tab-button"
      style="--bg-color: {compassBgColor}; --color: {compassColor};"
      role="tab"
      aria-controls="tabpanel-2"
      id="tab-2"
      aria-selected={activeTab === "tab-2" ? "true" : "false"}
      tabindex="-1"
      on:click={() => setTab("tab-2")}>Compass</button
    >
    <button
      class="tab-button"
      style="--bg-color: {knowportlandBgColor}; --color: {knowPortlandColor};"
      role="tab"
      aria-controls="tabpanel-3"
      id="tab-3"
      aria-selected={activeTab === "tab-3" ? "true" : "false"}
      tabindex="-1"
      on:click={() => setTab("tab-3")}>Know Portland</button
    >
  </div>

  <div class="tabpanel-container">
    <div
      class="tabpanel"
      style="--bg-color: {inContextBgColor}; --color: {inContextColor};"
      role="tabpanel"
      id="tabpanel-1"
      aria-labelledby="tab-1"
      data-state={activeTab === "tab-1" ? "active" : "inactive"}
    >
      <div class="tabpanel__inner flow">
        <h3 class="tab-heading">inContext</h3>
        <p>
          inContext is a language-learning browser extension that builds
          tailored, context-informed definitions of words and displays them in
          the webpage.
        </p>

        <div class="tabpanel__video">
          <iframe
            src="https://www.youtube.com/embed/rZlKI_I89ZI?showinfo=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=rZlKI_I89ZI"
            width="100%"
            height="100%"
            title="inContext Video"
            frameborder="0"
          ></iframe>
        </div>
        <a
          href="https://incontext.fun"
          target="_blank"
          rel="noopener noreferrer"
          class="button"
          data-type="project"
          ><span>View site</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            height="20"
            width="20"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </div>
    <div
      class="tabpanel"
      style="--bg-color: {compassBgColor}; --color: {compassColor};"
      role="tabpanel"
      id="tabpanel-2"
      aria-labelledby="tab-2"
      data-state={activeTab === "tab-2" ? "active" : "inactive"}
    >
      <div class="tabpanel__inner flow">
        <h3 class="tab-heading">Compass</h3>
        <p>Compass...</p>
        <div class="tabpanel__video">
          <iframe
            src="https://www.youtube.com/embed/rZlKI_I89ZI?showinfo=0&autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&controls=0&disablekb=1&playlist=rZlKI_I89ZI"
            width="100%"
            height="100%"
            title="inContext Video"
            frameborder="0"
          ></iframe>
        </div>
        <a
          href="https://thelittlecompass.com"
          target="_blank"
          rel="noopener noreferrer"
          class="button"
          data-type="project"
          ><span>View site</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            height="20"
            width="20"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </div>
    <div
      class="tabpanel"
      style="--bg-color: {knowportlandBgColor}; --color: {knowPortlandColor};"
      role="tabpanel"
      id="tabpanel-3"
      aria-labelledby="tab-3"
      data-state={activeTab === "tab-3" ? "active" : "inactive"}
    >
      <div class="tabpanel__inner flow">
        <h3 class="tab-heading">Know Portland</h3>
        <p>
          Know Portland is a living project providing residents of Portland with
          information about what's happening.
        </p>
        <a
          href="https://knowportland.org"
          target="_blank"
          rel="noopener noreferrer"
          class="button"
          data-type="project"
          ><span>View site</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            height="20"
            width="20"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>
