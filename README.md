# Dub Workbench

A small audio workbench I'm building to get hands-on with browser audio: custom playback, waveform rendering, and eventually a transcript synced to the audio.

**Live:** https://dub-workbench.vercel.app/

## Why

I've spent 2 years on product frontend (Next.js, TypeScript, multi-tenant dashboards) but not much on media-heavy interfaces professionally. Personally I've built a few: [Pirate Land](https://its-me-sv.github.io/pirate-land/), [Drum Machine](https://github.com/its-me-sv/React-Drum-Machine), [Simon Game](https://github.com/its-me-sv/The-Simon-Game). This is me closing the gap properly by building rather than reading about it.

Everything here is written from scratch. No player library, no waveform library. The point is to understand the primitives, so pulling in wavesurfer would defeat the exercise.

## Status

Day 3 of an ongoing build.

- [x] Custom audio player: play/pause, seek, 10s skip, speed control
- [x] Keyboard shortcuts (space, arrows)
- [x] Local file loading
- [x] Waveform rendering via Web Audio API
- [x] Click-to-seek on the waveform, with progress fill
- [ ] Transcript panel synced to playback
- [ ] HLS playback
- [ ] [CAMB.AI API](https://docs.camb.ai/introduction) integration for transcription and dubbing

## Notes

Things that were not obvious going in.

**Scrubbing.** The seeker fights the playhead when both write position state at once. An `isScrubbing` flag fixes it: while dragging, position comes only from the input, and the audio seeks on release.

**Duration.** Not available on mount. It has to be read in the `loadedmetadata` handler or you get `NaN` on the first render.

**Decoding.** `decodeAudioData` detaches the ArrayBuffer, so pass `buffer.slice(0)` if the bytes are needed again. A three-minute file at 44.1kHz is around eight million samples, which cannot live in React state. Decode once, downsample to peaks, keep only the peaks in a ref.

**Canvas.** For click-to-seek, use `getBoundingClientRect` rather than `offsetX`, which is unreliable across browsers when the canvas is scaled.

## Stack

Next.js (App Router), TypeScript, Tailwind, shadcn/ui.

## Running locally

```bash
npm install
npm run dev
```

## Roadmap

Transcript panel synced to playback next, using timestamped segments from the CAMB.AI transcription API. Then HLS playback, then dubbing.
