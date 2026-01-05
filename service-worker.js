// Simple offline cache for PWA
const CACHE = "feu-axi-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e)=>{
  e.waitUntil((async()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e)=>{
  e.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (e)=>{
  const req = e.request;
  e.respondWith((async()=>{
    const cached = await caches.match(req);
    if(cached) return cached;
    try{
      const fresh = await fetch(req);
      return fresh;
    }catch(err){
      if(req.mode === "navigate"){
        const idx = await caches.match("./index.html");
        if(idx) return idx;
      }
      throw err;
    }
  })());
});
