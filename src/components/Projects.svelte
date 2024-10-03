<script lang="ts">
  let activeTab = "tab-1";
</script>

<h2>Projects</h2>

<div class="mytabs">
  <div role="tablist">
    <button
      role="tab"
      aria-controls="tabpanel-1"
      id="tab-1"
      aria-selected={activeTab === "tab-1" ? "true" : "false"}>inContext</button
    >
    <button
      role="tab"
      aria-controls="tabpanel-2"
      id="tab-2"
      aria-selected={activeTab === "tab-2" ? "true" : "false"}
      tabindex="-1">Compass</button
    >
    <button
      role="tab"
      aria-controls="tabpanel-3"
      id="tab-3"
      aria-selected={activeTab === "tab-3" ? "true" : "false"}
      tabindex="-1">KnowPortland</button
    >
  </div>
  <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1">
    Paris is the capital of France.
  </div>
  <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2">
    Rome is the capital of Italy.
  </div>
  <div role="tabpanel" id="tabpanel-3" aria-labelledby="tab-3">
    Athens is the capital of Greece.
  </div>
</div>

<!-- https://codepen.io/kevinpowell/pen/oNQgRKm?editors=1010 -->
<!-- https://accessibilitymadeeasy.org/accessible-tabs-a-step-by-step-guide/ -->
<!-- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tab_role -->

<!-- Mark the active tab with aria-selected="true" -->
