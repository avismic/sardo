import { Store } from '../Store.js';

class SourdoughTimer extends HTMLElement {
    connectedCallback() {
        this.render();
        if (Store.state.timerEndTime) this.resumeTimer();
    }

    resumeTimer() {
        this.interval = setInterval(() => {
            const remaining = Store.state.timerEndTime - Date.now();
            if (remaining <= 0) {
                clearInterval(this.interval);
                Store.update({ timerEndTime: null });
                alert("Time to fold!");
                this.render();
            } else {
                this.updateDisplay(remaining);
            }
        }, 1000);
    }

    updateDisplay(ms) {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const clock = this.querySelector('#timer-display');
        if(clock) clock.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    render() {
        this.innerHTML = `
            <section class="card">
                <h2>2. Bulk Fermentation</h2>
                <div class="timer-display" id="timer-display">30:00</div>
                <div class="stats">
                    <div class="stat-box">
                        <span class="label">Folds</span>
                        <span class="value" id="fold-val">${Store.state.folds}</span>
                    </div>
                </div>
                <div class="controls">
                    <button id="btn-timer" class="btn-primary">Start 30m Timer</button>
                    <button id="btn-fold" class="btn-secondary">Record Fold</button>
                </div>
            </section>
        `;

        this.querySelector('#btn-timer').onclick = () => {
            Store.update({ timerEndTime: Date.now() + (30 * 60 * 1000) });
            this.resumeTimer();
        };

        this.querySelector('#btn-fold').onclick = () => {
            Store.update({ folds: Store.state.folds + 1 });
            this.querySelector('#fold-val').innerText = Store.state.folds;
        };
    }
}
customElements.define('sourdough-timer', SourdoughTimer);