import { LitElement, html, css } from "lit";

class InfoButton extends LitElement {
  constructor() {
    super();
    // TODO: probably dont need id anymore
    this.id = Math.random().toString(36).slice(2, 11);
  }

  render() {
    return html`
      <div class="content">
        <button
          id="info-${this.id}"
          class="hoverable icon-container text-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="icon">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"></path>
          </svg>
        </button>
      </div>
      <dialog id="dialog-${this.id}" class="hovercard">
        <slot></slot>
        <button class="close-button">Close</button>
      </dialog>
    `;
  }

  firstUpdated() {
    const closeButton = this.shadowRoot.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      closeButton.parentElement.close();
    });

    const infoButton = this.shadowRoot.querySelector(`#info-${this.id}`);
    infoButton.addEventListener("click", () =>
      this.handleInfoClick(infoButton)
    );
  }

  handleInfoClick(target) {
    const box = this.shadowRoot.querySelector(`#dialog-${this.id}`);
    if (box.open) {
      box.close();
    } else {
      box.style.top =
        window.scrollY + target.getBoundingClientRect().bottom + "px";
      box.style.left =
        window.scrollX + target.getBoundingClientRect().left + "px";
      box.show();
    }
  }

  static styles = css`
    .content {
      display: inline-flex;
      vertical-align: sub;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
      margin-inline: 0.125rem;
    }

    .icon-container {
      display: flex;
      align-items: center;
    }

    .close-button {
      margin-top: 1rem;
      padding: 0.125rem 0.375rem;
      display: flex;
      position: absolute;
      bottom: 0.5rem;
      right: 0.75rem;
    }

    .hovercard {
      position: absolute;
      background: white;
      border: 1px solid black;
      border-radius: 4px;
      margin: 0;
      padding: 1rem 1rem 2rem 1rem;
      max-width: 60ch;
    }

    button {
      color: black;
      background-color: white;
      border: 1px solid black;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    .text-button {
      border: none;
      padding: 0;
    }
  `;
}

customElements.define("info-button", InfoButton);
