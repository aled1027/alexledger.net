<script lang="ts">
  let activeTab = "tab-1";

  let inContextBgColor = "hsl(195.37, 54.75%, 43.33%)";
  let inContextColor = "white";

  let compassBgColor = "hsl(256.32, 44.88%, 49.8%)";
  let compassColor = "white";

  let knowportlandBgColor = "hsl(150.87, 94.5%, 21.37%)";
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
      on:click={() => setTab("tab-3")}>KnowPortland</button
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
      Compass is a web application that allows users to search for and save
      hiking trails. It was built with React, Redux, and the Hiking Project API.
    </div>
    <div
      class="tabpanel"
      style="--bg-color: {knowportlandBgColor}; --color: {knowPortlandColor};"
      role="tabpanel"
      id="tabpanel-3"
      aria-labelledby="tab-3"
      data-state={activeTab === "tab-3" ? "active" : "inactive"}
    >
      KnowPortland info here.
    </div>
  </div>
</section>
