/**
 * Generates the standalone previews in design/.
 *
 * Each preview inlines the real tokens.css and components.css rather than a
 * copy, so a preview cannot drift from the site: change a token, re-run this,
 * and every card reflects it. The first line of each file is the
 * `<!-- @dsCard group="..." -->` marker the Design System pane indexes on.
 *
 *   npm run design
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = readFileSync(join(root, "src/styles/tokens.css"), "utf8");
const components = readFileSync(join(root, "src/styles/components.css"), "utf8");
const outDir = join(root, "design");

/** Chrome shared by every preview: the page frame a component sits in. */
const base = readFileSync(join(root, "src/styles/base.css"), "utf8");

const frame = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 0;
    padding: var(--space-lg);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-text-strong);
    margin: 0;
  }
  p, ul, ol { margin: 0; }
  a { color: inherit; }
  /* Preview scaffolding — labels the variants, never the component itself. */
  .ds-stack { display: flex; flex-direction: column; gap: var(--space-lg); }
  .ds-row { display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center; }
  .ds-label {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: var(--space-2xs);
  }
`;

const page = ({ group, title, body, extra = "", accent = "--color-accent" }) =>
  `<!-- @dsCard group="${group}" -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
${tokens}
${base}
${components}
${frame}
:root { --section-accent: var(${accent}); }
${extra}
</style>
</head>
<body>
${body}
</body>
</html>
`;

/* --- The cards ---------------------------------------------------------- */

const swatch = (name, token) =>
  `<div><div style="height:4.5rem;border-radius:var(--radius-md);border:var(--border-hairline) solid var(--color-border);background:var(${token})"></div><p class="ds-label" style="margin-top:var(--space-2xs)">${name}</p><code style="font-family:var(--font-mono);font-size:var(--text-2xs);color:var(--color-text-muted)">${token}</code></div>`;

const previews = [
  {
    file: "brand-palette.html",
    group: "Brand",
    title: "Palette",
    body: `<h2 style="margin-bottom:var(--space-md)">Palette</h2>
<p class="ds-label">Discipline hues — each section owns one</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:var(--space-md);margin-bottom:var(--space-xl)">
${swatch("Network", "--hue-network")}
${swatch("AI", "--hue-ai")}
${swatch("Print", "--hue-print")}
${swatch("Music", "--hue-music")}
${swatch("Art", "--hue-art")}
${swatch("Robotics", "--hue-robotics")}
</div>
<p class="ds-label">Semantic surfaces</p>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:var(--space-md)">
${swatch("Background", "--color-bg")}
${swatch("Surface", "--color-surface")}
${swatch("Surface raised", "--color-surface-raised")}
${swatch("Border", "--color-border")}
${swatch("Text", "--color-text")}
${swatch("Text muted", "--color-text-muted")}
</div>`,
  },
  {
    file: "type-scale.html",
    group: "Type",
    title: "Type scale",
    body: `<h2 style="margin-bottom:var(--space-md)">Type scale</h2>
<div class="ds-stack" style="gap:var(--space-md)">
${["5xl", "4xl", "3xl", "2xl", "xl", "lg", "md", "sm", "xs", "2xs"]
  .map(
    (step) =>
      `<div><code class="ds-label">--text-${step}</code><p style="font-family:var(--font-display);font-size:var(--text-${step});line-height:var(--leading-tight);letter-spacing:var(--tracking-tight);color:var(--color-text-strong)">Engineer, maker, artist</p></div>`
  )
  .join("\n")}
</div>
<p class="ds-label" style="margin-top:var(--space-xl)">Families</p>
<div class="ds-stack" style="gap:var(--space-sm)">
  <p style="font-family:var(--font-display);font-size:var(--text-xl)">Display — Space Grotesk</p>
  <p style="font-family:var(--font-sans);font-size:var(--text-lg)">Sans — Inter, body copy and UI</p>
  <p style="font-family:var(--font-mono);font-size:var(--text-md)">Mono — JetBrains Mono, eyebrows and metadata</p>
</div>`,
  },
  {
    file: "button.html",
    group: "Components",
    title: "Button",
    body: `<div class="ds-stack">
  <div><p class="ds-label">Variants</p><div class="ds-row">
    <a class="btn btn--primary" href="#">See the work</a>
    <a class="btn btn--ghost" href="#">Secondary</a>
    <span class="btn btn--ghost btn--disabled" aria-disabled="true">Get in touch</span>
  </div></div>
  <div><p class="ds-label">Small</p><div class="ds-row">
    <a class="btn btn--primary btn--small" href="#">Primary</a>
    <a class="btn btn--ghost btn--small" href="#">Ghost</a>
  </div></div>
  <div><p class="ds-label">Primary picks up the section accent</p><div class="ds-row">
    <a class="btn btn--primary" href="#" style="--section-accent:var(--hue-print)">Print</a>
    <a class="btn btn--primary" href="#" style="--section-accent:var(--hue-music)">Music</a>
    <a class="btn btn--primary" href="#" style="--section-accent:var(--hue-art)">Art</a>
  </div></div>
