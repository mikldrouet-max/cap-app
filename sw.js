/* Cap. — Service Worker v22 — réseau d'abord pour la page */
const CACHE = "cap-v19";
const SHELL = ["./", "./index.html", "./manifest.json", "./favicon.svg", "./icon-192.png", "./icon-512.png"];

// Installation : mettre le shell en cache + activer tout de suite
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activation : supprimer les anciens caches + prendre la main
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = req.url;

  // GitHub API : toujours réseau, jamais de cache
  if(url.includes("api.github.com")){
    e.respondWith(
      fetch(req).catch(() =>
        new Response(JSON.stringify({ error: "offline" }), {
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    return;
  }

  // Page / navigation (HTML) : RÉSEAU D'ABORD, cache en secours hors-ligne.
  // C'est ce qui fait que la dernière version s'affiche dès qu'on est en ligne.
  const accept = req.headers.get("accept") || "";
  const isHTML = req.mode === "navigate" || accept.includes("text/html");
  if(isHTML){
    e.respondWith(
      fetch(req)
        .then(res => {
          if(req.method === "GET" && res.status === 200){
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then(c => c || caches.match("./index.html"))
        )
    );
    return;
  }

  // Autres fichiers (icônes, manifest…) : cache d'abord, réseau en secours
  e.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(res => {
        if(req.method === "GET" && res.status === 200){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
