# PWA

The Vite build hook generates `dist/sw.js` from `service-worker.js` after the
bundle is written. It precaches the app shell and emitted static files (excluding
source maps). The cache version includes file contents and worker source, so
identical builds are stable and changed releases trigger an update.

The registration stays at `/sw.js` with scope `/`, matching the previous
vite-plugin-pwa registration. Existing browsers discover the replacement through
the normal service worker update check, even while displaying a Workbox-cached
page. After a complete precache download, the worker activates immediately,
claims clients, deletes only this app's old caches (including the root-scoped
Workbox precache), and reloads open app tabs at their current URLs. First installs
do not reload. Failed downloads leave the active worker in place.

Update checks run on registration, hourly, when a tab becomes visible, and when
connectivity returns. An automatic update reload can discard unsaved form edits.
Offline support covers the app shell, deep links (including `/login` and `/logout`),
all emitted lazy chunks and their shared assets, and the public Norwegian/English
translation dictionaries. Installation requires all these files to download
successfully online; an incomplete release does not replace the active worker.
Translations are refreshed from the server online, with the installed/cached JSON
as fallback for network failures or HTTP errors. Missing-key POST requests are
never cached. API calls, authentication and saving data require a connection;
private responses are not cached and writes are not queued. A protected deep link
still requires a valid signed-in session and permission. Cached application code
does not make server data available offline after a reload.

Deploy the complete `dist` directory over HTTPS. Serve `/sw.js` as JavaScript
with `Cache-Control: no-cache`, and do not route it to the SPA HTML fallback.
Configure the web server to serve `index.html` for frontend deep links such as
`/beers/details/:id`, `/calendar/:id` and `/admin/calendar/:id`, while preserving
API/OAuth endpoints and real 404s for missing asset files. The service worker cannot
handle a first-ever online visit before it has been installed. Serve both
`/locales/no/translation.json` and `/locales/en/translation.json` as public JSON.
Keep `/sw.js` at the same URL in future deployments. Upload assets before the
worker, and retain older hashed assets during rollout where possible.

Run `npm run test:pwa` for lifecycle and offline behavior checks. For browser QA:
open a production build online, wait for activation, then disable the network
and reload a deep link. To check migration, first visit the previous production
build, then serve the new build on the same origin and trigger an update in
DevTools. The existing tab should reload, the old Workbox cache should disappear,
and offline reloads should use the new release.

## Automated production-build browser checks

```sh
npx playwright install chromium
npm run test:pwa:e2e
```

The command builds the app, starts a local SPA-fallback server and runs Chromium
with real service workers. The server supplies public translation fixtures; the
protected deep-link test supplies fake API data and session state. It never uses
a real account or backend. The tests cover cold deep-link startup, an unvisited
lazy page and reloads with networking disabled, public translation refresh/fallback,
and bypassing private API requests. Production hosting's rewrite rules still need
to match the deployment requirements above.

To use an existing Chrome binary instead of Playwright's browser download, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path. Browser traces are
retained for failed runs under `test-results/`.
