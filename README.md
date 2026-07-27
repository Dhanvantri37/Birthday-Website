# Happy Birthday — A Cinematic Journey

An interactive, animated birthday website inspired by Krishna, Vrindavan, and
family love. Built with React, Vite, TypeScript, Tailwind CSS, and Framer
Motion.

## 1. Run it on your system

You need **Node.js 18+** installed (check with `node -v`; get it from
nodejs.org if you don't have it).

```bash
cd krishna-birthday
npm install
npm run dev
```

Vite prints a local address, usually http://localhost:5173 — open it in your
browser. It hot-reloads instantly every time you save a file.

When ready to share it, build the optimized production version:

```bash
npm run build
npm run preview
```

The static site lands in the `dist/` folder.

### Alternatively: Run with Docker

If you prefer to run the application using Docker, we have configured support for both local development and production.

#### Production Build (Nginx)
To build the image and serve the production site on [http://localhost:8080](http://localhost:8080):
```bash
docker compose up app --build
```

#### Local Development (Live Reload)
To run the dev server with code mounting and hot reloading on [http://localhost:5173](http://localhost:5173):
```bash
docker compose up dev
```

## 2. Personalize — one file to edit

Everything lives in **`src/config.ts`**:

| What | Where |
|---|---|
| Her name & age | `sisterName`, `age` |
| Krishna's spoken blessing | `krishnaBlessing` array |
| Memory Garden photos/captions | `memories` array |
| Mom's & Brother's messages | `gifts.momMessage`, `gifts.brotherMessage` |
| The blessings (lotus count = array length) | `blessings` array |
| The handwritten letter | `letter` |
| Final secret message | `finalMessage` |

## 3. Add your own photos, music, and videos

Drop real files into these folders (each has a README.txt inside):

```
public/photos/   -> memory-1.jpg ... memory-20.jpg, family.jpg
public/audio/    -> flute.mp3 (music), krishna-blessing.mp3 (optional narration)
public/video/    -> mom.mp4, brother.mp4, final.mp4 (optional)
public/qr/       -> scan-me.png (optional)
```

Then set the matching path in `src/config.ts`, e.g. `gifts.momVideo = "/video/mom.mp4"`.
Missing files fall back gracefully to text, so you can launch before every
asset is ready.

**About the Krishna narration / AI avatars:** real audio, voice clones, and
AI avatar videos need a separate voice/video-generation tool — I can't
produce those here. Easiest paths: record a real voice/video message on a
phone and drop it in `public/video/` or `public/audio/`, or generate one with
a tool like ElevenLabs (voice) or HeyGen/D-ID (talking avatar) and drop the
export into the same folders.

## 4. What's already interactive

- **Cake scene**: blow out the candle via your microphone (button fallback
  included).
- **Memory Garden**: tap any photo to zoom in and read its caption.
- **Gift Room / Blessings**: every box and lotus is clickable.
- **Music player**: on/off + volume, top-left, on every scene.

Want a guestbook, a countdown to the exact birthday moment, or a shareable
link with her name pre-filled from a URL? Just ask.

## 5. Put it online

- **Vercel**: run `npx vercel` inside the project folder.
- **Netlify**: drag-and-drop the `dist/` folder onto app.netlify.com/drop
- **GitHub Pages**: push the repo, `npm run build`, deploy `dist/`.

## Project structure

```
src/
  config.ts               <- edit this for personalization
  App.tsx                 <- orchestrates the journey between scenes
  components/
    AmbientBackground.tsx    petals by day, stars by night
    FeatherProgress.tsx      peacock-feather progress indicator
    MusicPlayer.tsx          music on/off + volume
    SceneShell.tsx           shared full-screen scene layout
  scenes/
    Landing.tsx, KrishnaBlessing.tsx, MemoryGallery.tsx,
    GiftBoxes.tsx, Blessings.tsx, Letter.tsx,
    BirthdaySky.tsx, Cake.tsx, FinalGift.tsx
```

Happy birthday to her!

