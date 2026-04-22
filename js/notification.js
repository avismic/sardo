/* -------------------------------------------------------------
   js/notification.js
   Simple on‑screen toast/notification system.
   Usage:
       import { notify } from './notification.js';
       notify('Your message', 'info'|'success'|'warning'|'error');
   ------------------------------------------------------------- */

import { playRing } from "./audio.js";
export function notify(message, type = "info", timeout = 3000) {
  // Ensure a container exists
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.style.position = "fixed";
    container.style.top = "12px";
    container.style.right = "12px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    document.body.appendChild(container);
  }

  // Create the toast
  const toast = document.createElement("div");
  toast.className = `notification ${type}`;
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transition = "opacity 0.3s ease";

  container.appendChild(toast);

  // ------- sound (new) ----------------------------------------
  if (sound) {
    playRing(); // <- one‑line sound trigger
  }

  // Auto‑remove after timeout
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, timeout);
}
