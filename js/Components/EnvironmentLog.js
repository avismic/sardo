import { Store } from '../Store.js';

class EnvironmentLog extends HTMLElement {
    connectedCallback() {
        this.render();
        // Sync if the state changes elsewhere (like a reset)
        window.addEventListener('stateChange', () => {
            const tempInput = this.querySelector('#temp');
            const notesInput = this.querySelector('#notes');
            if (tempInput) tempInput.value = Store.state.temp;
            if (notesInput) notesInput.value = Store.state.notes;
        });
    }

    render() {
        this.innerHTML = `
            <section class="card">
                <h2>4. Environment & Notes</h2>
                <div class="input-group">
                    <label>Room Temp (°C)</label>
                    <input type="number" id="temp" value="${Store.state.temp}" placeholder="25">
                </div>
                <textarea id="notes" placeholder="How does the dough feel? (e.g., sticky, bubbly...)" rows="4">${Store.state.notes}</textarea>
            </section>
            <style>
                textarea {
                    width: 100%;
                    margin-top: 15px;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 0.9rem;
                    resize: none;
                    box-sizing: border-box;
                    background: #fdfdfd;
                }
                textarea:focus {
                    outline: none;
                    border-color: var(--primary);
                }
            </style>
        `;

        // Save data to Store as she types
        this.querySelector('#temp').oninput = (e) => {
            Store.update({ temp: e.target.value }); 
        };

        this.querySelector('#notes').oninput = (e) => {
            Store.update({ notes: e.target.value }); 
        };
    }
}
customElements.define('environment-log', EnvironmentLog);