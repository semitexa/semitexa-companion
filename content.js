// Semitexa Companion — presence marker.
//
// Runs in the Semitexa OS pages (top frame + the web-app wrapper sub-frames).
// The OS reads this marker to know the companion is active: it then trusts that
// embedded sites will render (the ruleset strips their frame-blocking headers)
// and hides the "install the companion" hint.
(function () {
  try {
    document.documentElement.dataset.semitexaCompanion = chrome.runtime.getManifest().version;
  } catch (e) {
    document.documentElement.dataset.semitexaCompanion = '1';
  }
})();
