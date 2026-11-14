// Production assets with an explicit SPA fallback and public translation fixtures.
// This server never connects to a real backend or serves personal data.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("dist");
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".html": "text/html",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
};
const translations = {
  pages: {
    login: { header: "Log in" },
    register: { header: "Create account" },
    addtoken: { header: "Add calendar token" },
    forgottenpassword: { title: "Reset password" },
    403: { header: "Access denied" },
  },
  common: { dateformat: "yyyy-MM-dd" },
};

createServer(async (request, response) => {
  const path = new URL(request.url, "http://127.0.0.1:4173").pathname;
  response.setHeader("Cache-Control", "no-store");
  if (/^\/locales\/(no|en)\/translation\.json$/.test(path)) {
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(translations));
    return;
  }
  if (path.startsWith("/api/")) {
    response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ online: true }));
    return;
  }
  if (path.startsWith("/locales/")) {
    response.writeHead(204).end();
    return;
  }
  const file = resolve(root, `.${decodeURIComponent(path)}`);
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    if (extname(path)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html" }).end(await readFile(resolve(root, "index.html")));
  }
}).listen(4173, "127.0.0.1");
