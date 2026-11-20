/* Offline-first app shell. External booking, maps and weather stay network-only. */
const CACHE='kanazawa-journey-2026-v2';
const SHELL=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
 const request=event.request;const url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(res=>{if(res.ok&&url.pathname.startsWith(new URL(self.registration.scope).pathname))caches.open(CACHE).then(cache=>cache.put(request,res.clone()));return res;}).catch(()=>cached||caches.match('./index.html'))));
});
