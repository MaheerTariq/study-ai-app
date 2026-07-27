const CACHE_NAME = 'study-ai-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

// Cache-first for the app shell only; everything else (Firebase, Groq, Gemini, your Worker)
// always goes to the network since it needs to be live.
self.addEventListener('fetch', (event) => {
  const isShellFile = SHELL_FILES.some((f) => event.request.url.endsWith(f.replace('./', '')));
  if (!isShellFile) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
