/* Generated at build time. Keep /sw.js and scope / to replace the previous Workbox worker. */
const CACHE_PREFIX = "juleoelkalender-precache-";
const CACHE_NAME = CACHE_PREFIX + "__VERSION__";
const PRECACHE = __PRECACHE__;
// These public dictionaries are needed even when a lazy page is opened offline for the first time.
const LOCALES = ["/locales/no/translation.json", "/locales/en/translation.json"];
const ASSETS = new Set(PRECACHE);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Do not activate a partial release or reuse stale HTTP-cache responses.
      await cache.addAll([...new Set([...PRECACHE, ...LOCALES])].map((url) => new Request(url, { cache: "reload" })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      const obsolete = names.filter(
        (name) =>
          name !== CACHE_NAME &&
          (name.startsWith(CACHE_PREFIX) ||
            (name.startsWith("workbox-precache-") && name.endsWith(self.registration.scope))),
      );
      await Promise.all(obsolete.map((name) => caches.delete(name)));
      await self.clients.claim();
      // Old pages do not have our registration code. Navigate them from the worker
      // itself, both during Workbox migration and on subsequent automatic updates.
      if (obsolete.length) {
        const clients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(clients.map((client) => client.navigate(client.url)));
      }
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Public translations use fresh responses online and the installed copy offline.
  if (LOCALES.includes(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const response = await fetch(request);
          if (response.ok) {
            await cache.put(url.pathname, response.clone());
            return response;
          }
          return (await cache.match(url.pathname)) ?? response;
        } catch (error) {
          const cached = await cache.match(url.pathname);
          if (cached) return cached;
          throw error;
        }
      })(),
    );
    return;
  }
  // API requests, authentication endpoints and private user data bypass this cache.
  // /login and /logout are client-side SPA routes; server authentication lives under /api or /oauth2.
  const navigation =
    request.mode === "navigate" && !/^\/(?:api|oauth2|locales|login\/oauth2)(?:\/|$)/.test(url.pathname);
  if (!navigation && !ASSETS.has(url.pathname)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Use the shell from the same release as the cached JS and CSS, including
      // deep links and offline reloads. Query strings do not change static assets.
      const cached = await cache.match(navigation ? "/index.html" : url.pathname);
      return cached ?? fetch(request);
    })(),
  );
});
