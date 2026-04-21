// ================================================================
// FILE: js/Store.js
// ================================================================
export const Store = {
  // Load persisted state – if none exists start from defaults
  state:
    JSON.parse(localStorage.getItem('sourdoughState')) || {
      // ── Navigation ─────────────────────
      step: 'welcome',
      userName: null,                 // secret name – asked only once
      history: [],                   // ← array of finished bakes

      // ── Active bake (reset on a new bake) ─────────────────────
      flour: 500,
      water: 350,
      starter: 100,
      loaves: 1,

      bulkRest: 30,          // minutes before first fold
      bulkTimerEnd: null,    // timestamp

      // Folding
      numFolds: 4,
      foldInterval: 15,
      foldsConfigured: false,
      foldsDone: 0,
      foldLogs: [],          // [{fold, note, timestamp}]
      nextFoldTime: null,

      // Baking
      bakeDuration: 30,
      bakeEndTime: null,
      bakeFinished: false,

      // Media & notes
      photos: [],            // Base‑64 strings
      notes: '',
      temp: '',

      // Compatibility with the old timer component
      folds: 0,
      timerEndTime: null,
    },

  // -----------------------------------------------------------------
  // Update any fields, persist them and fire a custom event so components
  // can react automatically.
  // -----------------------------------------------------------------
  update(updates) {
    this.state = { ...this.state, ...updates };
    localStorage.setItem('sourdoughState', JSON.stringify(this.state));
    window.dispatchEvent(new CustomEvent('stateChange', { detail: this.state }));
  },

  // -----------------------------------------------------------------
  // Full reset – mainly for development / “clear everything” button.
  // -----------------------------------------------------------------
  reset() {
    localStorage.removeItem('sourdoughState');
    location.reload();
  },

  // -----------------------------------------------------------------
  // Clear only the **active** bake, keeping the secret name and the
  // history of past bakes.  This is the method the UI uses when the
  // user clicks “Start New Bake”.
  // -----------------------------------------------------------------
  clearActive() {
    const defaults = {
      step: 'welcome',
      flour: 500,
      water: 350,
      starter: 100,
      loaves: 1,
      bulkRest: 30,
      bulkTimerEnd: null,
      numFolds: 4,
      foldInterval: 15,
      foldsConfigured: false,
      foldsDone: 0,
      foldLogs: [],
      nextFoldTime: null,
      bakeDuration: 30,
      bakeEndTime: null,
      bakeFinished: false,
      photos: [],
      notes: '',
      temp: '',
      folds: 0,
      timerEndTime: null,
    };
    // Merge defaults – `userName` and `history` stay untouched.
    this.update(defaults);
  },
};
