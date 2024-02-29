<script>
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/modern-css-reset/dist/reset.min.css"
/>

<div class="container">
  <form action="" method="POST">
    <div class="form-inputs">
      <label for="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Your email address"
        required
      />
    </div>
    <button type="submit"><span>-</span></button>
  </form>
</div>

<style>
  :root {
    --color-primary: #4c2982;
    --color-secondary: #f9d170;
    --color-bg: #f9f7f3;
    --color-text: #252525;
    --color-light: #f3f3f3;
    --color-success: #067973;
    --color-success-bg: #f5fffe;
    --color-error: #b71540;
    --color-error-bg: #fdeff3;
  }

  .container {
    margin: 4rem 2rem;
    padding: 2rem;
  }

  form {
    display: flex;
    place-items: end;
  }

  .form-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  label {
    text-transform: uppercase;
    font-weight: 600;
    color: var(--color-primary);
  }

  input {
    border: 1px solid var(--color-primary);
    height: 2.75rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  }

  button {
    height: 2.75rem;
    width: 2.75rem;
    background: var(--color-secondary);
    color: var(--color-primary);
    border-radius: 0;
    border: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    display: flex;
    justify-content: center;
    place-items: center;
  }
</style>
