import { test, expect, type Page } from "@playwright/test";

const user = {
  id: "user-1",
  firstName: "Test",
  lastName: "User",
  email: "test@example.no",
  beers: [],
  calendarToken: [{ id: "token-1", token: "test", name: "Test calendar", active: true }],
  role: { name: "ROLE_USER", authority: "ROLE_USER", authorities: [{ name: "beer:read" }] },
  createdDate: "2026-01-01T00:00:00Z",
  imageSilhouette: false,
};
const token = `e30.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}.test`;

async function waitForWorker(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }),
      );
    }
  });
}

test("a direct protected deep link loads its lazy page and API data without visiting the home page", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript(
    ({ user: seededUser, token: seededToken }) => {
      sessionStorage.setItem(
        "persist:auth",
        JSON.stringify({
          currentUser: JSON.stringify(seededUser),
          token: JSON.stringify(seededToken),
          _persist: JSON.stringify({ version: -1, rehydrated: true }),
        }),
      );
    },
    { user, token },
  );
  await context.route("http://localhost:8080/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    let body: unknown = [];
    if (path === "/api/v1/auth/refresh") body = { user, token };
    if (path === "/api/v1/beer/beer-1")
      body = {
        id: "beer-1",
        name: "Deep link Stout",
        style: "Stout",
        brewer: user,
        reviews: [],
        brewedDate: "2026-01-01",
        bottleDate: "2026-02-01",
        archived: false,
      };
    await route.fulfill({
      json: body,
      headers: { "Access-Control-Allow-Origin": "http://127.0.0.1:4173", "Access-Control-Allow-Credentials": "true" },
    });
  });
  const response = await page.goto("/beers/details/beer-1?from=%2Fbeers");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Deep link Stout" })).toBeVisible();
  await expect(page).toHaveURL(/\/beers\/details\/beer-1\?from=%2Fbeers$/);
  expect(errors).toEqual([]);
});

test("unvisited lazy pages, deep-link reloads and translations load from the PWA offline", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const scriptURLs: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scriptURLs.push(request.url());
  });
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  await waitForWorker(page);
  // The first page never imported the registration page; installation must cache it anyway.
  expect(scriptURLs.some((url) => /\/register\.page-/.test(url))).toBe(false);
  await context.setOffline(true);
  const scriptResponses: boolean[] = [];
  page.on("response", (response) => {
    if (/\/register\.page-.*\.js$/.test(response.url())) scriptResponses.push(response.fromServiceWorker());
  });
  const response = await page.goto("/register?from=%2Fcalendar%2F42");
  expect(response?.fromServiceWorker()).toBe(true);
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  expect(scriptResponses).toEqual([true]);
  const reload = await page.reload();
  expect(reload?.fromServiceWorker()).toBe(true);
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  await page.goto("/addtoken?email=test%40example.no");
  await expect(page.getByRole("heading", { name: "Add calendar token" })).toBeVisible();
  const logout = await page.goto("/logout");
  expect(logout?.fromServiceWorker()).toBe(true);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  const protectedLink = await page.goto("/calendar/42?day=1");
  expect(protectedLink?.fromServiceWorker()).toBe(true);
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/forgottenpassword");
  await expect(page.getByRole("heading", { name: "Reset password" })).toBeVisible();
  // Both dictionaries were installed, independent of the language used on the first visit.
  for (const language of ["no", "en"]) {
    const text = await page.evaluate(
      async (locale) => (await fetch(`/locales/${locale}/translation.json`)).json(),
      language,
    );
    expect(text.pages.register.header).toBe("Create account");
  }
  expect(errors).toEqual([]);
});

test("private API responses are not made available offline", async ({ page, context }) => {
  await page.goto("/login");
  await waitForWorker(page);
  expect(await page.evaluate(async () => (await fetch("/api/v1/probe")).json())).toEqual({ online: true });
  await context.setOffline(true);
  const reachable = await page.evaluate(async () => {
    try {
      await fetch("/api/v1/probe");
      return true;
    } catch {
      return false;
    }
  });
  expect(reachable).toBe(false);
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const requests = (await Promise.all(keys.map(async (key) => (await caches.open(key)).keys()))).flat();
    return requests.some((request) => new URL(request.url).pathname.startsWith("/api/"));
  });
  expect(cached).toBe(false);
});

test("public translation updates are retained offline without caching failed responses", async ({ page, context }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  await waitForWorker(page);
  await context.route("**/locales/no/translation.json", (route) =>
    route.fulfill({ json: { marker: "updated public translation" } }),
  );
  expect(await page.evaluate(async () => (await fetch("/locales/no/translation.json")).json())).toEqual({
    marker: "updated public translation",
  });
  await context.unrouteAll({ behavior: "wait" });
  await context.route("**/locales/no/translation.json", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  expect(await page.evaluate(async () => (await fetch("/locales/no/translation.json")).json())).toEqual({
    marker: "updated public translation",
  });
  await context.unrouteAll({ behavior: "wait" });
  await context.setOffline(true);
  expect(await page.evaluate(async () => (await fetch("/locales/no/translation.json")).json())).toEqual({
    marker: "updated public translation",
  });
});
