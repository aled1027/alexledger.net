<script>
  // This an implementation of Picalli's solution to the frontend progress stepper challenge.
  // WARNING: THIS CODE IS COPIED AND PASTED FROM PICALLI'S SOLUTION BLOG POST
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/modern-css-reset/dist/reset.min.css"
/>

<div class="container">
  <div class="stepper">
    <ol role="list" aria-label="Purchase steps">
      <li data-status="complete">
        <!-- Hide the step from screen readers because it's covered with the ol -->
        <span aria-hidden="true">Step one</span>
        <strong>Your basket</strong>
      </li>
      <li data-status="complete">
        <span aria-hidden="true">Step two</span>
        <strong>Your details</strong>
      </li>
      <li data-status="complete">
        <!-- <li aria-current="step"> -->
        <span aria-hidden="true">Step three</span>
        <strong>Payment</strong>
      </li>
      <!-- <li> -->
      <li aria-current="step">
        <span aria-hidden="true">Step four</span>
        <strong>Order complete</strong>
      </li>
    </ol>
  </div>
</div>

<style>
  :root {
    --color-light: #fdfdfd;
    --color-dark: #27474e;
    --color-mid: #496970;
    --color-primary: #f3344a;
    --color-primary-glare: #f4d7da;
    --color-secondary: #678c94;
    --color-secondary-glare: #ebf0f1;
    --font-condensed: "Saira Condensed", sans-serif;
    --font-sans: "Asap", sans-serif;
    --shadow: 0px 0px 40px rgba(39, 71, 78, 0.1);
    --size-300: 0.88rem;
    --size-400: 1rem;
    --size-500: 1.44rem;
    --size-600: 2rem;
    --size-700: 2.5rem;
  }

  .container {
    background: var(--color-light);
    color: var(--color-dark);
    display: grid;
    place-items: center;
  }

  .stepper {
    --stepper-y-space: var(--size-500);
    --stepper-x-space: var(--size-700);
    --stepper-modifier: 1.5ex;

    border: 1px solid var(--color-secondary-glare);
    padding: var(--size-600);
    box-shadow: var(--shadow);
    border-radius: var(--size-400);
    min-width: 20rem;
    counter-reset: steps;
  }

  .stepper [role="list"] {
    font-family: var(--font-condensed);
    line-height: 1.1;
    text-transform: uppercase;
    margin: calc(var(--stepper-y-space) * -1) 0 0 0;
    padding: 0;
    list-style: none;
  }

  .stepper li {
    padding-left: var(--stepper-x-space);
    padding-top: var(--stepper-y-space);
    position: relative;
    counter-increment: steps;
  }

  .stepper li::before,
  .stepper li::after {
    display: none;
    content: "";
    width: 2px;
    background: var(--color-primary);
    position: absolute;
    left: 7px;
  }

  /* Up line */
  .stepper li::before {
    height: calc(var(--stepper-y-space) + var(--stepper-modifier));
    top: 0;
  }

  /* Down line */
  .stepper li::after {
    height: 100%;
    top: calc(var(--stepper-y-space) + var(--stepper-modifier));
  }

  .stepper li[aria-current="step"]::before {
    display: block;
  }

  .stepper li[data-status="complete"]::after,
  .stepper li[data-status="complete"]::before {
    display: block;
  }

  /* Always hide the top up line and the bottom down line */
  .stepper li:first-child::before,
  .stepper li:last-child::after {
    display: none;
  }

  .stepper strong {
    display: block;
    font-family: var(--font-sans);
    font-size: var(--size-500);
    text-transform: none;
    position: relative;
  }

  /* Dot */
  .stepper strong::after {
    content: "";
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    background-color: var(--color-secondary-glare);
    position: absolute;
    bottom: 100%;
    left: calc(var(--stepper-x-space) * -1);
    border: 1px solid var(--color-secondary);
    transform: translateY(50%);
    z-index: 1;
  }

  .stepper strong::before {
    content: counter(steps, decimal-leading-zero);
    speak-as: numbers;
    font-family: var(--font-condensed);
    font-weight: 900;
    color: var(--color-secondary-glare);
    position: absolute;
    bottom: 2ex;
    left: -1ch;
    z-index: -1;
    line-height: 1;
  }

  .stepper [aria-current="step"] strong::after {
    background-color: var(--color-primary-glare);
    border-color: var(--color-primary);
  }

  .stepper [data-status="complete"] strong::after {
    background-color: var(--color-primary);
    background-image: url('data:image/svg+xml;utf8,<svg fill="white" width="9" height="7" xmlns="http://www.w3.org/2000/svg"><path d="M7.868.141a.474.474 0 01.03.652L3.244 6.087a.433.433 0 01-.627.028L.292 3.911a.474.474 0 01-.03-.652.433.433 0 01.628-.028l1.996 1.892L7.24.17A.433.433 0 017.868.14z"/></svg>');
    background-size: 9px 7px;
    background-position: 3px center;
    background-repeat: no-repeat;
    border-color: var(--color-primary);
  }
</style>
