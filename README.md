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

## Install

A Chromium (MV3) browser extension, not a Composer package: it is not on
Packagist and not part of a Semitexa project. Load it unpacked from a clone of
the repository:

1. `git clone https://github.com/semitexa/semitexa-companion.git`
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the cloned `semitexa-companion` folder.
5. Reload the Semitexa OS tab. Open a web-app (e.g. "open YouTube") — it now
   renders inside the OS window and the "install companion" hint is gone.

## Scope / domains

As shipped:

- the header rule (`rules.json`) applies to frames initiated by `localhost`,
  `semitexa.test`, `semitexa.com` and their subdomains;
- the content script (`manifest.json`) runs on `http://localhost/*`,
  `https://*.semitexa.test/*` and `https://*.semitexa.com/*`.

The default local URL `http://localhost:9502` is covered. A local domain created
by the Semitexa installer is plain `http://<name>.test`, which is **not**
covered: add the domain to `condition.initiatorDomains` in `rules.json` and
`http://<name>.test/*` to `content_scripts.matches` in `manifest.json`, then
reload the extension. Do the same for any other host you run the OS on.

## Security note

This deliberately weakens iframe-embedding protection **for frames the OS
opens**. That's the price of running third-party apps inside the OS. It does not
touch any other site's framing behavior, and grants no extra data access — the
embedded sites still run in their own origins with their own cookies/logins.