</div>`,
  },
  {
    file: "tag-pill.html",
    group: "Components",
    title: "Tag pill",
    body: `<div class="ds-stack">
  <div><p class="ds-label">Solid — used inside cards</p>
    <ul class="tag-row"><li class="tag">Cisco IOS</li><li class="tag">BGP</li><li class="tag">OSPF</li><li class="tag">Proxmox</li></ul>
  </div>
  <div><p class="ds-label">Outline — used in the hero and media rows</p>
    <ul class="tag-row tag-row--loose">
      <li class="tag tag--outline" style="--section-accent:var(--hue-network)">Network engineering</li>
      <li class="tag tag--outline" style="--section-accent:var(--hue-ai)">AI engineering</li>
      <li class="tag tag--outline" style="--section-accent:var(--hue-print)">3D printing</li>
      <li class="tag tag--outline" style="--section-accent:var(--hue-music)">Music</li>
      <li class="tag tag--outline" style="--section-accent:var(--hue-art)">Art</li>
      <li class="tag tag--outline" style="--section-accent:var(--hue-robotics)">Robotics</li>
    </ul>
  </div>
</div>`,
  },
  {
    file: "card.html",
    group: "Components",
    title: "Case-study card",
    accent: "--hue-ai",
    body: `<div class="ds-stack">
  <div><p class="ds-label">Feature — two-up grid</p>
    <ul class="card-grid card-grid--feature">
      <li class="card card--feature">
        <h4 class="card__title">Mission Control</h4>
        <p class="card__teaser">The dashboard and agent fleet that runs my homelab — live status, job queues, and agents that pick up work without being asked.</p>
        <ul class="tag-row card__tags"><li class="tag">Agents</li><li class="tag">Dashboard</li><li class="tag">Voice</li></ul>
        <p class="card__note">Case study in progress</p>
      </li>
      <li class="card card--feature">
        <h4 class="card__title">The homelab</h4>
        <p class="card__teaser">A Proxmox host running the services I depend on daily — virtualization, networking, storage, and monitoring, all mine end to end.</p>
        <ul class="tag-row card__tags"><li class="tag">Proxmox</li><li class="tag">Infra</li><li class="tag">Self-hosted</li></ul>
        <p class="card__note">Case study in progress</p>
      </li>
    </ul>
  </div>
  <div style="--section-accent:var(--hue-network)"><p class="ds-label">Default — three-up capability grid</p>
    <ul class="card-grid">
      <li class="card"><h4 class="card__title">Multi-vendor integration</h4><p class="card__teaser">RAD hardware into Ciena and Cisco environments across 50–100+ client sites.</p><ul class="tag-row card__tags"><li class="tag">Cisco IOS</li><li class="tag">Ciena</li></ul></li>
      <li class="card"><h4 class="card__title">Carrier Ethernet &amp; WAN</h4><p class="card__teaser">Ethernet and WAN circuits engineered to enterprise requirements.</p><ul class="tag-row card__tags"><li class="tag">BGP</li><li class="tag">OSPF</li></ul></li>
      <li class="card"><h4 class="card__title">Outage response</h4><p class="card__teaser">Service-affecting outages diagnosed and escalated through to resolution.</p><ul class="tag-row card__tags"><li class="tag">Escalation</li></ul></li>
    </ul>
  </div>
