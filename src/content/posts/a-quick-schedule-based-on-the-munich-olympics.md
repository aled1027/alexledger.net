---
title: "A Quick Schedule based on the Munich Olympics"
draft: false
date: 2024-08-15T08:00:00.000Z
includeToc: false
tags:
  - design
  - frontend
  - svelte
  - library
---

As a quick exercise, I created a schedule inspired by the 1972 Munich Olympics schedule.

Here it is:

<iframe src="https://curious-twilight-86ab2d.netlify.app/schedule" width="100%" height="400px" style="border:none;" scrolling="no"></iframe>

This is the reference image I used:

<img
  src="/images/munich-olympics-schedule.jpg"
  alt="Munich Olympics Schedule"
  style="margin-inline:auto;width:100%;"
/>

And here's the source code:

```svelte
<script lang="ts">
  // Reference image:
  // https://image.invaluable.com/housePhotos/PosterConnection/83/740183/H2180-L316434863.jpg

  // SVGs from thenounproject

  let dates = [
    new Date("2024-08-14"),
    new Date("2024-08-15"),
    new Date("2024-08-16"),
  ];

  let data = [
    { name: "Tech Help", values: [0, 1, 1], class: "computer-svg" },
    { name: "Reading Time", values: [0, 0, 1], class: "book-svg" },
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="container">
  <div class="top">
    <h1 class="heading-1">Library Events Schedule</h1>
  </div>
  <table>
    <tr class="first">
      <th>Schedule issued Aug 12, 2024</th>
      {#each dates as date}
        <td>
          <div class="block">
            <span>{date.toLocaleString("en-US", { month: "short" })}</span>
            <span>{date.getDate()}.</span>
          </div>
        </td>
      {/each}
      <!-- Empty last column -->
      <td></td>
    </tr>
    {#each data as record}
      <tr>
        <th>{record.name}</th>
        {#each record.values as value}
          <td data-value={value ? "yes" : "no"}>
            {#if value}
              <div class={record.class}></div>
            {/if}
          </td>
        {/each}
        <!-- Empty last column -->
        <td></td>
      </tr>
    {/each}

    <!-- Empty bottom row -->
    <tr>
      <th></th>
      {#each dates as date}
        <td></td>
      {/each}
      <td></td>
    </tr>
  </table>
</div>

<style>
  :root {
    --color-bg: oklch(60% 0.069 295.38);
    --color-bg-transparent: oklch(50% 0.069 295.38 / 0.8);
    --color-header: #dbcbd7;
    --color-gray-100: #beb1d4;
    --color-gray-900: #403856;
    --color-blue-300: #97c4d2;
    --color-green-300: #c7d85d;
  }

  .container {
    background-color: var(--color-bg);
    color: var(--color-gray-900);
    width: fit-content;
    background: linear-gradient(
        var(--color-bg-transparent),
        var(--color-bg-transparent)
      ),
      url("noise.svg");

    /* background: var(--color-bg-transparent), url("noise.svg"); */

    font-family: "Work Sans", system-ui;
    font-optical-sizing: auto;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.5px;
  }

  .top {
    height: 20vw;
    position: relative;
  }

  .heading-1 {
    color: var(--color-header);
    font-size: inherit;
    font-weight: inherit;
    position: absolute;
    left: 40%;
  }

  table {
    border-collapse: collapse;
  }

  td,
  th {
    text-align: left;
    padding: 0.325rem;
    position: relative;
    border-bottom: 2px solid var(--color-gray-100);
    border-right: 2px solid rgba(0, 0, 0, 0.3);
    height: 4rem;
  }

  th {
    width: 20ch;
    font: inherit;
    padding: 0.25em 0.5em 0.5em 2rem;
    vertical-align: top;
    text-wrap: balance;
  }

  td {
    width: 8ch;
    line-height: 1.1;
    vertical-align: top;
    height: 4rem;
  }

  /* Color in the yeses */
  td[data-value="yes"] {
    background-color: var(--color-blue-300);
  }

  /* Remove the borders on the far right and bottom */
  tr td:last-child {
    border-right: none;
  }

  table tr:last-child td,
  table tr:last-child th {
    border-bottom: none;
  }

  .computer-svg {
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200"><path d="M280.95 335.53c-3.52.79-6 3.95-5.9 7.56v408.56a7.56 7.56 0 0 0 7.55 7.55h634.8a7.56 7.56 0 0 0 7.56-7.55V343.09a7.56 7.56 0 0 0-7.56-7.56H282.6a7.3 7.3 0 0 0-1.65 0zm9.21 15.11h619.7V692.6h-619.7zm0 357.07h619.7v36.37h-619.7z" fill-rule="evenodd" fill="white" /><path d="m533.41 787.54-.48.23h-.23c-.49.11-.96.27-1.42.47-.5.2-.97.43-1.41.71-.54.41-1.01.89-1.42 1.42v.24c-.47.49-.86 1.05-1.18 1.65v.23l-.24.47v.24a7.5 7.5 0 0 0-.23 3.54c-.24 6.84-2.23 10.71-5.43 14.17-3.44 3.7-8.9 6.72-14.88 9.92-5.99 3.2-12.55 6.48-18.19 12.04-5.63 5.55-9.65 13.82-9.44 24.09a7.56 7.56 0 0 0 7.55 7.56h227.2a7.56 7.56 0 0 0 7.55-7.56c.18-10.27-3.81-18.54-9.45-24.1-5.64-5.54-12.44-8.84-18.42-12.03s-11.22-6.22-14.64-9.92c-3.23-3.5-5.25-7.42-5.43-14.4.03-.4.03-.8 0-1.19.02-.31.02-.63 0-.94a7.61 7.61 0 0 0-1.42-3.55c-.2-.41-.44-.8-.71-1.18h-.24c-.28-.34-.6-.66-.94-.95h-.24c-.15-.08-.3-.16-.47-.23h-.23c-.15-.16-.3-.32-.47-.47h-.23l-.47-.23h-.94a8.65 8.65 0 0 0-.47-.23H535.08a6.36 6.36 0 0 0-.94 0 7.2 7.2 0 0 0-.71 0zm7.8 15.11h117.6c1.29 7.63 4.42 13.75 8.74 18.43 5.65 6.1 12.54 9.71 18.66 12.98 6.11 3.28 11.54 6.4 14.88 9.69 1.77 1.74 3.16 3.46 4.01 5.66H494.92c.85-2.2 2.25-3.92 4.02-5.66 3.33-3.28 8.76-6.42 14.88-9.69 6.11-3.27 13-6.88 18.65-12.98 4.33-4.68 7.44-10.8 8.74-18.43z" fill-rule="evenodd" fill="white"/></svg>')
      no-repeat center center;
    background-size: cover;
    height: 100%;
  }

  .book-svg {
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><path d="M588.37 883.92V309.1c-39.1-33.66-97.6-56.63-161.72-71.53-84.28-19.6-177.71-25.03-250.69-22.22v583.22c75.19-2.81 171.19 2.86 257.95 23.06 58.31 13.55 112.69 33.7 154.4 62.35zm32.72-571.26v574.13c40.92-29.16 94.83-49.73 152.68-63.7 84.14-20.3 177.14-26.68 250.22-24.94V214.89c-70.83-1.78-161.11 4.36-242.53 24-64.08 15.47-122.3 39.19-160.31 73.78zm502.36 604.92c-95.72 5.48-198.61 16.36-294.32 34.97-79.83 15.52-154.55 36.42-215.63 64.08a16.47 16.47 0 0 1-7.5 1.4c-.38.05-.8.05-1.22.05a16.3 16.3 0 0 1-11.06-4.31c-64.88-28.55-140.26-49.83-220.31-65.25-95.63-18.42-197.68-28.46-296.44-32.58h-.61A16.34 16.34 0 0 1 60 899.58V303.71c0-6.42 3.7-11.95 9.1-14.67 14.38-8.53 27.74-20.53 40.12-35.95 12.98-16.22 24.84-36.24 35.58-60.05a16.27 16.27 0 0 1 14.67-9.61c77.3-4.36 181.26.6 274.55 22.27 67.26 15.65 129.32 40.07 172.78 76.17 42.23-35.06 102.14-59.06 167.02-74.72 90.33-21.8 190.87-27.56 265.97-24.38h.56c6.99 0 12.94 4.36 15.28 10.55 10.64 23.44 22.36 43.13 35.16 59.16 12.6 15.75 26.3 27.89 41.01 36.47 5.02 2.9 7.93 8.1 8.16 13.5.05.42.05.84.05 1.26v597.47c0 9.05-7.32 16.36-16.36 16.36h-.19zm-1030.7-48a201.2 201.2 0 0 0 24.1-20.53c10.77-10.88 20.1-23.16 26.43-36.84l.05-550.14a222.6 222.6 0 0 1-8.67 11.49c-12.85 16.03-26.82 29.1-41.91 39.19zm77.53-38.1c73.73-3.34 169.92 1.82 256.45 21.93 64.13 14.9 122.58 37.92 161.72 71.53v51.05c-62.86-25.7-133.97-45.2-208.87-59.58-82.08-15.8-168.89-25.55-254.44-30.7a215.47 215.47 0 0 0 14.9-13.7c11.96-12.04 22.41-25.54 30.29-40.54zm907.26 56.38c-84.14 6.19-171.98 16.55-254.53 32.58-73.31 14.25-142.64 33-201.84 57.28v-49.17c38.02-34.64 96.28-58.31 160.31-73.78 83.58-20.16 176.44-26.11 248.02-23.81 7.88 15.23 18.47 28.96 30.56 41.15a221.72 221.72 0 0 0 17.49 15.8zm-20.81-75.65c6.37 13.64 15.65 25.92 26.44 36.84a196.9 196.9 0 0 0 24.09 20.53V312.05c-15.1-10.08-29.06-23.16-41.9-39.19-2.96-3.65-5.82-7.5-8.68-11.48V812.2zm-540-465.74a16.34 16.34 0 0 1-11.86 30.42c-34.97-13.74-74.06-23.95-114.14-31.27-46.36-8.44-94.22-13.03-138.9-14.72a16.3 16.3 0 1 1 1.18-32.57c46.08 1.73 95.48 6.46 143.48 15.23 42.33 7.69 83.48 18.47 120.28 32.95zm430.18-47.63a16.3 16.3 0 1 1 1.54 32.58c-45.23 2.3-93.6 7.64-140.1 16.97-40.04 8.1-78.66 19.17-112.65 33.84a16.3 16.3 0 0 1-12.94-29.9c36.2-15.66 77.02-27.38 119.17-35.86 48.32-9.75 98.34-15.28 144.94-17.63zM516.73 442.7a16.34 16.34 0 0 1-11.86 30.42c-34.97-13.73-74.06-23.95-114.14-31.26-46.36-8.44-94.22-13.03-138.9-14.72a16.3 16.3 0 1 1 1.18-32.58c46.08 1.73 95.48 6.47 143.48 15.23 42.33 7.7 83.48 18.47 120.28 32.96zm430.18-47.62a16.3 16.3 0 1 1 1.54 32.57c-45.23 2.3-93.6 7.64-140.1 16.97-39.9 8.07-78.47 19.13-112.65 33.9a16.35 16.35 0 1 1-12.89-30.05c36-15.57 76.83-27.28 119.16-35.82 48.33-9.75 98.35-15.28 144.94-17.62zM516.73 538.94a16.34 16.34 0 0 1-11.86 30.42c-34.97-13.74-74.06-23.95-114.14-31.27-46.36-8.44-94.22-13.03-138.9-14.72a16.3 16.3 0 1 1 1.18-32.57c46.08 1.73 95.48 6.46 143.48 15.23 42.33 7.69 83.48 18.47 120.28 32.95zM946.9 491.3a16.3 16.3 0 1 1 1.54 32.58c-45.23 2.3-93.6 7.64-140.1 16.97-39.9 8.06-78.47 19.12-112.65 33.89a16.35 16.35 0 1 1-12.89-30.05c36-15.56 76.83-27.28 119.16-35.81 48.33-9.75 98.35-15.28 144.94-17.63zM516.73 635.17a16.34 16.34 0 0 1-11.86 30.42c-34.97-13.73-74.06-23.95-114.14-31.26-46.36-8.44-94.22-13.03-138.9-14.72a16.3 16.3 0 1 1 1.18-32.58c46.08 1.73 95.48 6.47 143.48 15.23 42.33 7.7 83.48 18.47 120.28 32.96zm430.18-47.62a16.3 16.3 0 1 1 1.54 32.57c-45.23 2.3-93.6 7.64-140.1 17.02-40.04 8.1-78.66 19.17-112.65 33.84a16.3 16.3 0 0 1-12.94-29.9c36.2-15.66 77.02-27.38 119.17-35.86 48.32-9.75 98.34-15.28 144.94-17.63zM516.73 731.4a16.34 16.34 0 0 1-11.86 30.42c-34.97-13.74-74.06-23.95-114.14-31.27-46.36-8.44-94.22-13.03-138.9-14.72a16.3 16.3 0 1 1 1.18-32.57c46.08 1.73 95.48 6.46 143.48 15.23 42.33 7.69 83.48 18.47 120.28 32.95zm430.18-47.63a16.3 16.3 0 1 1 1.54 32.58c-45.23 2.3-93.6 7.64-140.1 17.01-40.04 8.11-78.66 19.18-112.65 33.85a16.3 16.3 0 0 1-12.94-29.9c36.2-15.66 77.02-27.38 119.17-35.87 48.32-9.75 98.34-15.28 144.94-17.62z" fill-rule="evenodd" fill="white"/></svg>')
      no-repeat center center;
    background-size: cover;
    height: 90%;
  }

  .block > * {
    display: block;
  }
</style>

```
