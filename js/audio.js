// ------------------------------------------------------------
// FILE: js/audio.js
// ------------------------------------------------------------
// A singleton Audio object that can be reused everywhere.
// The file is pre‑loaded so the first ring is instantaneous.
//
// Usage:
//   import { playRing } from './audio.js';
//   playRing();               // → plays the sound at full volume
// ------------------------------------------------------------
const ring = new Audio('./assets/ring.mp3');
ring.preload = 'auto';
ring.volume   = 1.0;               // you can lower this if you wish

export function playRing(volume = 1.0) {
  // Reset to the start in case the user re‑triggers it quickly
  ring.currentTime = 0;
  ring.volume = volume;
  // `play()` returns a promise that rejects if the browser blocks audio.
  // We swallow the error – the user will have already interacted with the page,
  // so the promise should resolve.
  ring.play().catch(() => { /* ignore – audio blocked */ });
}
