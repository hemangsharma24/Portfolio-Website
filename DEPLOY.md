# Going Live — Deployment Guide

This site is **static HTML/CSS/JS**. There is nothing to compile and nothing to
install. Going live = putting this folder on the internet. Below are two paths.

---

## OPTION 1 — Self-deployment (zero coding experience)

### Easiest of all: Netlify Drop (no account math, ~2 minutes)

1. Download the project (the **Download** card in chat gives you a `.zip`).
2. **Unzip** it on your computer.
3. Go to **https://app.netlify.com/drop** in your browser.
4. **Drag the unzipped folder** onto that page.
5. Wait ~20 seconds. Netlify gives you a live URL like
   `https://random-name-123.netlify.app`. **That's your live site.**
6. (Optional) Create a free Netlify account to rename the site or connect a
   custom domain (e.g. `hemangsharma.com`) under *Site settings → Domain*.

To **update** later: make your edits, then drag the folder onto Netlify Drop
again (or, with an account, *Deploys → Drag and drop*). Done.

> Vercel (https://vercel.com) and Cloudflare Pages work the same way and are
> equally good. Any one is fine.

### Alternative: GitHub + Netlify (auto-deploys on every change)

This connects your files to GitHub so each save can auto-publish.

1. Make a free account at **https://github.com**.
2. Install **GitHub Desktop** (https://desktop.github.com) — a visual app, no
   command line.
3. In GitHub Desktop: *File → New Repository*, name it `portfolio`, choose a
   local folder, and **copy all the project files into that folder**.
4. Click **Commit to main**, then **Publish repository** (keep it public or
   private, your choice).
5. Go to **https://app.netlify.com → Add new site → Import from Git → GitHub**,
   pick your `portfolio` repo. Leave build command **empty** and publish
   directory **`/`** (or `.`). Click **Deploy**.
6. From now on: edit a file → in GitHub Desktop click **Commit** then **Push** →
   Netlify rebuilds and your live site updates in ~30 seconds.

#### GitHub Pages (also free, no Netlify)
In your repo on github.com: *Settings → Pages → Build and deployment →
Source: Deploy from a branch → `main` / root → Save*. Your site appears at
`https://<your-username>.github.io/portfolio/` within a minute.

---

## OPTION 2 — Hand it to a developer

Everything they need to know:

- **Stack:** vanilla HTML5 + CSS3 + ES5/ES6 JavaScript. **No build, no
  framework, no package manager, no env vars.**
- **Entry point:** `index.html`. Pages cross-link with plain relative `<a>`
  hrefs.
- **Run locally:** serve the root over HTTP — `python3 -m http.server` or
  `npx serve .`. (Double-clicking the HTML works too, but a static server makes
  the PDF/video behave exactly like production.)
- **Build:** none. **Deploy:** upload the repo root to any static host
  (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3+CloudFront, Nginx).
- **Config:** publish directory = repo root; build command = none.
- **Structure & animation docs:** see `README.md` (§1 and §4).

It is genuinely deploy-as-is.

---

## Pre-flight checklist (already verified ✓)

- ✓ All 7 pages load with no console errors
- ✓ Every referenced asset exists (0 broken links/images)
- ✓ No horizontal overflow at 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1728 / 1920
- ✓ Loader, ID-card drag, carousel, marquee, music player, lightbox, video, copy-email all functional
- ✓ Résumé buttons open the bundled PDF
- ✓ `prefers-reduced-motion` respected throughout

## After you go live

- Add a **custom domain** in your host's dashboard (Netlify/Vercel both walk you
  through it; usually just two DNS records at your domain registrar).
- Hosts serve over **HTTPS automatically** — nothing to configure.
- To update content, edit the HTML and re-deploy (drag the folder, or push to
  GitHub). No special process.
