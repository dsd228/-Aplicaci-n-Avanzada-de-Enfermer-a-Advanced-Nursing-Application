self.addEventListener('install', (e)=>{
  self.skipWaiting();
  e.waitUntil(caches.open('ctp-cache-v1').then(cache=>cache.addAll([
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/index.html',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/styles.css',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/app.js',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/manifest.webmanifest',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/assets/icons/icon-192.png',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/assets/icons/icon-256.png',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/assets/icons/icon-384.png',
    '/-Aplicaci-n-Avanzada-de-Enfermer-a-Advanced-Nursing-Application/assets/icons/icon-512.png'
  ])));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>!k.endsWith('v1')).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached=> cached || fetch(e.request).then(resp=>{
    const copy = resp.clone();
    caches.open('ctp-cache-v1').then(c=>c.put(e.request, copy));
    return resp;
  }).catch(()=> cached)));
});
