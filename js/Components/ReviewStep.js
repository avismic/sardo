//================================================
// FILE: js/Components/ReviewStep.js
//================================================
import { Store } from '../Store.js';
import { notify } from '../notification.js';

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
          <textarea id="final-notes" rows="4" placeholder="Any final observations...">${notes}</textarea>
        </div>

        <div class="input-group">
          <label>Upload photos</label>
          <input type="file" id="photo-input" accept="image/*" multiple>
        </div>

        <div id="photo-preview" style="margin-top:15px;">
          ${this._photoHtml()}
        </div>

        <button id="btn-save" class="btn-primary" style="margin-top:15px;">Save Session</button>
        <button id="btn-restart" class="btn-secondary" style="margin-top:15px;">Start New Bake</button>
      </section>
    `;

    // Save notes
    this.querySelector('#final-notes').oninput = (e) => Store.update({ notes: e.target.value });

    // Photo handling (Base‑64)
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

    // Save session – persists in history and returns home
    this.querySelector('#btn-save').onclick = () => {
      const {
        flour,
        water,
        starter,
        loaves,
        notes,
        temp,
        foldLogs,
        photos,
      } = Store.state;

      const entry = {
        timestamp: Date.now(),
        flour,
        water,
        starter,
        loaves,
        notes,
        temp,
        foldLogs: [...foldLogs],
        photos: [...photos],
      };

      const history = Store.state.history || [];
      Store.update({ history: [...history, entry] });

      // Clear the *active* bake (keeps name & history)
      Store.clearActive();

      notify('Your bake has been saved. It will appear on the welcome screen.', 'success');
      Store.update({ step: 'welcome' });
    };

    // Restart – clears active bake (keeps name & history)
    this.querySelector('#btn-restart').onclick = () => Store.clearActive();
  }
}
customElements.define('review-step', ReviewStep);