</div>`,
  },
  {
    file: "gallery-tile.html",
    group: "Components",
    title: "Gallery tile & lightbox",
    accent: "--hue-art",
    body: `<div class="ds-stack">
  <div><p class="ds-label">Tiles — empty state, before photographs land</p>
    <ul class="gallery">
      <li><div class="placeholder" style="aspect-ratio:3/4"><span class="placeholder__label">Painting</span></div></li>
      <li><div class="placeholder" style="aspect-ratio:3/4"><span class="placeholder__label">Sculpture</span></div></li>
      <li><div class="placeholder" style="aspect-ratio:3/4"><span class="placeholder__label">Mosaic</span></div></li>
    </ul>
  </div>
  <div><p class="ds-label">Tile with image — caption reveals on hover</p>
    <ul class="gallery" style="grid-template-columns:repeat(2,1fr);max-width:34rem">
      <li><button class="tile" style="aspect-ratio:3/4"><div style="width:100%;height:100%;background:linear-gradient(140deg,var(--hue-art),var(--hue-music))"></div><span class="tile__caption">Untitled, oil on canvas</span></button></li>
      <li><button class="tile" style="aspect-ratio:3/4"><div style="width:100%;height:100%;background:linear-gradient(200deg,var(--hue-print),var(--hue-robotics))"></div><span class="tile__caption">Mosaic study</span></button></li>
    </ul>
  </div>
  <div><p class="ds-label">Lightbox — opened state</p>
    <div class="lightbox" style="position:relative;display:block;width:100%;max-width:34rem">
      <button class="lightbox__close" type="button" aria-label="Close">✕</button>
      <figure class="lightbox__figure">
        <div style="width:100%;aspect-ratio:4/3;background:linear-gradient(140deg,var(--hue-art),var(--hue-music))"></div>
        <figcaption class="lightbox__caption">Untitled, oil on canvas</figcaption>
      </figure>
    </div>
  </div>
</div>`,
  },
  {
    file: "audio-player.html",
    group: "Components",
    title: "Audio player",
    accent: "--hue-music",
    body: `<div class="ds-stack">
  <p class="ds-label">Shell — waveform height reserved before wavesurfer.js mounts</p>
  <div class="audio">
    <button class="audio__play" type="button" aria-label="Play"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
    <div class="audio__body">
      <p class="audio__title">Track 01</p>
      <p class="audio__meta">awaiting audio</p>
      <div class="audio__wave"></div>
    </div>
  </div>
  <div class="audio">
    <button class="audio__play" type="button" aria-label="Play"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
    <div class="audio__body">
      <p class="audio__title">Track 02</p>
      <p class="audio__meta">3:41 · 2026</p>
      <div class="audio__wave"></div>
    </div>
  </div>
</div>`,
  },
  {
    file: "contact-block.html",
    group: "Components",
    title: "Contact block",
    body: `<div class="ds-stack">
  <p class="ds-label">Email is deliberately absent site-wide — contact routes via LinkedIn</p>
  <div class="contact">
    <a class="contact__link" href="#">linkedin.com/in/coltonspahmer</a>
    <a class="contact__link" href="#">github.com/unorthabox</a>
    <a class="contact__link contact__cta" href="#">Resume (PDF)</a>
  </div>
</div>`,
  },
  {
    file: "section-header.html",
    group: "Sections",
    title: "Section header",
    body: `<div class="ds-stack" style="gap:var(--space-2xl)">
  <div style="--section-accent:var(--hue-network)"><div class="section-header">
    <p class="eyebrow">Carrier and enterprise networks</p>
    <h3 class="section-header__title">Network Engineering</h3>
    <p class="section-header__lede">Cisco IOS, BGP, OSPF, and carrier Ethernet — the layer everything else on this page runs on top of.</p>
  </div></div>
  <div style="--section-accent:var(--hue-art)"><div class="section-header">
    <p class="eyebrow">Paint, plaster, grout</p>
    <h3 class="section-header__title">Art</h3>
    <p class="section-header__lede">Paint, plaster, and grout — plus a Quest headset that's about to become a brush.</p>
  </div></div>
  <div style="--section-accent:var(--hue-print)"><div class="note"><p>Accented aside, used for asides and cross-links between sections.</p></div></div>
</div>`,
  },
  {
    file: "nav.html",
    group: "Sections",
    title: "Navigation",
    extra: "body { padding: 0; } .ds-note { padding: var(--space-lg); }",
    body: `<header class="nav" data-scrolled>
  <div class="nav__inner container container--wide">
    <a class="nav__brand" href="#"><span class="nav__mark"></span><span class="nav__wordmark">colton.ink</span></a>
    <nav class="nav__links">
      <a class="nav__link" href="#" style="--section-accent:var(--hue-network)">Engineering</a>
      <a class="nav__link" href="#" style="--section-accent:var(--hue-art)">Studio</a>
      <a class="nav__link" href="#">About</a>
    </nav>
    <button class="nav__theme" type="button" aria-label="Switch colour theme">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1.5v2.2M12 20.3v2.2M22.5 12h-2.2M3.7 12H1.5"/><path d="M19.4 4.6l-1.6 1.6M6.2 17.8l-1.6 1.6M19.4 19.4l-1.6-1.6M6.2 6.2L4.6 4.6"/></g></svg>
    </button>
  </div>
