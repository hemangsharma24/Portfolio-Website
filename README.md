# Hemang Sharma — Portfolio

A handcrafted, **static** portfolio website. No framework, no build step, no
dependencies to install. It is plain **HTML + CSS + JavaScript** plus an
`assets/` folder. Open any `.html` file in a browser and it runs.

That simplicity is intentional: it is fast, it never breaks from a dependency
update, and **anyone** can host it by uploading a folder.

---

## 1. Project structure

```
/
├── index.html              # Home (hero, projects, brands, work, testimonials, about, footer)
├── Projects.html           # Featured Projects + Playground marquee
├── About.html              # ID-card hero, experience, education, certifications
├── Case-GINTAA.html        # Case study — delivery-partner app
├── Case-FNOL.html          # Case study — AI claims workspace (has a video)
├── Case-Bosch.html         # Case study — customer-experience platform
├── Case-Bolna.html         # Case study — marketing-site redesign (Figma embed)
│
├── assets/
│   ├── styles.css          # Global design system: tokens, nav, hero, cards, footer, loader
│   ├── casestudy.css       # Case-study-only styles (kickers, flows, decisions, dark sections)
│   ├── app.js              # ALL interactivity (see §4)
│   ├── hemang-sharma-resume.pdf
│   │
│   ├── img/                # Project thumbnails, hero banners, persona boards, GINTAA screens
│   │   └── gintaa/         # 12 real app screens used in the GINTAA flows
│   ├── logos/              # Brand logos for the “Brands & teams” wall
│   ├── icons/              # In-card SVG icons (work / education / certification / id-handle)
│   ├── play/               # Playground gallery images (Projects page)
│   ├── testi/              # Testimonial avatars
│   └── video/              # FNOL prototype walkthrough (.mp4)
│
├── README.md               # This file
└── DEPLOY.md               # Step-by-step go-live guide (zero coding experience)
```

There is **no** `package.json`, `node_modules`, bundler, or environment file —
none are needed.

---

## 2. Fonts

Loaded from Google Fonts via `<link>` in each page's `<head>` (no local font
files to manage):

| Role | Family | Used for |
|------|--------|----------|
| Display / headings | **Newsreader** (serif) | All headings, hero titles, KPI numbers |
| UI / body | **Schibsted Grotesk** | Body copy, nav, tags, buttons, metadata |
| Wordmark | **Big Shoulders Display** | The “HEMANG SHARMA” logo only |
| Music player | **Inter** | The “Currently listening to” component only |

If you ever go fully offline, download these four families and self-host them;
otherwise nothing to do.

---

## 3. The design system (where to change things)

Everything visual is driven by **CSS custom properties** at the top of
`assets/styles.css` (`:root { … }`). Change a value there and it cascades
site-wide. Key tokens:

```
--paper      #FBF6F0   page background (warm cream)
--ink        #2A1A20   primary text
--burgundy   #5C2435   brand primary (nav, buttons, accents)
--terracotta / category accents for project-card top bars
--font-display / --font-ui / --font-mark   font stacks
--frame      1360px    nav + hero max width
--gutter     64px      page side padding (40px ≤1180, 20px ≤760)
```

Case-study dark sections use a deep **aubergine `#2B1623`** with a soft
**eucalyptus `#A9CBBC`** accent — defined inline in `casestudy.css`.

---

## 4. Interactions & animations (all in `assets/app.js`)

| Feature | Where | How it works |
|---|---|---|
| **Loading screen (1→100)** | `index.html` head + `styles.css` `#loader` | An inline script in each page's `<head>` runs a `requestAnimationFrame` counter 0→100 (easeOutExpo) that ink-fills the HS monogram. On finish it adds `.is-done`, which **collapses the panel via `clip-path` into the exact navbar box** (24px top, navbar gutter, 88px bottom, 6px radius) then cross-fades into the live nav. Shows once per session (`sessionStorage`), skips internal page hops, respects `prefers-reduced-motion`. |
| **Nav (sticky + mobile menu)** | `app.js` | Hamburger opens a full-screen sheet; active page is marked in HTML (no scroll-spy). |
| **Hero ID card (About)** | `app.js` | Pointer-drag with a spring-back; gentle idle sway. Hangs from the hero frame's top border via the provided clip SVG. |
| **Featured project hover** | `styles.css` | Whole card is a click target (`.pcard-stretch`); subtle lift + 1.05 image zoom, clipped to 16px radius. |
| **Testimonials carousel** | `app.js` | Prev/next arrows + dots; fade between quotes. |
| **Playground marquee (Projects)** | `app.js` | Infinite, seamless auto-scroll (cloned track, constant px/sec). Pauses on hover with a custom “View on Behance” cursor (desktop only — disabled on touch). |
| **Music player** | `app.js` | Real play/pause + track switching with a pixel equalizer; no audio is hosted and nothing redirects (legally safe “currently listening to”). |
| **Copy-email** | `app.js` | Footer + case-study CTAs copy the address to clipboard with a confirmation. |
| **Scroll reveal** | `app.js` | `IntersectionObserver` adds `.in` to `.reveal` elements. Content is visible by default if JS/observer is unavailable. |
| **Case-study lightbox** | `app.js` | GINTAA persona board opens full-screen with zoom (+/−/wheel/double-click) and drag-to-pan. |
| **FNOL prototype video** | `Case-FNOL.html` + `app.js` | Click-to-play poster → inline `<video>` with native controls. |
| **Resume buttons** | `app.js` | Every `[data-resume]` is wired to open `assets/hemang-sharma-resume.pdf` in a new tab. |

All animations degrade gracefully under `prefers-reduced-motion`.

---

## 5. Editing content (no code knowledge needed)

- **Text**: open the relevant `.html` file, find the words, type over them.
- **A project thumbnail**: drop a new image in `assets/img/`, update the `src="…"`.
- **Résumé**: replace `assets/hemang-sharma-resume.pdf` with a new file of the
  same name — every button updates automatically.
- **Brand colors / fonts**: edit the tokens in `assets/styles.css` `:root`.

Save the file, refresh the browser — that's the whole loop.

---

## 6. Run it locally

Because it's static, you can literally double-click `index.html`. For the
résumé link and video to behave exactly as in production, serve it over HTTP:

```bash
# any one of these, run from the project folder:
python3 -m http.server 8000      # then open http://localhost:8000
npx serve .                       # if you have Node
```

See **DEPLOY.md** for going live.
