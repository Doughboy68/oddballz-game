# Oddballz (1992) - Hexagonal Gravity Arcade Game

A complete web recreation of **Oddballz**, the original 1992 Tetris-inspired hexagonal gravity puzzle game by **Fred Kohler** and **Brian Semotiuk**. Reverse-engineered line-by-line from the original Borland Pascal 7.0 / Turbo Pascal for Windows source code (`ODDBALLZ.PAS` and `ODDUNIT.PAS`).

---

## 🎮 Game Features

- **Flat-Topped Hexagonal Grid**: Mapped to axial coordinates with flat top and bottom borders.
- **Hex Gravity Sliding**: Unsupported balls roll down hex slopes diagonally to fill the lowest available honeycomb slots.
- **The 'F' Key Color Cycling**: Pressing **'F'** (or touch button) cycles the colors of active falling balls in real time.
- **Authentic 1992 Match Rules**:
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
Simply double click or open [`index.html`](file:///D:/antigravity/oddballz-game/index.html) in any modern web browser!

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

## 📂 Source Code Structure

- `index.html` - Game UI layout, sidebar stats, glassmorphic panels, and modals.
- `css/main.css` - Responsive retro-modern glassmorphic design system.
- `js/oddunit.js` - Complete JS port of `ODDUNIT.PAS` (grid math, hex gravity, match algorithms, rotation matrices).
- `js/render.js` - High-DPI HTML5 canvas renderer for glossy 3D Oddball spheres and particle explosion FX.
- `js/audio.js` - Web Audio API synthesizer for 16-bit sound effects.
- `js/app.js` - Application loop, keyboard/touch event handlers, and high scores state.
- `ODDBALLZ.PAS` & `ODDUNIT.PAS` - Original 1992 Borland Pascal source files.
- `BALL0256.BMP` .. `BALL6256.BMP` - Original 1992 bitmap assets.
