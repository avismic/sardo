//================================================
// FILE: js/Components/Calculator.js
//================================================
import { Store } from '../Store.js';

class SourdoughCalculator extends HTMLElement {
  constructor() {
    super();
    this.updateHydrationBound = this.updateHydration.bind(this);
  }

  connectedCallback() {
    this.render();
    window.addEventListener('stateChange', this.updateHydrationBound);
  }

  disconnectedCallback() {
    window.removeEventListener('stateChange', this.updateHydrationBound);
  }

  updateHydration() {
    const { flour, water, starter } = Store.state;
    const totalWater = water + starter / 2;
    const totalFlour = flour + starter / 2;
    const hydration = totalFlour > 0 ? (totalWater / totalFlour) * 100 : 0;
    const badge = this.querySelector('#h-val');
    if (badge) badge.innerText = hydration.toFixed(1);
  }

  render() {
    const { flour, water, starter, loaves } = Store.state;
    this.innerHTML = `
      <section class="card">
        <h2>1. Recipe Calculator</h2>

        <div class="input-group">
          <label>Flour (g)</label>
          <input type="number" id="f" min="0" value="${flour}">
        </div>
        <div class="input-group">
          <label>Water (g)</label>
          <input type="number" id="w" min="0" value="${water}">
        </div>
        <div class="input-group">
          <label>Starter (g)</label>
          <input type="number" id="s" min="0" value="${starter}">
        </div>
        <div class="input-group">
          <label>Loaves</label>
          <input type="number" id="l" min="1" value="${loaves}">
        </div>

        <div class="hydration-badge">
          Hydration: <span id="h-val">0</span>%
        </div>

        <div class="controls" style="margin-top:15px;">
          <button id="btn-back" class="btn-secondary">Back</button>
          <button id="btn-skip" class="btn-secondary">Skip</button>
          <button id="btn-next" class="btn-primary">Next</button>
        </div>
      </section>
    `;

    // input handling
    this.querySelectorAll('input').forEach(input => {
      input.oninput = (e) => {
        const val = parseFloat(e.target.value) || 0;
        switch (e.target.id) {
          case 'f': Store.update({ flour: val }); break;
          case 'w': Store.update({ water: val }); break;
          case 's': Store.update({ starter: val }); break;
          case 'l': Store.update({ loaves: Math.max(1, Math.floor(val)) }); break;
        }
      };
    });

    // navigation buttons
    this.querySelector('#btn-back').onclick = () => Store.update({ step: 'welcome' });
    this.querySelector('#btn-skip').onclick = () => Store.update({ step: 'settings' });
    this.querySelector('#btn-next').onclick = () => Store.update({ step: 'settings' });

    this.updateHydration();
  }
}
customElements.define('sourdough-calculator', SourdoughCalculator);
