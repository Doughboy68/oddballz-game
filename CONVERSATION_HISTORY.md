# Oddballz (1992) - Project Conversation History

**Conversation ID**: `f4579688-b638-4c5b-8f8b-9b13f7ea3a0b`
**Date**: July 22, 2026

---

## 📌 Summary of Original Requirements & 1992 Ruleset

- **Game Name**: Oddballz (1992)
- **Authors**: Fred Kohler & Brian Semotiuk
- **Original Source Files**: `ODDBALLZ.PAS` and `ODDUNIT.PAS` (Borland Pascal 7.0 / Turbo Pascal for Windows)
- **Grid Layout**: Flat-topped hexagonal honeycomb playfield mapped to `BallMap[2..22, 0..21]`.
- **Game Mechanics**:
  1. **5+ Parallel Edge Match**: 5 or more of the same color in a line parallel to edge directions (axes 4, 0, 3).
  2. **3+ Perpendicular Match**: 3 or more of the same color in a line perpendicular to edges (axes 11, 9, 10), even across empty cells.
  3. **Hex Gravity Slide (`CheckGaps`)**: Unsupported balls drop down-left or down-right until resting in honeycomb valleys.
  4. **The Essential 'F' Key Color Cycling**: Pressing **'F'** (or touch button) rotates colors across active falling shapes (`rotColors` procedure).
  5. **16-Bit Web Audio Synthesizer**: Recreates sound pitch frequencies from Pascal `Freq[2..20]` array for match pops, drop thuds, color clicks, and level-up fanfares.

---

## 📂 Project Files Included in Workspace

- `index.html` - Canvas UI layout, glassmorphic panels, touchscreen overlay, high scores leaderboard modal.
- `css/main.css` - Modern retro-neon styling system.
- `js/oddunit.js` - JS Port of `ODDUNIT.PAS` (exact grid math, matrices, match algorithms, gravity).
- `js/render.js` - Canvas renderer for 3D glossy Oddball spheres and particle pop explosions.
- `js/audio.js` - Web Audio API synthesizer.
- `js/app.js` - Game loop controller, keyboard listeners, touch events, and local storage high scores.
- `ODDBALLZ.PAS` & `ODDUNIT.PAS` - Original Borland Pascal source files.
- `BALL0256.BMP` .. `BALL6256.BMP` - Original 1992 bitmap assets.
