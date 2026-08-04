# Oddballz (1994) - Hexagonal Gravity Arcade Game

A complete web recreation of **Oddballz**, the Tetris-inspired hexagonal gravity puzzle game by **Fred Kohler** and **Brian Semotiuk** — recreating the **Windows Version 1.0 (Copyright 1994)** release. Reverse-engineered line-by-line from the original Borland Pascal 7.0 / Turbo Pascal for Windows source code (`ODDBALLZ.PAS` and `ODDUNIT.PAS`, written 1991–1993).

---

## 🎮 Game Features

- **Flat-Topped Hexagonal Grid**: Mapped to axial coordinates with flat top and bottom borders.
- **Hex Gravity Sliding**: Unsupported balls roll down hex slopes diagonally to fill the lowest available honeycomb slots.
- **The 'F' Key Color Cycling**: Pressing **'F'** (or touch button) cycles the colors of active falling balls in real time.
- **Authentic Match Rules**:
  - $\ge 5$ matching balls in a line parallel to edge directions.
  - $\ge 3$ matching balls in a line perpendicular to edges (even across empty gaps).
- **Web Audio 16-Bit Synthesizer**: Recreates exact audio pitch frequencies (`Freq[2..20]`) for match pops, drop thuds, color clicks, and level-up fanfares.
- **Dual Game Modes**:
  - **Color Matching Mode** (`Matcher = true`, Default)
  - **Row Building Mode** (`Matcher = false`)
- **Level & Shape Progression**:
  - 7 distinct shape types unlock progressively from Level 1 (2 shapes) to Level 10+ (all 7 shapes unlocked).

---

## 🛠️ Project Setup

### Option 1: Direct Browser Play (Zero Dependencies)
Simply double click or open `index.html` in any modern web browser!

### Option 2: Vite Dev Server
```bash
npm install
npm run dev
```

---

## 🕹️ Controls

| Action | Keyboard Key | Touch Control |
| :--- | :--- | :--- |
| **Cycle Colors** | **`F`** / `Insert` / `Numpad 0` | ⚡ **'F' Cycle Colors** |
| **Move Left / Right** | `◀` / `▶` or `D` / `G` | ◀ Left / Right ▶ |
| **Rotate Piece** | `▲` / `▼` or `R` / `V` | ↺ Rot L / ↻ Rot R |
| **Flip Shape** | `X` / `Y` or `Home` / `End` | — |
| **Hard Drop** | `Spacebar` | ⬇ Hard Drop |
| **Pause Game** | `P` | Pause Button |

---

## 📂 Project Structure

Everything needed to run the game lives in the root; media and original vintage material live under `assets/`.

```
index.html            Game UI layout, sidebar stats, glassmorphic panels, and modals.
main.css              Responsive retro-modern glassmorphic design system.
oddballz-game.js      Standalone game bundle: hex grid math, gravity, match rules,
                      canvas renderer, and Web Audio synthesizer (ball bitmaps embedded).
package.json          Vite dev/build scripts (optional — the game also runs from file://).
vite.config.js        Vite dev server config.
assets/
  oddballz-logo.png   Title logo shown on the modern start overlay (cropped from INTRO256.BMP).
  PLAY256.BMP         In-game playfield background (loaded at runtime).
  ODDINTRO.mp3        Intro music track.
  ODDPLAY.mp3         In-game music track.
  ODDEND.mp3          Game-over music track.
  site.webmanifest    Web-app manifest (installable app metadata + icons).
  icons/              App icons (iPhone Add-to-Home-Screen / favicon / manifest).
                      icon-120/152/167/180/192/512 are a real in-game playfield frame;
                      favicon-16/32 are a single original ball for legibility at tiny sizes.
    alt-orb/          Alternate icon set: a "ball of balls" built from the original sprites.
  original-source/    Original source & assets (reference only, not loaded at runtime):
    ODDBALLZ.PAS      Main program (Borland Pascal 7.0 / Turbo Pascal for Windows).
    ODDUNIT.PAS       Game-logic unit.
    BALL*.BMP         Original ball bitmaps (embedded as base64 inside oddballz-game.js).
    INTRO256.BMP      Original Windows-version intro screen (replaced by the modern HTML overlay).
    ODD*.MID          Original MIDI music tracks.
```
