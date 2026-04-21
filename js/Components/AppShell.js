//================================================
// FILE: js/Components/AppShell.js
//================================================
import { Store } from '../Store.js';
import './WelcomeScreen.js';
import './Calculator.js';
import './Settings.js';           // ← still needed for routing
import './BulkRest.js';
import './FoldingStep.js';
import './BakingStep.js';
import './ReviewStep.js';
import './EnvironmentLog.js';
import './Scheduler.js';
import './Timer.js';

class SourdoughApp extends HTMLElement {
  constructor() {
    super();
    this.prevStep = null;                 // remember the last rendered step
    this.stateListener = this.handleStateChange.bind(this);
  }

  connectedCallback() {
    window.addEventListener('stateChange', this.stateListener);
    // Initial render
    this.renderStep(Store.state.step);
  }

  disconnectedCallback() {
    window.removeEventListener('stateChange', this.stateListener);
  }

  /** Called on every Store.update – re‑render **only** when the step changes */
  handleStateChange() {
    const step = Store.state.step || 'welcome';
    if (step !== this.prevStep) {
      this.prevStep = step;
      this.renderStep(step);
    }
  }

  /** Render the component that matches the current step */
  renderStep(step) {
    this.innerHTML = '';                     // clear previous view

    let tag = '';
    switch (step) {
      case 'welcome':   tag = 'welcome-screen';          break;
      case 'calculator':tag = 'sourdough-calculator';    break;
      case 'settings':  tag = 'sourdough-settings';     break;
      case 'bulk':      tag = 'bulk-rest';                break;
      case 'fold':      tag = 'folding-step';             break;
      case 'baking':    tag = 'baking-step';              break;
      case 'review':    tag = 'review-step';              break;
      default:          tag = 'welcome-screen';
    }

    const el = document.createElement(tag);
    this.appendChild(el);
  }
}
customElements.define('sourdough-app', SourdoughApp);
