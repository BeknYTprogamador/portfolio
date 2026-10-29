# Vinícius Cardoso — Manual QA Portfolio

A lightweight, single-page portfolio for a manual QA tester with a web/game
development background. No frameworks, no build step, no trackers.

## Run it locally

Open `index.html` directly, or serve the folder:

```bash
# Python 3
python -m http.server 8000

# or with Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy

Drag the folder into Netlify, or import the repository into Vercel / GitHub
Pages. There is nothing to build: the entry point is `index.html`.

After deploying, replace the relative social image with an absolute URL and add
the canonical/OG URLs. Social crawlers ignore relative image paths, so this step
is required for the preview card to appear:

```html
<meta property="og:image" content="https://your-domain.com/assets/og-card.png">
<meta property="og:url" content="https://your-domain.com/">
<link rel="canonical" href="https://your-domain.com/">
```

Use the same absolute URL for `twitter:image` if you add one.

## Files

```text
.
├── index.html          # All page content and structure
├── styles.css          # Design system, layout, responsive rules
├── script.js           # Mobile nav, scroll reveal, active nav, copy email
├── assets/
│   ├── battle-of-the-raven.jpg
│   ├── dshop-pro.webp
│   ├── nexus-logo.png
│   ├── og-card.png
│   └── favicon.svg
├── design/
│   └── og-card.html    # Source for the social preview image
└── README.md
```

## Content strategy used here

### 1. Lead with QA, not with code

The hero, navigation, and first project section all frame you as a **manual QA
tester**. Development is presented as the reason you test well — not as your
current job title. This avoids the "junior developer applying for QA" problem.

### 2. Show evidence before biography

Recruiters scan for proof. The page order is:

1. A real bug report in the hero
2. Selected QA work and two full sample reports
3. The 2025 build foundation
4. Hobby projects, kept separate from the evidence
5. About you
6. Your process and skills
7. Contact

The About section still does its job, but it arrives after proof.

### 3. Separate "QA work" from "build foundation" and hobbies

The 2026 section uses a light background and is labeled **Selected work**. The
2025 section uses a dark background and is labeled **Build foundation**. The
copy explicitly says: *"I'm not a full-time developer today."* That keeps the
distinction honest without hiding the experience.

Nexus and Battle of the Raven sit in a separate **Off the clock** block inside
the dark band. They are labeled as personal/collaborative projects, not client
work and not QA case studies. Keeping them out of Selected work avoids
double-counting them as evidence while still showing range and personality.

### 4. Make the bug report the hero visual

The ticket card is the strongest differentiator on the page. It shows the exact
skill a QA employer is hiring for: turning a broken flow into a readable,
reproducible report.

### 5. Keep claims small and specific

The copy avoids "expert", "senior", and invented metrics. It uses concrete
verbs: tested, documented, shipped, reproduced, verified. Specificity builds
more trust than adjectives.

## Editing the content

- **Hero headline / intro:** `index.html`, `.hero-copy`.
- **Quick facts:** `index.html`, `.fact-list`.
- **QA project cards:** `index.html`, `.project-grid`.
- **Bug reports:** `index.html`, `.reports` — each report is a native
  `<details>` element. Add a new `<details class="report">` block to add one.
- **2025 projects:** `index.html`, `.build-grid`.
- **Hobby projects:** `index.html`, `.hobby` and `.hobby-grid` inside the
  build-foundation section. They intentionally reuse `.build-card` styles.
- **About copy:** `index.html`, `.about-copy`.
- **Skills and process:** `index.html`, `.steps` and `.skills`.
- **Contact details:** `index.html`, `.contact`.

### Colors and type

All design tokens live at the top of `styles.css`:

```css
:root {
  --paper: #f7f5ef;
  --ink: #171a16;
  --accent: #1e5b45;
  --lime: #d8f07f;
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Change those values and the whole site follows.

## Dark theme

The site ships with a light and dark theme:

- The first visit follows `prefers-color-scheme`. The header toggle overrides it
  and stores the choice in `localStorage` under `theme`.
- The initial theme is applied by a small inline script in `<head>` before the
  stylesheet loads, so there is no flash of the wrong theme.
- Dark tokens live in the `[data-theme="dark"]` block at the top of
  `styles.css`. Change them there and every component follows.
- The 2025 foundation, hobby projects, and contact sections pin their own
  light-on-dark palette, so they stay dark and keep their contrast in both
  themes.
- `meta[name="theme-color"]` updates with the active theme for mobile browser
  chrome.

To force one theme for a demo, set `data-theme="dark"` on the `<html>` element
and clear the stored `theme` key.

## Accessibility and performance notes

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`.
- Skip link, visible focus states, and `aria-expanded` on the mobile menu.
- Native `<details>` elements for reports — no JavaScript required to open them.
- Scroll reveal is disabled for `prefers-reduced-motion`.
- Images are lazy-loaded and compressed. Total page weight is under ~500 KB
  including fonts and images.
- No tracking scripts, cookies, or external JavaScript dependencies.

## Asset notes

The project previews are taken from your own live projects and compressed for
the web. If you replace them, keep the same aspect ratio (16:10) and export at
around 1200 px wide. The `dshop-pro.webp` file is a square mockup, so it uses
`object-fit: contain` on a dark background to avoid cropping the artwork.

The social preview (`assets/og-card.png`) is rendered from
`design/og-card.html`, which is not linked from the site. To update it, edit
that file, open it in a browser at 1200 × 630, and capture the viewport as a
PNG. Keep the source file so the card stays easy to revise.


