# Assets

These are the files the site currently uses. Everything is wired up in
[`src/content/site.ts`](../src/content/site.ts) — change a filename or caption
there and the site follows. Nothing is hardcoded in components.

## In use right now

| File | Used for |
|---|---|
| `her.jpg` | "My Girl ✨" profile picture |
| `him.jpg` | "Handsome Boy" profile picture |
| `5.jpg` | Hero / billboard background + Episode 1 poster |
| `6.jpg` | Memory — Shabu Date Night 🍣 |
| `7.jpg` | Memory — Little Flower Girl 🌿 + Episode 2 poster |
| `8.jpg` | Memory — Sushi With My Love 🍥 |
| `9.jpg` | Memory — Car Wash Cutie 🚗💦 |
| `tiktok.mp3` | Music on the intro screen |
| `song.mp3` | Music on the main page (fades in after choosing a profile) |

## Two things worth doing

**1. Rewrite the captions.** I guessed them from the photos. The real ones are
yours — edit `memories` in `src/content/site.ts`.

**2. Add videos (optional).** The "Episodes of Us" rows currently show a still
photo, and tapping one opens it full-screen. To make them real playable clips:

1. Drop an `.mp4` in this folder, e.g. `6.mp4`.
2. In `src/content/site.ts`, uncomment the `video:` line on that episode:
   ```ts
   {
     id: "e1",
     title: "The Beginning",
     poster: "/5.jpg",
     video: "/6.mp4",   // ← uncomment this
   }
   ```

The row thumbnail then becomes a silent looping preview and clicking opens a
video player, exactly like the reference site.

## Tips

- A missing file never breaks the page — a coloured placeholder shows instead.
- Keep videos under ~10 MB each so it loads fast on mobile data.
- `5.jpg` is a portrait photo used as a wide hero, so it crops tight on desktop.
  A landscape shot (~1920×1080) will look better if you have one.
