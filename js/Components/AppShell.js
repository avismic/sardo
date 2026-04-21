//================================================
// FILE: js/Components/AppShell.js
//================================================
import { Store } from '../Store.js';
import './WelcomeScreen.js';
import './Calculator.js';
import './BulkRest.js';
import './FoldingStep.js';
import './BakingStep.js';
import './ReviewStep.js';

class SourdoughApp extends HTMLElement {
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

  render() {
    const step = Store.state.step || 'welcome';
    this.innerHTML = ''; // clear any previous child

    let tag = '';
    switch (step) {
      case 'welcome':   tag = 'welcome-screen';   break;
      case 'calculator':tag = 'sourdough-calculator'; break;
      case 'bulk':      tag = 'bulk-rest';       break;
      case 'fold':      tag = 'folding-step';    break;
      case 'baking':    tag = 'baking-step';     break;
      case 'review':    tag = 'review-step';     break;
      default:          tag = 'welcome-screen';
    }

    const el = document.createElement(tag);
    this.appendChild(el);
  }
}
customElements.define('sourdough-app', SourdoughApp);
