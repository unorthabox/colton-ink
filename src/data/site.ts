/**
 * Site-wide constants. Nav, footer, and the page outline all read from here so
 * there is exactly one list of sections to keep in order.
 */

export const site = {
  name: "Colton Spahmer",
  domain: "colton.ink",
  url: "https://colton.ink",
  tagline: "engineer · maker · artist",
  description:
    "AI engineering, 3D printing, music production, painting, and robotics — the work of Colton Spahmer.",
  email: "[redacted]",
  github: "https://github.com/unorthabox",
} as const;

export type Section = {
  /** Anchor id, also the URL fragment. */
  id: string;
  /** Short label for the nav. */
  label: string;
  /** Full heading used in the section itself. */
  title: string;
  /** Small line above the heading. */
  eyebrow: string;
  /** Token name driving this section's accent colour. */
  accent: string;
};

export const sections: Section[] = [
  {
    id: "ai",
    label: "AI",
    title: "AI Engineering",
    eyebrow: "Agents, fleets, and pipelines",
    accent: "--hue-ai",
  },
  {
    id: "printing",
    label: "3D",
    title: "3D Printing",
    eyebrow: "Design, slice, monitor, print",
    accent: "--hue-print",
  },
  {
    id: "music",
    label: "Music",
    title: "Music",
    eyebrow: "Production and sound design",
    accent: "--hue-music",
  },
  {
    id: "art",
    label: "Art",
    title: "Art",
    eyebrow: "Paint now, VR murals next",
    accent: "--hue-art",
  },
  {
    id: "robotics",
    label: "Robotics",
    title: "Robotics",
    eyebrow: "Build log — in progress",
    accent: "--hue-robotics",
  },
  {
    id: "about",
    label: "About",
    title: "About & Contact",
    eyebrow: "Who's behind all this",
    accent: "--color-accent",
  },
];
