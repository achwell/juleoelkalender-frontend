import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { generateServiceWorker } from "./generate-service-worker.ts";

const origin = "https://juleoelkalender.no";

function worker(source, { oldCaches = [], failInstall = false, unavailable = [] } = {}) {
  const handlers = {};
  const storage = new Map(oldCaches.map((name) => [name, new Map()]));
  const navigations = [];
  let skipped = false;
  let claimed = false;
  const absolute = (url) => new URL(url, origin).href;
  runInNewContext(source, {
    URL,
    Request: class extends Request {
      constructor(url, options) {
        super(absolute(url), options);
      }
    },
    fetch: () => {
      throw new Error("offline");
    },
    caches: {
      keys: async () => [...storage.keys()],
      delete: async (name) => storage.delete(name),
      open: async (name) => {
        if (!storage.has(name)) storage.set(name, new Map());
        const contents = storage.get(name);
        return {
          addAll: async (requests) => {
            if (failInstall) throw new Error("download failed");
            if (requests.some((request) => unavailable.includes(new URL(request.url).pathname))) {
              throw new Error("release asset unavailable");
            }
            for (const request of requests) {
              assert.equal(request.cache, "reload");
              contents.set(request.url, `cached:${new URL(request.url).pathname}`);
            }
          },
          match: async (url) => contents.get(absolute(url)),
        };
      },
    },
    self: {
      location: { origin },
      registration: { scope: `${origin}/` },
      addEventListener: (name, handler) => {
        handlers[name] = handler;
      },
      skipWaiting: async () => {
        skipped = true;
      },
      clients: {
        claim: async () => {
          claimed = true;
        },
        matchAll: async () => [{ url: `${origin}/calendar/42`, navigate: async (url) => navigations.push(url) }],
      },
    },
  });
  return {
    storage,
    navigations,
    get skipped() {
      return skipped;
    },
    get claimed() {
      return claimed;
    },
    async lifecycle(name) {
      let pending;
      handlers[name]({
        waitUntil: (promise) => {
          pending = promise;
        },
      });
      await pending;
    },
    fetch(path, overrides = {}) {
      let response;
      handlers.fetch({
        request: { url: absolute(path), method: "GET", mode: "cors", ...overrides },
        respondWith: (promise) => {
          response = promise;
        },
      });
      return response;
    },
  };
}

test("release generation, offline shell/assets, migration, and automatic updates", async () => {
  const directory = await mkdtemp(join(tmpdir(), "jule-pwa-"));
  try {
    await mkdir(join(directory, "assets"));
    await writeFile(join(directory, "index.html"), "app shell");
    await writeFile(join(directory, "assets/app.js"), "release one");
    await writeFile(join(directory, "assets/register.page-lazy.js"), "unvisited lazy page");
    await mkdir(join(directory, "assets/nested"));
    await writeFile(join(directory, "assets/nested/shared-lazy.js"), "shared lazy dependency");
    await writeFile(join(directory, "assets/app.js.map"), "excluded");
    await generateServiceWorker(directory);
    const source = await readFile(join(directory, "sw.js"), "utf8");
    assert.ok(!source.includes("app.js.map"));
    await generateServiceWorker(directory);
    assert.equal(await readFile(join(directory, "sw.js"), "utf8"), source);

    const legacy = `workbox-precache-v2-${origin}/`;
    const instance = worker(source, { oldCaches: [legacy, "other-app-cache"] });
    await instance.lifecycle("install");
    assert.equal(instance.skipped, true);
    assert.equal(await instance.fetch("/assets/register.page-lazy.js"), "cached:/assets/register.page-lazy.js");
    assert.equal(await instance.fetch("/assets/nested/shared-lazy.js"), "cached:/assets/nested/shared-lazy.js");
    assert.equal(await instance.fetch("/calendar/42?day=1", { mode: "navigate" }), "cached:/index.html");
    assert.equal(await instance.fetch("/assets/app.js?v=1"), "cached:/assets/app.js");
    for (const path of ["/login", "/logout", "/register", "/beers/details/42?from=%2Fbeers", "/admin/calendar/42"]) {
      assert.equal(await instance.fetch(path, { mode: "navigate" }), "cached:/index.html");
    }
    for (const language of ["no", "en"]) {
      assert.equal(
        await instance.fetch(`/locales/${language}/translation.json`),
        `cached:/locales/${language}/translation.json`,
      );
    }
    for (const url of ["/api/v1/beer", "/oauth2/callback", "/login/oauth2/code/google", "/locales/no/missing.json"]) {
      assert.equal(instance.fetch(url), undefined);
      assert.equal(instance.fetch(url, { mode: "navigate" }), undefined);
    }
    assert.equal(instance.fetch("/assets/app.js", { method: "POST" }), undefined);
    assert.equal(instance.fetch("https://external.example/app.js"), undefined);
    await instance.lifecycle("activate");
    assert.equal(instance.claimed, true);
    assert.equal(instance.storage.has(legacy), false);
    assert.equal(instance.storage.has("other-app-cache"), true);
    assert.deepEqual(instance.navigations, [`${origin}/calendar/42`]);

    const fresh = worker(source);
    await fresh.lifecycle("install");
    await fresh.lifecycle("activate");
    assert.deepEqual(fresh.navigations, []);

    await writeFile(join(directory, "assets/app.js"), "release two");
    await generateServiceWorker(directory);
    const updated = await readFile(join(directory, "sw.js"), "utf8");
    assert.notEqual(updated, source);
    const next = worker(updated, { oldCaches: [...fresh.storage.keys()] });
    await next.lifecycle("install");
    await next.lifecycle("activate");
    assert.equal(next.storage.size, 1);
    assert.equal(next.navigations.length, 1);

    const failed = worker(updated, { oldCaches: [legacy], failInstall: true });
    await assert.rejects(failed.lifecycle("install"), /download failed/);
    assert.equal(failed.skipped, false);
    assert.equal(failed.storage.has(legacy), true);
    assert.deepEqual(failed.navigations, []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("missing lazy chunks or public dictionaries prevent activation of an incomplete release", async () => {
  const directory = await mkdtemp(join(tmpdir(), "jule-pwa-incomplete-"));
  try {
    await mkdir(join(directory, "assets"));
    await writeFile(join(directory, "index.html"), "app shell");
    await writeFile(join(directory, "assets/register.page-lazy.js"), "lazy page");
    await generateServiceWorker(directory);
    const source = await readFile(join(directory, "sw.js"), "utf8");
    for (const url of [
      "/assets/register.page-lazy.js",
      "/locales/no/translation.json",
      "/locales/en/translation.json",
    ]) {
      const instance = worker(source, { oldCaches: ["juleoelkalender-precache-previous"], unavailable: [url] });
      await assert.rejects(instance.lifecycle("install"), /release asset unavailable/);
      assert.equal(instance.skipped, false);
      assert.equal(instance.claimed, false);
      assert.equal(instance.storage.has("juleoelkalender-precache-previous"), true);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
