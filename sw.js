/* Cap. — Service Worker v5 */
const CACHE = "cap-v2";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

// Installation : mettre le shell en cache
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activation : supprimer les anciens caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch : GitHub API = réseau only | reste = cache first
self.addEventListener("fetch", e => {
  const url = e.request.url;

  // GitHub API : toujours réseau, jamais mis en cache
  if(url.includes("api.github.com")){
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ error: "offline" }), {
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    return;
  }

  // App shell : cache first, réseau en fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        // Mettre en cache uniquement les requêtes GET réussies
        if(e.request.method === "GET" && res.status === 200){
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      });
    })
  );
});
