// Caloyaa is a normal website; clean up the old app-install setup for returning visitors.
(() => {
  document.querySelectorAll('link[rel="manifest"]').forEach(link => link.remove());
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.filter(reg => reg.scope === location.origin + '/').forEach(reg => reg.unregister());
    }).catch(() => {});
  }
  if ('caches' in window) {
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('caloyaa-shell-')).map(key => caches.delete(key)))).catch(() => {});
  }
})();
