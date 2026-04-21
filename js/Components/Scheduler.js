import { Store } from '../Store.js';

class SourdoughScheduler extends HTMLElement {
    connectedCallback() {
        this.render();
        // Update the schedule whenever the timer or start time changes
        window.addEventListener('stateChange', () => this.render());
    }

    formatTime(ms) {
        return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    render() {
        // Base the start time on when the 30m timer was first clicked, 
        // or just use 'Now' if no timer is active.
        const startTime = Store.state.timerEndTime ? (Store.state.timerEndTime - (30 * 60 * 1000)) : Date.now();
        
        // Typical sourdough stage durations (in milliseconds)
        const offsets = {
            autolyse: 45 * 60000,
            bulkEnd: 4.5 * 60 * 60000,
            coldProof: 5.5 * 60 * 60000,
            baking: 20 * 60 * 60000 // Ready for oven roughly 20h later
        };

        this.innerHTML = `
            <section class="card">
                <h2>3. Predicted Schedule</h2>
                <div class="timeline">
                    <div class="timeline-item">
                        <span>Autolyse Ends</span>
                        <strong>${this.formatTime(startTime + offsets.autolyse)}</strong>
                    </div>
                    <div class="timeline-item">
                        <span>Bulk Ferment End</span>
                        <strong>${this.formatTime(startTime + offsets.bulkEnd)}</strong>
                    </div>
                    <div class="timeline-item">
                        <span>Cold Proof Start</span>
                        <strong>${this.formatTime(startTime + offsets.coldProof)}</strong>
                    </div>
                    <div class="timeline-item">
                        <span>Oven Ready (Est.)</span>
                        <strong>${this.formatTime(startTime + offsets.baking)}</strong>
                    </div>
                </div>
            </section>
            <style>
                .timeline { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
                .timeline-item { 
                    display: flex; 
                    justify-content: space-between; 
                    padding-bottom: 8px; 
                    border-bottom: 1px dashed #ddd; 
                }
                .timeline-item span { color: #666; font-size: 0.9rem; }
                .timeline-item strong { color: var(--secondary); }
            </style>
        `;
    }
}
customElements.define('sourdough-scheduler', SourdoughScheduler);