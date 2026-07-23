/**
 * Render.js - HTML5 Canvas Renderer for Oddballz
 * Handles High-DPI scaling, 3D glossy Oddballz rendering, particle FX, and board drawing.
 */

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Default dimensions based on 320x242 original resolution
    this.baseWidth = 320;
    this.baseHeight = 240;

    // Palette colors matching OBClr array in ODDUNIT.PAS
    this.colors = [
      { main: '#475569', glow: '#94a3b8', highlight: '#cbd5e1' }, // 0: Gray / Empty
      { main: '#ef4444', glow: '#f87171', highlight: '#fca5a5' }, // 1: Red
      { main: '#22c55e', glow: '#4ade80', highlight: '#86efac' }, // 2: Green
      { main: '#3b82f6', glow: '#60a5fa', highlight: '#93c5fd' }, // 3: Blue
      { main: '#eab308', glow: '#facc15', highlight: '#fde047' }, // 4: Yellow
      { main: '#06b6d4', glow: '#22d3ee', highlight: '#67e8f9' }, // 5: Cyan
      { main: '#a855f7', glow: '#c084fc', highlight: '#e9d5ff' }, // 6: Magenta / Purple
      { main: '#f97316', glow: '#fb923c', highlight: '#fdba74' }  // 7: Orange / Gold
    ];

    this.particles = [];
    this.bitmaps = {};
    this.useBitmaps = false;

    this.resizeCanvas();
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.baseWidth * dpr;
    this.canvas.height = this.baseHeight * dpr;
    this.canvas.style.width = `${this.baseWidth * 2}px`;
    this.canvas.style.height = `${this.baseHeight * 2}px`;
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = false;
  }

  loadBitmaps(callback) {
    let loaded = 0;
    const files = ['BALL0256.BMP', 'BALL1256.BMP', 'BALL2256.BMP', 'BALL3256.BMP', 'BALL4256.BMP', 'BALL5256.BMP', 'BALL6256.BMP', 'PLAY256.BMP'];
    
    const checkDone = () => {
      loaded++;
      if (loaded === files.length && callback) {
        callback();
      }
    };

    files.forEach(file => {
      const img = new Image();
      img.onload = () => {
        this.bitmaps[file] = img;
        this.useBitmaps = true;
        checkDone();
      };
      img.onerror = () => {
        // Fallback to procedural shiny balls if Bitmaps fail to load
        checkDone();
      };
      img.src = file;
    });
  }

  clear() {
    this.ctx.fillStyle = '#0a0b10';
    this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
  }

  drawPlayfieldBackground() {
    if (this.useBitmaps && this.bitmaps['PLAY256.BMP']) {
      this.ctx.drawImage(this.bitmaps['PLAY256.BMP'], 0, 0, this.baseWidth, this.baseHeight);
      return;
    }

    // Procedural Neo-Retro Hex Playfield
    this.ctx.fillStyle = '#07090e';
    this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

    // Grid Outer Hexagon Frame
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    this.ctx.lineWidth = 1.5;

    // Draw honeycomb grid slot background highlights
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    for (let x = 4; x <= 20; x++) {
      for (let y = 0; y <= 19; y++) {
        if ((y < 12 && x < y + 10) || (y > 11 && x > y - 8)) {
          const px = this.getPixelX(x, y);
          const py = (y - 3) * 13;
          if (y >= 3) {
            this.ctx.beginPath();
            this.ctx.arc(px + 8, py + 8, 7, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
          }
        }
      }
    }
  }

  getPixelX(x, y) {
    const xSize = 8;
    if (y < 12) {
      return ((9 - y) * xSize) + ((x - 3) * xSize * 2) + xSize;
    } else {
      return ((y - 11) * xSize) + ((x - (y - 7)) * xSize * 2) + xSize;
    }
  }

  drawBall(xPx, yPx, colorIndex, scale = 1.0) {
    if (colorIndex <= 0) return;

    if (this.useBitmaps && this.bitmaps[`BALL${colorIndex}256.BMP`]) {
      this.ctx.drawImage(this.bitmaps[`BALL${colorIndex}256.BMP`], xPx, yPx, 16 * scale, 16 * scale);
      return;
    }

    // Modern Glossy 3D Oddball Sphere
    const col = this.colors[colorIndex] || this.colors[1];
    const cx = xPx + 8;
    const cy = yPx + 8;
    const r = 7.5 * scale;

    this.ctx.save();

    // Outer Glow
    this.ctx.shadowColor = col.glow;
    this.ctx.shadowBlur = 8;

    // Main Sphere Radial Gradient
    const grad = this.ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    grad.addColorStop(0, col.highlight);
    grad.addColorStop(0.5, col.main);
    grad.addColorStop(1, '#050508');

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = grad;
    this.ctx.fill();

    // Specular Glint
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    this.ctx.beginPath();
    this.ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.25, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle Outer Ring
    this.ctx.strokeStyle = col.glow;
    this.ctx.lineWidth = 0.75;
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawEngineState(engine) {
    this.drawPlayfieldBackground();

    // Render Settled Balls on Grid
    for (let x = 4; x <= 20; x++) {
      for (let y = 3; y <= 19; y++) {
        const color = engine.ballMap[x][y].bzMap;
        if (color > 0) {
          const px = engine.ballMap[x][y].x;
          const py = engine.ballMap[x][y].y;
          this.drawBall(px, py, color);
        }
      }
    }

    // Render Active Falling Piece
    if (!engine.endGame && !engine.pauseFlag) {
      for (let i = 0; i <= 3; i++) {
        const mapPt = engine.oddballz.map[i];
        if (engine.checkInMap(mapPt) && mapPt.y >= 3) {
          const px = this.getPixelX(mapPt.x, mapPt.y);
          const py = (mapPt.y - 3) * 13;
          const color = engine.oddballz.image[i];
          this.drawBall(px, py, color);
        }
      }
    }

    // Render Particles
    this.updateAndDrawParticles();
  }

  addPopExplosion(matchList, engine) {
    for (const m of matchList) {
      const color = engine.ballMap[m.x][m.y].bzMap || 1;
      const col = this.colors[color] || this.colors[1];
      const px = this.getPixelX(m.x, m.y) + 8;
      const py = (m.y - 3) * 13 + 8;

      for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        this.particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random() * 2,
          color: col.glow,
          life: 1.0,
          decay: 0.04 + Math.random() * 0.04
        });
      }
    }
  }

  updateAndDrawParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
