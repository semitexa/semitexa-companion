# Semitexa Companion

A tiny browser extension that lets **Semitexa OS embed external sites inside its
own windows** — with your real login — while the OS stays a normal browser tab.

## Why it's needed

Big sites (Google, Netflix, YouTube, most login apps) send `X-Frame-Options` /
CSP `frame-ancestors` headers that tell the browser **"never render me inside
another site's iframe."** A normal web page cannot override this — it's a
browser security boundary (anti-clickjacking). So without help, "wrap any site
in our window" is impossible for those services.

This companion uses the extension `declarativeNetRequest` API to **remove those
frame-blocking headers, but only for frames opened by Semitexa OS** (requests
whose initiating page is `localhost` / your `semitexa.*` domain). Your normal
browsing is unaffected.

## What it does

- `rules.json` — strips `x-frame-options` and `content-security-policy(-report-only)`
  response headers from **sub-frame** requests initiated by the OS origin.
- `content.js` — sets `data-semitexa-companion` on the OS page so the OS knows
  the companion is active and hides the "install companion" hint.

## Install (load unpacked)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select this folder
   (`packages/semitexa-companion`).
4. Reload the Semitexa OS tab. Open a web-app (e.g. "open YouTube") — it now
   renders inside the OS window and the "install companion" hint is gone.

## Scope / domains

The rules + content script are scoped to `localhost`, `*.semitexa.test`, and
`*.semitexa.com`. If you run the OS on another host, add it to
`condition.initiatorDomains` in `rules.json` and to `content_scripts.matches` in
`manifest.json`, then reload the extension.

## Security note

This deliberately weakens iframe-embedding protection **for frames the OS
opens**. That's the price of running third-party apps inside the OS. It does not
touch any other site's framing behavior, and grants no extra data access — the
embedded sites still run in their own origins with their own cookies/logins.
