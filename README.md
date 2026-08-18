# colton.ink

Multi-disciplinary portfolio for Colton Spahmer — AI engineering, 3D printing,
music, art, and robotics.

## Stack

- **Astro 7**, static output. No SSR, no CMS.
- **Cloudflare Pages** — deploys automatically on push to `main`.
- Interactive layers arrive per section, all client-side:
  `<model-viewer>` (3D), GSAP + ScrollTrigger (scroll animation),
  wavesurfer.js (audio waveforms).
- Node **22** (see `.nvmrc`).

## Running it

```bash
nvm use            # picks up .nvmrc → Node 22
npm install
npm run dev -- --host   # LAN preview: http://192.168.86.55:4321
npm run build           # → dist/
npm run preview         # serve the built output
```

## Resume

`resume/resume.html` is the source; `public/resume.pdf` is generated from it.

```bash
npm run resume       # published copy -> public/resume.pdf (no contact email)
npm run resume:full  # full copy -> ~/assets-archive/ (outside the repo)
```

Two builds from one source. `resume/public.css` sets `display: none` on
anything marked `.private`, which keeps it out of the rendered page *and* the
PDF's text layer — removal, not concealment. The email is `.private`, so the
published copy routes contact through LinkedIn while the full copy, built
outside the repo, keeps the address for applications.

It links `src/styles/tokens.css` with `data-theme="light"`, so the resume takes
its colours from the same tokens as the site — restyle the site and the resume
follows. `resume/resume.css` holds print-only sizing in `pt`, because the
site's fluid `vw`-based type scale means nothing on a fixed page.

WeasyPrint is a system dependency (`apt install weasyprint`) and is NOT part of
the Cloudflare build — regenerate locally and commit the PDF.

The published copy is redacted: no phone number, no street-level location. The
full version lives outside this repo and goes out with applications.

## Design system rules

The site is a token + component system so it can be edited visually at
claude.ai/design. Two rules keep that working:

1. **`src/styles/tokens.css` owns every value.** Colors, type scale, spacing,
   radii, shadows, motion. Components reference custom properties and never
   hard-code a hex, px, or ms. `src/styles/base.css` is the reset and element
   defaults; it reads tokens only.
2. **Section accents flow through `--section-accent`.** Each section sets it
   once (`--hue-ai`, `--hue-print`, `--hue-music`, `--hue-art`,
   `--hue-robotics`); everything nested — eyebrows, rules, hovers, tag pills —
   inherits it. Add a discipline by adding a hue token and a `sections` entry.

Light and dark both ship. Dark is the default look; the light theme re-points
only the semantic layer. The nav toggle stores a choice in `localStorage`, and
with JS off the site follows the system preference.

### `design/` previews

Reusable components each get a standalone preview HTML in `design/` whose first
line is `<!-- @dsCard group="..." -->` (groups: Brand, Type, Components,
Sections). Previews inline `tokens.css` so they render on their own, and are
pushed to the "colton-ink DS" project via DesignSync. *(Added in the
component-library pass.)*

## Layout

```
src/
  data/site.ts        site constants + the ordered section list (nav, footer,
                      and the page outline all read from here)
  styles/tokens.css   design tokens — the one file to restyle
  styles/base.css     reset + element defaults
  layouts/Base.astro  <head>, no-flash theme script, nav + footer shell
  components/         Nav, Footer, Hero, Section, SectionHeader, Placeholder
  pages/index.astro   the single page: hero + six sections
```

## Content still to land

Placeholders marked in `index.astro` wait on: GLB models, /mc dashboard
screenshots, 2–3 music tracks, painting photos, robotics notes, bio + resume
PDF. Each is a `<Placeholder>` component — delete it as the real thing arrives.
