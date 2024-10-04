<script>
</script>

<div class="email-signup-wrapper">
  <form action="" method="POST" class="signup__form">
    <div class="form-inputs">
      <label class="signup-label" for="email">Email Address</label>
      <input
        class="signup-input"
        type="email"
        name="email"
        id="email"
        autocapitalize="none"
        autocorrect="none"
        required
        pattern="[^@]+@[^\.]+\..+"
      />
    </div>
    <button class="signup-button" type="submit">
      <!-- This pattern is from the piccalil solution -->
      <span class="visually-hidden">Submit email</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M11.293 5.707L16.586 11H5a1 1 0 000 2h11.586l-5.293 5.293a.999.999 0 101.414 1.414l7-7a1.006 1.006 0 000-1.414l-7-7a.999.999 0 10-1.414 1.414z"
        />
      </svg></button
    >
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

  .email-signup-wrapper {
    margin: 4rem auto;
    padding: 2rem;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-primary);
    max-width: 400px;
  }

  .signup__form {
    display: flex;
    place-items: end;
  }

  .form-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .signup-label {
    text-transform: uppercase;
    font-weight: 600;
    color: var(--color-primary);
  }

  .signup-input {
    border: 1px solid var(--color-primary);
    height: 2.75rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  }

  .signup-button {
    height: 2.75rem;
    width: 2.75rem;
    background: var(--color-secondary);
    font-size: 1.625rem;
    color: var(--color-primary);
    border-radius: 0;
    border: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    display: flex;
    justify-content: center;
    place-items: center;
  }
</style>
