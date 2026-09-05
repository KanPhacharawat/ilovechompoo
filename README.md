# LOVEFLIX ❤️

A personal, Netflix-style static site — a "Who's watching?" profile screen that
opens into a browse page full of our memories.

Built with React + TypeScript + Vite, Tailwind CSS v4 and shadcn/ui, following
the design system in [DESIGN.md](DESIGN.md).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## The flow

1. **Intro** — a black screen; tap anywhere and `LOVEFLIX` reveals letter by
   letter with the Netflix loading spinner, then fades away. Music starts here
   (the tap is the only moment browsers allow audio to begin).
2. **Who's watching?** — two profiles. Picking one cross-fades the music into
   `song.mp3` and takes you to the browse page.
3. **Browse** — hero billboard with Play / More Info, a horizontally scrolling
   "Trending Memories" row, and the "Episodes of Us" list. Photos open
   full-screen; the ⓘ button opens the love note.

## Making it yours

**Everything you'd want to change lives in one file:
[`src/content/site.ts`](src/content/site.ts)** — profile names, the hero title
and synopsis, memory captions, episode titles, and the love note. No component
holds hardcoded content.

Photos, videos and music go in [`public/`](public/) — see
[`public/README.md`](public/README.md) for what each file is used for and how to
add video episodes.

## Structure

```
src/
  content/site.ts          all copy + asset paths (edit this)
  context/
    ProfileContext.tsx     which profile is watching (sessionStorage-backed)
    MusicContext.tsx       one <audio> element, survives route changes
  routes/
    Landing.tsx            intro + "Who's watching?"
    Browse.tsx             the main page
  components/
    intro/                 the LOVEFLIX letter-reveal overlay
    profiles/              profile picker
    layout/                navbar (hides on scroll), music toggle
    home/                  hero, memory row, episode list
    modals/                info note, video player, photo lightbox
    motion/                Reveal / RevealGroup scroll-in wrappers
    ui/                    shadcn primitives (button, animated dialog)
  lib/motion.ts            easing, durations and shared variants
  index.css                design tokens from DESIGN.md
```

## Deploying

Push to GitHub and import the repo on [Vercel](https://vercel.com) — it detects
Vite automatically. [`vercel.json`](vercel.json) already contains the SPA rewrite
so `/browse` works on a hard refresh.

## Motion

All timing and easing lives in [`src/lib/motion.ts`](src/lib/motion.ts) so the
whole site moves as one piece. What is animated:

- **Intro** — the black screen lifts away (fade + scale + blur) instead of cutting.
- **Profile picker** — heading and avatars stagger in; the one you pick floats to
  the centre and grows while the music cross-fades.
- **Hero** — content staggers in on load, then the artwork parallaxes and the
  text fades as you scroll past it.
- **Rows** — section headings and cards rise into view as you reach them, one
  after another. Cards lift on hover; episode rows slide right.
- **Opening a photo or video** — the thumbnail itself grows into the full-size
  view (a shared `layoutId`), rather than a new panel appearing over it.
- **Closing** — dialogs animate out properly; Radix would normally unmount them
  instantly, so `AnimatedDialog` hands the unmount to `AnimatePresence`.

Everything above is disabled automatically for anyone with
`prefers-reduced-motion: reduce` set.

## Notes

- A missing asset never breaks the page; a coloured placeholder shows instead.
- The intro plays once per browser session, so a refresh doesn't replay it.
- Opening `/browse` without picking a profile redirects back to the start.
