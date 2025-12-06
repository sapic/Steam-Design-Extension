// This script runs in the page context (not content script context)
// It can access page variables like g_rgProfileData

(function() {
  if (typeof g_rgProfileData !== 'undefined' && g_rgProfileData.steamid) {
    window.postMessage({
      type: 'STEAM_PROFILE_DATA',
      steamid: g_rgProfileData.steamid
    }, '*');
  }
})();

