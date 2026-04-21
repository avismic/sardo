//================================================
// FILE: app.js
//================================================
import "./js/Components/AppShell.js";
// Legacy components are still imported in case they are useful later
import "./js/Components/Calculator.js";
import "./js/Components/Timer.js";
import "./js/Components/Scheduler.js";
import "./js/Components/EnvironmentLog.js";

let wakeLock = null;

// Function to keep the screen awake
const requestWakeLock = async () => {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Wake Lock active: Screen will stay on.");
      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock released.");
      });
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

// Re‑request when the app comes back to the foreground
document.addEventListener("visibilitychange", async () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    await requestWakeLock();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

// Activate it as soon as the app loads
requestWakeLock();
