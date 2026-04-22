//================================================
// FILE: js/Components/FoldingStep.js
//================================================
import { Store } from "../Store.js";
import { notify } from "../notification.js";

class FoldingStep extends HTMLElement {
  constructor() {
    super();
    this.intervalId = null;
    this.stateListener = this.render.bind(this);
  }

  connectedCallback() {
    window.addEventListener("stateChange", this.stateListener);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("stateChange", this.stateListener);
    clearInterval(this.intervalId);
  }

  /*** TIMER BETWEEN FOLDS ***/
  startTimerForNextFold() {
    const minutes = Store.state.foldInterval || 15;
    const intervalMs = minutes * 60 * 1000;
    clearInterval(this.intervalId);
    Store.update({ nextFoldTime: Date.now() + intervalMs });
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const remaining = Store.state.nextFoldTime - Date.now();
    const display = this.querySelector("#fold-countdown");
    if (!display) return;

    if (remaining <= 0) {
      clearInterval(this.intervalId);
      Store.update({ nextFoldTime: null });

      /* ---------- NEW: toast + ring ---------- */
      // “info” toast, 3 seconds, and play a ring
      notify("Time for the next fold!", "info", 3000, true);
    } else {
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      display.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
  }

  render() {
    const {
      foldsConfigured,
      numFolds = 4,
      foldInterval = 15,
      foldsDone = 0,
      nextFoldTime,
    } = Store.state;

    // --------------- CONFIGURATION -----------------
    if (!foldsConfigured) {
      this.innerHTML = `
        <section class="card">
          <h2>3. Folding Setup</h2>

          <div class="input-group">
            <label>Number of folds</label>
            <input type="number" id="folds-num" min="1" value="${numFolds}">
          </div>

          <div class="input-group">
            <label>Interval between folds (minutes)</label>
            <input type="number" id="folds-interval" min="0" value="${foldInterval}">
          </div>

          <div class="controls" style="margin-top:15px;">
            <button id="btn-back" class="btn-secondary">Back</button>
            <button id="btn-skip" class="btn-secondary">Skip</button>
            <button id="btn-start-folding" class="btn-primary">Start Folding</button>
          </div>
        </section>
      `;

      // Back → Bulk
      this.querySelector("#btn-back").onclick = () =>
        Store.update({ step: "bulk" });
      // Skip → Baking (skip folding entirely)
      this.querySelector("#btn-skip").onclick = () =>
        Store.update({ step: "baking" });

      // Inputs
      this.querySelector("#folds-num").oninput = (e) => {
        const v = Math.max(1, parseInt(e.target.value, 10) || 1);
        Store.update({ numFolds: v });
      };
      this.querySelector("#folds-interval").oninput = (e) => {
        const v = Math.max(0, parseInt(e.target.value, 10) || 0);
        Store.update({ foldInterval: v });
      };

      // Start folding – switch to folding UI
      this.querySelector("#btn-start-folding").onclick = () => {
        Store.update({
          foldsConfigured: true,
          foldsDone: 0,
          foldLogs: [],
          nextFoldTime: null,
        });
      };
      return; // stop further rendering
    }

    // --------------- FOLDING UI -----------------
    const currentFold = foldsDone + 1;
    const waiting = !!nextFoldTime;
    const allDone = foldsDone >= numFolds;

    this.innerHTML = `
      <section class="card">
        <h2>3. Folding ${currentFold} of ${numFolds}</h2>
        ${
          waiting
            ? `<div>Next fold in: <span id="fold-countdown"></span></div>`
            : `${!allDone ? `<button id="btn-do-fold" class="btn-primary">Perform Fold #${currentFold}</button>` : ""}`
        }

        <div id="fold-log-section" style="margin-top:15px;"></div>

        <div class="controls" style="margin-top:15px;">
          <button id="btn-back" class="btn-secondary">Back</button>
          <button id="btn-skip" class="btn-secondary">Skip</button>
        </div>

        ${allDone ? `<button id="btn-to-baking" class="btn-secondary" style="margin-top:15px;">Proceed to Baking</button>` : ""}
      </section>
    `;

    // Back → Bulk
    this.querySelector("#btn-back").onclick = () => {
      clearInterval(this.intervalId);
      Store.update({ step: "bulk" });
    };
    // Skip → Baking
    this.querySelector("#btn-skip").onclick = () => {
      clearInterval(this.intervalId);
      Store.update({ step: "baking" });
    };

    // Countdown handling
    if (waiting) {
      clearInterval(this.intervalId);
      this.updateCountdown();
      this.intervalId = setInterval(() => this.updateCountdown(), 1000);
    }

    // Perform a fold (if we are not waiting)
    if (!waiting && !allDone) {
      this.querySelector("#btn-do-fold").onclick = () => {
        const note = prompt(`Add a note for Fold #${currentFold} (optional)`);
        const logEntry = {
          fold: currentFold,
          note: note || "",
          timestamp: Date.now(),
        };
        const updatedLogs = [...Store.state.foldLogs, logEntry];
        Store.update({
          foldsDone: currentFold,
          foldLogs: updatedLogs,
        });

        // If more folds remain, start interval timer
        if (currentFold < Store.state.numFolds) {
          this.startTimerForNextFold();
        }
      };
    }

    // After all folds → go to baking
    if (allDone) {
      this.querySelector("#btn-to-baking").onclick = () =>
        Store.update({ step: "baking" });
    }
  }
}
customElements.define("folding-step", FoldingStep);
