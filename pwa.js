// Install help is optional; order and stock logic do not depend on it.
(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
  });
  window.addEventListener('appinstalled', () => {
    installEvent = null;
    document.getElementById('caloyaa-install')?.remove();
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'caloyaa-install';
    button.textContent = 'Install app';
    button.setAttribute('aria-label', 'Install Caloyaa app');
    button.style.cssText = 'margin-left:auto;background:#e2162b;color:#fff;border:0;border-radius:20px;padding:9px 13px;font:700 12px sans-serif;cursor:pointer;white-space:nowrap';
    nav.append(button);
    {
      const download = document.createElement('a');
      download.id = 'caloyaa-apk-download';
      download.href = 'https://github.com/caloyaa-cafe/caloyaa-cafe.github.io/releases/download/v1.0.0-android/Caloyaa.apk';
      download.textContent = 'Download Android APK';
      download.setAttribute('aria-label', 'Download Caloyaa Android app APK');
      download.style.cssText = 'margin-left:8px;background:#fff;color:#a30d20;border:1px solid #e2162b;border-radius:20px;padding:8px 12px;font:700 12px sans-serif;text-decoration:none;white-space:nowrap';
      nav.append(download);
    }
    button.addEventListener('click', async () => {
      if (installEvent) {
        const event = installEvent;
        installEvent = null;
        event.prompt();
        await event.userChoice;
        return;
      }
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const text = isIos
        ? 'Safari mein Share button dabao, phir Add to Home Screen chuno.'
        : 'Chrome menu (⋮) mein Add to Home screen ya Install app chuno.';
      let note = document.getElementById('caloyaa-install-help');
      if (!note) {
        note = document.createElement('div');
        note.id = 'caloyaa-install-help';
        note.setAttribute('role', 'status');
        note.style.cssText = 'position:fixed;top:70px;right:12px;z-index:999;background:#fff8ed;color:#5d2725;border:2px solid #e2162b;border-radius:12px;box-shadow:0 6px 24px #0003;padding:14px;max-width:280px;font:600 14px sans-serif';
        document.body.append(note);
      }
      note.textContent = text;
      window.clearTimeout(note._timer);
      note._timer = window.setTimeout(() => note.remove(), 9000);
    });
  });
})();
