const CACHE = "hifz-v4";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith("hifz-") && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", e => {
  const url = e.request.url;
  if (e.request.method !== "GET" || /huggingface|hf\.co|alquran\.cloud/.test(url)) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    if (e.request.mode === "navigate" || url.endsWith(".html") || url.endsWith("manifest.json")) {
      try { const r = await fetch(e.request, { cache: "no-store" }); cache.put(e.request, r.clone()); return r; }
      catch { return (await cache.match(e.request, { ignoreSearch: true })) || Response.error(); }
    }
    const hit = await cache.match(e.request);
    if (hit) return hit;
    const r = await fetch(e.request);
    if (r.ok || r.type === "opaque") cache.put(e.request, r.clone());
    return r;
  }));
});
