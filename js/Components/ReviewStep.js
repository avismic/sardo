// ================================================================
// FILE: js/Components/ReviewStep.js
// ================================================================
import { Store } from '../Store.js';

class ReviewStep extends HTMLElement {
  constructor() {
    super();
    this.stateListener = this.render.bind(this);
  }

  connectedCallback() {
    window.addEventListener('stateChange', this.stateListener);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('stateChange', this.stateListener);
  }

  /** Render the photo preview and the notes textarea */
  render() {
    const { notes = '' } = Store.state;
    this.innerHTML = `
      <section class="card">
        <h2>5. Review & Save</h2>

        <div class="input-group">
          <label>Final notes</label>
          <textarea id="final-notes" rows="4"
            placeholder="Anything you want to remember for next time...">${notes}</textarea>
        </div>

        <div class="input-group">
          <label>Photos (optional)</label>
          <input type="file" id="photo-input" accept="image/*" multiple>
        </div>

        <div id="photo-preview" style="margin-top:15px;">
          ${Store.state.photos.map(src => `<img src="${src}" class="photo-thumb" alt="bake photo">`).join('')}
        </div>

        <button id="btn-save" class="btn-primary" style="margin-top:15px;">
          Save Session
        </button>

        <button id="btn-restart" class="btn-secondary" style="margin-top:15px;">
          Start New Bake
        </button>
      </section>
    `;

    // ---- Photo handling ------------------------------------------------
    const fileInput = this.querySelector('#photo-input');
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          const updated = [...Store.state.photos, ev.target.result];
          Store.update({ photos: updated });
        };
        reader.readAsDataURL(file);
      });
    };

    // ---- Final notes ---------------------------------------------------
    this.querySelector('#final-notes').oninput = (e) =>
      Store.update({ notes: e.target.value });

    // ---- Save Session ---------------------------------------------------
    this.querySelector('#btn-save').onclick = () => {
      // ----- Build a snapshot of the just‑finished bake -------------
      const {
        flour,
        water,
        starter,
        loaves,
        bulkRest,
        numFolds,
        foldInterval,
        foldLogs,
        bakeDuration,
        notes,
        photos,
        temp,
      } = Store.state;

      const entry = {
        timestamp: Date.now(),
        flour,
        water,
        starter,
        loaves,
        bulkRest,
        numFolds,
        foldInterval,
        // clone the log objects so a later edit does not mutate history
        foldLogs: foldLogs.map(l => ({ ...l })),
        bakeDuration,
        notes,
        photos: [...photos], // keep the Base‑64 strings
        temp,
      };

      // Save into the history array (preserve existing history)
      const history = Store.state.history || [];
      Store.update({ history: [...history, entry] });

      // Clear the active bake (keep userName & history) and go home
      Store.clearActive();
      Store.update({ step: 'welcome' });

      alert('Your bake has been saved. It will appear on the welcome screen.');
    };

    // ---- “Start New Bake” button – same as the one on Welcome -----
    this.querySelector('#btn-restart').onclick = () => {
      Store.clearActive();
      Store.update({ step: 'calculator' });
    };
  }
}
customElements.define('review-step', ReviewStep);
