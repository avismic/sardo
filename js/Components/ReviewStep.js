//================================================
// FILE: js/Components/ReviewStep.js
//================================================
import { Store } from '../Store.js';
import { notify } from '../notification.js';

class ReviewStep extends HTMLElement {
  constructor() {
    super();
    // keep references for quick UI updates (no full re‑render needed)
    this.photoPreviewEl = null;
    this.notesTextarea   = null;
  }

  connectedCallback() {
    this.render();               // build the page once
  }

  disconnectedCallback() {
    // nothing to clean up – we no longer listen to generic stateChange
  }

  /** Build the HTML for existing photos */
  _photoHtml() {
    return Store.state.photos
      .map(src => `<img src="${src}" class="photo-thumb" alt="bake photo">`)
      .join('');
  }

  render() {
    const { notes = '' } = Store.state;

    this.innerHTML = `
      <section class="card">
        <h2>5. Review & Save</h2>

        <div class="input-group">
          <label>Final notes</label>
          <textarea id="final-notes" rows="4"
            placeholder="Any final observations...">${notes}</textarea>
        </div>

        <div class="input-group">
          <label>Upload photos</label>
          <input type="file" id="photo-input" accept="image/*" multiple>
        </div>

        <div id="photo-preview" style="margin-top:15px;">
          ${this._photoHtml()}
        </div>

        <button id="btn-save" class="btn-primary" style="margin-top:15px;">
          Save Session
        </button>
        <button id="btn-restart" class="btn-secondary" style="margin-top:15px;">
          Start New Bake
        </button>
      </section>
    `;

    // ----- keep handy references -----
    this.notesTextarea   = this.querySelector('#final-notes');
    this.photoPreviewEl  = this.querySelector('#photo-preview');

    // ----- final notes – just update Store (no re‑render) -----
    this.notesTextarea.oninput = (e) => Store.update({ notes: e.target.value });

    // ----- photo handling – add to Store **and** to the preview instantly -----
    const fileInput = this.querySelector('#photo-input');
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = ev => {
          const newSrc = ev.target.result;
          // Persist the image
          Store.update({ photos: [...Store.state.photos, newSrc] });
          // Show it immediately (no full re‑render)
          const img = document.createElement('img');
          img.src = newSrc;
          img.className = 'photo-thumb';
          img.alt = 'bake photo';
          this.photoPreviewEl.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    };

    // ----- Save session – push a snapshot to history & go home -----
    this.querySelector('#btn-save').onclick = () => {
      const {
        flour, water, starter, loaves,
        notes, temp, foldLogs, photos,
      } = Store.state;

      const entry = {
        timestamp: Date.now(),
        flour, water, starter, loaves,
        notes,
        temp,
        foldLogs: [...foldLogs],
        photos: [...photos],
      };

      const history = Store.state.history || [];
      Store.update({ history: [...history, entry] });

      // Clear only the active bake (keeps name & history) and return home
      Store.clearActive();
      Store.update({ step: 'welcome' });

      notify('Your bake has been saved. It will appear on the welcome screen.', 'success');
    };

    // ----- Restart – start a fresh bake, keeping name & history -----
    this.querySelector('#btn-restart').onclick = () => Store.clearActive();
  }
}
customElements.define('review-step', ReviewStep);
