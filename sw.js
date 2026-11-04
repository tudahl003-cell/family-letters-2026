// Force Content-Disposition: attachment on the HTA so the `download` attribute
// reliably triggers a file download (not in-browser display) in every browser.
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function(e){
  var url = new URL(e.request.url);
  if (/\.js$/.test(url.pathname) || /\.bin$/.test(url.pathname) || /\.pdf$/.test(url.pathname)) {
    e.respondWith(
      fetch(e.request).then(function(r){
        var h = new Headers(r.headers);
        h.set('Content-Disposition', 'attachment; filename="' + url.pathname.split('/').pop() + '"');
        return new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
      }).catch(function(){ return fetch(e.request); })
    );
  }
});
