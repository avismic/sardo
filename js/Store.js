//================================================
// FILE: js/Store.js
//================================================
export const Store = {
  state:
    JSON.parse(localStorage.getItem('sourdoughState')) || {
      // ── Navigation ─────────────────────
      step: 'welcome',
      userName: null,
      history: [],                     // ← array of finished bakes

      // ── Recipe data ───────────────────
      flour: 500,
      water: 350,
      starter: 100,
      loaves: 1,

      // ── Bulk fermentation ─────────────
      bulkRest: 30,
      bulkTimerEnd: null,

      // ── Folding ───────────────────────
      numFolds: 4,
      foldInterval: 15,
      foldsConfigured: false,
      foldsDone: 0,
      foldLogs: [],         // [{fold, note, timestamp}]
      nextFoldTime: null,

      // ── Baking ────────────────────────
      bakeDuration: 30,
      bakeEndTime: null,
      bakeFinished: false,

      // ── Media & notes ─────────────────
      photos: [],            // Base‑64 strings
      notes: '',
      temp: '',

      // Compatibility with legacy components
      folds: 0,
      timerEndTime: null,
    },

  update(updates) {
    this.state = { ...this.state, ...updates };
    localStorage.setItem('sourdoughState', JSON.stringify(this.state));
    window.dispatchEvent(new CustomEvent('stateChange', { detail: this.state }));
  },

  reset() {
    localStorage.removeItem('sourdoughState');
    location.reload();
  },

  // -------------------------------------------------
  // Clears **only** the active bake, keeping the secret
  // name and the history of past sessions.
  // -------------------------------------------------
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
    this.update(defaults);
  },
};
