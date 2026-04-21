//================================================
// FILE: js/Components/Settings.js
//================================================
import { Store } from '../Store.js';

class SettingsStep extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const {
      bulkRest = 30,
      numFolds = 4,
      foldInterval = 15,
      bakeDuration = 30,
    } = Store.state;

    this.innerHTML = `
      <section class="card">
        <h2>2. Settings</h2>

        <div class="input-group">
          <label>Rest before first fold (minutes)</label>
          <input type="number" id="bulk-rest" min="0" value="${bulkRest}">
        </div>

        <div class="input-group">
          <label>Number of folds</label>
          <input type="number" id="folds-num" min="1" value="${numFolds}">
        </div>

        <div class="input-group">
          <label>Interval between folds (minutes)</label>
          <input type="number" id="fold-interval" min="0" value="${foldInterval}">
        </div>

        <div class="input-group">
          <label>Bake time (minutes)</label>
          <input type="number" id="bake-duration" min="1" value="${bakeDuration}">
        </div>

        <div class="controls" style="margin-top:15px;">
          <button id="btn-back" class="btn-secondary">Back</button>
          <button id="btn-skip" class="btn-secondary">Skip</button>
          <button id="btn-next" class="btn-primary">Next</button>
        </div>
      </section>
    `;

    // store changes as they are typed
    this.querySelector('#bulk-rest').oninput = (e) => {
      Store.update({ bulkRest: Math.max(0, parseInt(e.target.value, 10) || 0) });
    };
    this.querySelector('#folds-num').oninput = (e) => {
      Store.update({ numFolds: Math.max(1, parseInt(e.target.value, 10) || 1) });
    };
    this.querySelector('#fold-interval').oninput = (e) => {
      Store.update({ foldInterval: Math.max(0, parseInt(e.target.value, 10) || 0) });
    };
    this.querySelector('#bake-duration').oninput = (e) => {
      Store.update({ bakeDuration: Math.max(1, parseInt(e.target.value, 10) || 1) });
    };

    // navigation
    this.querySelector('#btn-back').onclick = () => Store.update({ step: 'calculator' });
    this.querySelector('#btn-skip').onclick = () => Store.update({ step: 'bulk' });
    this.querySelector('#btn-next').onclick = () => Store.update({ step: 'bulk' });
  }
}
customElements.define('sourdough-settings', SettingsStep);
