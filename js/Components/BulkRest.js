//================================================
// FILE: js/Components/BulkRest.js
//================================================
import { Store } from '../Store.js';

class BulkRest extends HTMLElement {
  constructor() {
    super();
    this.intervalId = null;
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    clearInterval(this.intervalId);
  }

  startTimer() {
    const minutes = Store.state.bulkRest || 30;
    const end = Date.now() + minutes * 60 * 1000;
    Store.update({ bulkTimerEnd: end });
    this.resumeTimer();
  }

  resumeTimer() {
    if (!Store.state.bulkTimerEnd) return;
    clearInterval(this.intervalId);
    this.updateCountdown();               // immediate update
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const remaining = Store.state.bulkTimerEnd - Date.now();
    const display = this.querySelector('#bulk-countdown');
    if (remaining <= 0) {
      clearInterval(this.intervalId);
      Store.update({ bulkTimerEnd: null, step: 'fold' });
      alert('Bulk rest complete! Time for the first fold.');
    } else if (display) {
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      display.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  render() {
    const timerActive = !!Store.state.bulkTimerEnd;
    const bulk = Store.state.bulkRest || 30;

    this.innerHTML = `
      <section class="card">
        <h2>2. Bulk Fermentation</h2>
        ${timerActive
          ? `<div>Time remaining: <span id="bulk-countdown"></span></div>`
          : `<div class="input-group">
               <label>Rest before first fold (minutes)</label>
               <input type="number" id="bulk-input" min="0" value="${bulk}">
             </div>`
        }
        <button id="btn-start-bulk" class="btn-primary">
          ${timerActive ? 'Timer Running...' : 'Start Timer'}
        </button>
      </section>
    `;

    if (!timerActive) {
      const input = this.querySelector('#bulk-input');
      input.oninput = (e) => {
        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
        Store.update({ bulkRest: val });
      };
      this.querySelector('#btn-start-bulk').onclick = () => this.startTimer();
    } else {
      // Timer already running – disable button & start countdown display
      this.querySelector('#btn-start-bulk').disabled = true;
      this.resumeTimer();
    }
  }
}
customElements.define('bulk-rest', BulkRest);
