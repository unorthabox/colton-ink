/**
 * Site-wide constants. Nav, footer, and the page outline all read from here so
 * there is exactly one list of chapters to keep in order.
 *
 * The page is two chapters — Engineering, then Studio — followed by About.
 * Professional work reads first because hiring managers skim top-down and
 * stop; the creative work follows to humanize rather than to compete.
 */

export const site = {
  name: "Colton Spahmer",
  domain: "colton.ink",
  url: "https://colton.ink",
  tagline: "network + AI engineer · maker · artist",
  description:
    "Network engineering, AI systems, 3D printing, music production, painting, and robotics — the work of Colton Spahmer.",
  /**
   * Email is deliberately absent from the site for now — an address in the
   * markup is the easiest thing on a page for a scraper to harvest. Contact
   * runs through LinkedIn until it comes back. The address still appears in
   * resume.pdf, which is linked from the page.
   */
  github: "https://github.com/unorthabox",
  linkedin: "https://linkedin.com/in/coltonspahmer",
  /** Redacted web copy — the full version goes out with applications. */
  resume: "/resume.pdf",
} as const;

export type Subsection = {
  /** Anchor id, also the URL fragment. */
  id: string;
  /** Full heading used in the subsection itself. */
  title: string;
  /** Small line above the heading. */
  eyebrow: string;
  /** Token name driving this subsection's accent colour. */
  accent: string;
};

export type Chapter = {
  id: string;
  /** Short label for the nav. */
  label: string;
  title: string;
  lede: string;
  accent: string;
  subsections: Subsection[];
};

export const chapters: Chapter[] = [
  {
    id: "engineering",
    label: "Engineering",
    title: "Engineering",
    lede: "Over a decade keeping carrier networks alive, and everything I've built on top of them since — agents, fleets, and the machines they run on.",
    accent: "--hue-network",
    subsections: [
      {
        id: "networks",
        title: "Network Engineering",
        eyebrow: "Carrier and enterprise networks",
        accent: "--hue-network",
      },
      {
        id: "ai",
        title: "AI Systems",
        eyebrow: "Agents, fleets, and pipelines",
        accent: "--hue-ai",
      },
      {
        id: "printing",
        title: "The Print Pipeline",
        eyebrow: "Design, slice, monitor, print",
        accent: "--hue-print",
      },
      {
        id: "robotics",
        title: "Robotics",
        eyebrow: "Build log — in progress",
        accent: "--hue-robotics",
      },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    title: "Studio",
    lede: "Off the clock it's paint, plaster, grout, a DAW, and a printer making objects instead of parts.",
    accent: "--hue-art",
    subsections: [
      {
        id: "art",
        title: "Art",
        eyebrow: "Paint, plaster, grout",
        accent: "--hue-art",
      },
      {
        id: "music",
        title: "Music",
        eyebrow: "Production and sound design",
        accent: "--hue-music",
      },
      {
        id: "objects",
        title: "Printed Objects",
        eyebrow: "Modelled, printed, kept",
        accent: "--hue-print",
      },
    ],
  },
];

/** About sits outside the chapters — it closes the page. */
export const about = {
  id: "about",
  label: "About",
  title: "About & Contact",
  eyebrow: "Who's behind all this",
  accent: "--color-accent",
} as const;
