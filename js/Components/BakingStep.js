//================================================
// FILE: js/Components/BakingStep.js
//================================================
import { Store } from '../Store.js';

class BakingStep extends HTMLElement {
  constructor() {
    super();
    this.intervalId = null;
    this.stateListener = this.render.bind(this);
  }

  connectedCallback() {
    window.addEventListener('stateChange', this.stateListener);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('stateChange', this.stateListener);
    clearInterval(this.intervalId);
  }

  /*** TIMER ***/
  startBakingTimer() {
    const minutes = Store.state.bakeDuration || 30;
    const end = Date.now() + minutes * 60 * 1000;
    Store.update({ bakeEndTime: end, bakeFinished: false });
    this.resumeTimer();
  }

  resumeTimer() {
    if (!Store.state.bakeEndTime) return;
    clearInterval(this.intervalId);
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const remaining = Store.state.bakeEndTime - Date.now();
    const display = this.querySelector('#bake-countdown');
    if (remaining <= 0) {
      clearInterval(this.intervalId);
      Store.update({ bakeEndTime: null, bakeFinished: true });
      alert('Bread is ready! Take it out of the oven.');
    } else if (display) {
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      display.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  /*** RENDER ***/
  render() {
    const { bakeDuration = 30, bakeEndTime, bakeFinished } = Store.state;
    const timerActive = !!bakeEndTime;

    this.innerHTML = `
      <section class="card">
        <h2>4. Baking</h2>
        ${timerActive
          ? `<div>Time remaining: <span id="bake-countdown"></span></div>`
          : `<div class="input-group"><label>Bake time (minutes)</label>
               <input type="number" id="bake-input" min="1" value="${bakeDuration}">
             </div>`
        }
        <button id="btn-bake" class="btn-primary">
          ${timerActive ? 'Timer Running...' : 'Start Oven Timer'}
        </button>
        ${bakeFinished ? `<button id="btn-finish" class="btn-secondary" style="margin-top:15px;">Finish Baking</button>` : ''}
      </section>
    `;

    if (!timerActive) {
      const input = this.querySelector('#bake-input');
      input.oninput = (e) => {
        const val = Math.max(1, parseInt(e.target.value, 10) || 1);
        Store.update({ bakeDuration: val });
      };
      this.querySelector('#btn-bake').onclick = () => this.startBakingTimer();
    } else {
      this.querySelector('#btn-bake').disabled = true;
      this.resumeTimer();
    }

    if (bakeFinished) {
      this.querySelector('#btn-finish').onclick = () => {
        Store.update({ step: 'review' });
      };
    }
  }
}
customElements.define('baking-step', BakingStep);
