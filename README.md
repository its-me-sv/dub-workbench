# Dub Workbench

A small audio workbench I'm building to get hands-on with browser audio: custom playback, waveform rendering, and eventually a transcript synced to the audio.

**Live:** https://dub-workbench.vercel.app/

## Why

I've spent two years on product frontend (Next.js, TypeScript, multi-tenant dashboards) but never on media-heavy interfaces (not professionaly, but personally I do have projects where I used media interfaces, such as [Pirate Land](https://its-me-sv.github.io/pirate-land/), [Drum Machine](https://github.com/its-me-sv/React-Drum-Machine), [Simon Game](https://github.com/its-me-sv/The-Simon-Game)). This is me closing that gap by building rather than reading about it.

Everything here is written from scratch. No player library, no waveform library. The point is to understand the primitives, so pulling in wavesurfer would defeat the exercise.

## Status

Day 2 of an ongoing build.

- [x] Custom audio player: play/pause, seek, 10s skip, speed control
- [x] Keyboard shortcuts (space, arrows)
- [x] Local file loading
- [x] Waveform rendering via Web Audio API
- [ ] Click-to-seek on the waveform
- [ ] Transcript panel synced to playback
- [ ] HLS playback
- [ ] [CAMB.AI API](https://docs.camb.ai/introduction) integration for TTS and dubbing

## Stack

Next.js (App Router), TypeScript, Tailwind, Shadcn

## Running locally

```bash
npm install
npm run dev
```

## Roadmap

Waveform next, then transcript sync, then wiring it to a real dubbing API.