</header>
<div class="ds-note"><p class="ds-label">Sticky, blurred backdrop. Chapter links tint to their own hue on hover.</p></div>`,
  },
  {
    file: "footer.html",
    group: "Sections",
    title: "Footer",
    extra: "body { padding: 0; } .footer { margin-top: 0; }",
    body: `<footer class="footer">
  <div class="footer__inner container container--wide">
    <div class="footer__brand">
      <p class="footer__name">Colton Spahmer</p>
      <p class="footer__tagline">network + AI engineer · maker · artist</p>
    </div>
    <nav class="footer__nav">
      <div class="footer__group" style="--section-accent:var(--hue-network)">
        <a class="footer__link footer__link--head" href="#">Engineering</a>
        <a class="footer__link" href="#">Network Engineering</a>
        <a class="footer__link" href="#">AI Systems</a>
        <a class="footer__link" href="#">The Print Pipeline</a>
        <a class="footer__link" href="#">Robotics</a>
      </div>
      <div class="footer__group" style="--section-accent:var(--hue-art)">
        <a class="footer__link footer__link--head" href="#">Studio</a>
        <a class="footer__link" href="#">Art</a>
        <a class="footer__link" href="#">Music</a>
        <a class="footer__link" href="#">Printed Objects</a>
      </div>
      <a class="footer__link footer__link--head" href="#">About &amp; Contact</a>
    </nav>
    <div class="footer__contact">
      <a class="footer__link" href="#">GitHub</a>
      <a class="footer__link" href="#">LinkedIn</a>
      <a class="footer__link" href="#">Resume (PDF)</a>
    </div>
  </div>
  <p class="footer__legal container container--wide">
    <span>© 2026 Colton Spahmer</span>
    <span class="footer__built">Built with Astro · deployed on push</span>
  </p>
</footer>`,
  },
  {
    file: "hero.html",
    group: "Sections",
    title: "Hero shell",
    extra: "body { padding: 0; } .hero { padding-block: var(--space-xl); }",
    body: `<section class="hero">
  <div class="hero__inner container container--wide">
    <div class="hero__copy">
      <p class="hero__eyebrow">network + AI engineer · maker · artist</p>
      <h1 class="hero__name"><span class="hero__line">Colton</span><span class="hero__line hero__line--accent">Spahmer</span></h1>
      <p class="hero__lede prose">Over a decade keeping carrier networks up, and the rest of my time building the systems that run on them — then printing the parts, scoring the soundtrack, and painting the walls. Six disciplines, one workshop.</p>
      <ul class="tag-row tag-row--loose hero__tags">
        <li class="tag tag--outline" style="--section-accent:var(--hue-network)">Network engineering</li>
        <li class="tag tag--outline" style="--section-accent:var(--hue-ai)">AI engineering</li>
        <li class="tag tag--outline" style="--section-accent:var(--hue-print)">3D printing</li>
        <li class="tag tag--outline" style="--section-accent:var(--hue-music)">Music</li>
        <li class="tag tag--outline" style="--section-accent:var(--hue-art)">Art</li>
        <li class="tag tag--outline" style="--section-accent:var(--hue-robotics)">Robotics</li>
      </ul>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#">See the work</a>
        <span class="btn btn--ghost btn--disabled" aria-disabled="true">Get in touch</span>
      </div>
    </div>
    <div class="hero__visual">
      <div class="hero__stage" aria-hidden="true">
        <div class="hero__orb"></div><div class="hero__grid"></div><div class="hero__ring"></div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    file: "chapter.html",
    group: "Sections",
    title: "Chapter header",
    extra: "body { padding: 0; }",
    body: `<section class="chapter" style="--section-accent:var(--hue-network)">
  <header class="chapter__header"><div class="container container--wide">
    <p class="chapter__index">01</p>
    <h2 class="chapter__title">Engineering</h2>
    <p class="chapter__lede prose">Over a decade keeping carrier networks alive, and everything I've built on top of them since — agents, fleets, and the machines they run on.</p>
  </div></header>
</section>
<section class="chapter" style="--section-accent:var(--hue-art)">
  <header class="chapter__header"><div class="container container--wide">
    <p class="chapter__index">02</p>
    <h2 class="chapter__title">Studio</h2>
    <p class="chapter__lede prose">Off the clock it's paint, plaster, grout, a DAW, and a printer making objects instead of parts.</p>
  </div></header>
</section>`,
  },
];

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
for (const p of previews) {
  writeFileSync(join(outDir, p.file), page(p));
}
const written = readdirSync(outDir);
console.log(`design/: ${written.length} previews`);
for (const f of written) console.log(`  ${f}`);
