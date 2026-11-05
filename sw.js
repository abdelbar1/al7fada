const CACHE = "hifz-v5";
const SHELL = ["page.html", "manifest.json", "icon-192.png", "icon-512.png"];
const SKIP = /(^|\.)(huggingface\.co|hf\.co|alquran\.cloud)$/;

self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting())
));
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith("hifz-") && k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || SKIP.test(url.hostname)) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("manifest.json")) {
      try { const r = await timeout(fetch(req, { cache: "no-store" }), 4000); if (r.ok) cache.put(req, r.clone()); return r; }
      catch { return (await cache.match(req, { ignoreSearch: true })) || (await cache.match("page.html")) || Response.error(); }
    }
    const hit = await cache.match(req);
    if (hit) return hit;
    const r = await fetch(req);
    if (r.ok || r.type === "opaque") cache.put(req, r.clone());
    return r;
  }));
});
