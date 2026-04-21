//================================================
// FILE: js/Components/WelcomeScreen.js
//================================================
import { Store } from '../Store.js';

class WelcomeScreen extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const name = Store.state.userName ? `, ${Store.state.userName}` : '';
    const history = Store.state.history || [];

    this.innerHTML = `
      <section class="card">
        <h2>Welcome${name}!</h2>
        <p>Ready to bake some sourdough?</p>
        <button id="btn-start" class="btn-primary" style="margin-top:15px;">Start New Bake</button>
      </section>

      ${history
        .map(
          (entry, idx) => `
            <section class="card">
              <h3>Bake #${idx + 1} – ${new Date(entry.timestamp).toLocaleString()}</h3>
              <p>
                <strong>Flour:</strong> ${entry.flour} g,
                <strong>Water:</strong> ${entry.water} g,
                <strong>Starter:</strong> ${entry.starter} g,
                <strong>Loaves:</strong> ${entry.loaves}
              </p>

              <p><strong>Final notes:</strong> ${entry.notes || '—'}</p>

              ${
                entry.foldLogs && entry.foldLogs.length
                  ? `
                    <div><strong>Fold notes:</strong>
                      <ul style="margin:8px 0 0 20px; padding:0;">
                        ${entry.foldLogs
                          .map(
                            log => `
                              <li><strong>Fold ${log.fold}:</strong> ${
                                log.note ? log.note : '<em>(no note)</em>'
                              }</li>`
                          )
                          .join('')}
                      </ul>
                    </div>
                  `
                  : '<p><strong>Fold notes:</strong> —</p>'
              }

              ${
                entry.photos && entry.photos.length
                  ? `
                      <div class="photo-gallery" style="margin-top:15px;">
                        ${entry.photos
                          .map(src => `<img src="${src}" class="photo-thumb" alt="bake photo">`)
                          .join('')}
                      </div>
                    `
                  : ''
              }
            </section>
          `
        )
        .join('')}
    `;

    this.querySelector('#btn-start').onclick = () => {
      if (!Store.state.userName) {
        const secret = prompt('Choose a secret name for your baking sessions:');
        if (secret) Store.update({ userName: secret });
        else return;
      }
      Store.clearActive();                // keep name & history, reset active data
      Store.update({ step: 'calculator' });
    };
  }
}
customElements.define('welcome-screen', WelcomeScreen);
