// Tiene in cache la pagina per l'uso offline. Network-first: online prende sempre l'ultima versione.
// I dati del foglio non passano di qui: restano nel localStorage del dispositivo dopo il login.
const CACHE = "florida-v1";
const SHELL = ["./", "./index.html"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  const sameOrigin = u.origin === location.origin;
  const isFont = u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com";
  if (e.request.method !== "GET" || !(sameOrigin || isFont)) return; // API Google e login: mai in cache
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
