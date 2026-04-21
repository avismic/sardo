// ================================================================
// FILE: js/Components/WelcomeScreen.js
// ================================================================
import { Store } from "../Store.js";

class WelcomeScreen extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const name = Store.state.userName ? `, ${Store.state.userName}` : "";

    // ---- History (most recent bake) ---------------------------------
    const history = Store.state.history || [];
    const latest = history.length ? history[history.length - 1] : null;

    const latestHtml = latest
      ? `
        <section class="card" style="margin-top:20px;">
          <h3>Last Bake – ${new Date(latest.timestamp).toLocaleString()}</h3>
          <p>
            <strong>Flour:</strong> ${latest.flour} g,
            <strong>Water:</strong> ${latest.water} g,
            <strong>Starter:</strong> ${latest.starter} g,
            <strong>Loaves:</strong> ${latest.loaves}
          </p>
          <p><strong>Notes:</strong> ${latest.notes || "—"}</p>
          <div class="photo-gallery">
            ${latest.photos.map((src) => `<img src="${src}" class="photo-thumb" alt="last bake photo">`).join("")}
          </div>
        </section>
      `
      : `<p style="margin-top:20px;">No previous bake data.</p>`;

    // ---- Main welcome card -------------------------------------------
    this.innerHTML = `
      <section class="card">
        <h2>Welcome${name}!</h2>
        <p>Ready to bake some sourdough?</p>

        <button id="btn-start" class="btn-primary" style="margin-top:15px;">
          Start New Bake
        </button>

        ${latestHtml}
      </section>
    `;

    // ---- “Start” button ------------------------------------------------
    this.querySelector("#btn-start").onclick = () => {
      // If we never asked for a secret name, ask now (only once)
      if (!Store.state.userName) {
        const secret = prompt("Choose a secret name for your baking sessions:");
        if (secret) Store.update({ userName: secret });
        else return; // user cancelled
      }

      // Clear the active bake fields and move to the calculator
      Store.clearActive();
      Store.update({ step: "calculator" });
    };
  }
}
customElements.define("welcome-screen", WelcomeScreen);
