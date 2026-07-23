/**
 * App.js - Main Controller & Game Loop for Oddballz
 * Bridges HTML5 UI, Canvas Renderer, Web Audio Synthesizer, and OddUnit Engine.
 */

import { OddUnitEngine } from './oddunit.js';
import { Renderer } from './render.js';
import { SoundEngine } from './audio.js';

class OddballzApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.engine = new OddUnitEngine();
    this.renderer = new Renderer(this.canvas);
    this.audio = new SoundEngine();

    this.isPlaying = false;
    this.isPaused = false;
    this.moveTime = 0;
    this.lastTime = 0;
    this.accumulatedTime = 0;

    // High Scores array from localStorage
    this.highScores = JSON.parse(localStorage.getItem('oddballz_hiscores') || '[]');

    this.initAudioHooks();
    this.initEventListeners();
    this.initTouchControls();
    this.renderer.loadBitmaps(() => {
      this.renderer.drawEngineState(this.engine);
    });

    this.updateUI();
  }

  initAudioHooks() {
    this.engine.onPlaySound = (type, param) => {
      this.audio.playSound(type, param);
    };

    this.engine.onPopBalls = (matchList) => {
      this.renderer.addPopExplosion(matchList, this.engine);
    };
  }

  initEventListeners() {
    // Keyboard Controls matching original 1992 Help file & ODDUNIT.PAS DoKey procedure
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      const key = e.key.toUpperCase();

      // Global Shortcuts (work anytime)
      if (code === 'Enter') {
        this.startGame();
        e.preventDefault();
        return;
      }

      if (code === 'KeyR' && !this.isPlaying) {
        // Start Rows Mode game
        this.switchMode(false);
        this.startGame();
        e.preventDefault();
        return;
      }

      if (code === 'KeyC' && !this.isPlaying) {
        // Start Color Match game
        this.switchMode(true);
        this.startGame();
        e.preventDefault();
        return;
      }

      if (code === 'KeyM') {
        const toggle = document.getElementById('toggleSound');
        toggle.checked = !toggle.checked;
        this.audio.enabled = toggle.checked;
        e.preventDefault();
        return;
      }

      if (!this.isPlaying) return;

      if (code === 'KeyP') {
        this.togglePause();
        e.preventDefault();
        return;
      }

      if (this.isPaused) return;

      switch (code) {
        case 'KeyF':
        case 'Insert':
        case 'Numpad0':
          this.engine.rotColors();
          e.preventDefault();
          break;

        case 'ArrowLeft':
        case 'KeyD':
          this.engine.moveOBall(1);
          e.preventDefault();
          break;

        case 'ArrowRight':
        case 'KeyG':
          this.engine.moveOBall(4);
          e.preventDefault();
          break;

        case 'ArrowUp':
          this.engine.transform(this.engine.rotCCW);
          e.preventDefault();
          break;

        case 'ArrowDown':
        case 'KeyV':
          this.engine.transform(this.engine.rotCW);
          e.preventDefault();
          break;

        case 'KeyX':
        case 'Home':
          this.engine.transform(this.engine.flipX);
          e.preventDefault();
          break;

        case 'KeyY':
        case 'End':
          this.engine.transform(this.engine.flipY);
          e.preventDefault();
          break;

        case 'Space':
          this.engine.zip();
          e.preventDefault();
          break;
      }

      this.renderer.drawEngineState(this.engine);
    });

    // Start Game Button
    document.getElementById('btnStart').addEventListener('click', () => {
      this.startGame();
    });

    document.getElementById('btnOverlayStart').addEventListener('click', () => {
      this.startGame();
    });

    // Pause Button
    document.getElementById('btnPause').addEventListener('click', () => {
      this.togglePause();
    });

    // High Scores Buttons
    ['btnHighScores', 'btnOverlayHighScores', 'btnGameOverHighScores'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showHighScoresModal();
        });
      }
    });

    const btnClose = document.getElementById('btnCloseModal');
    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeHighScoresModal();
      });
    }

    // Audio Toggles
    document.getElementById('toggleSound').addEventListener('change', (e) => {
      this.audio.enabled = e.target.checked;
    });

    // Game Mode Tabs (Color Matching vs Row Building)
    const tabColor = document.getElementById('tabColorMatch');
    const tabRow = document.getElementById('tabRowBuild');

    tabColor.addEventListener('click', () => this.switchMode(true));
    tabRow.addEventListener('click', () => this.switchMode(false));
  }

  switchMode(isColorMatch) {
    const tabColor = document.getElementById('tabColorMatch');
    const tabRow = document.getElementById('tabRowBuild');
    this.engine.matcher = isColorMatch;

    if (isColorMatch) {
      tabColor.classList.add('active');
      tabRow.classList.remove('active');
    } else {
      tabRow.classList.add('active');
      tabColor.classList.remove('active');
    }
    if (!this.isPlaying) this.engine.initGame();
  }

  updateUI() {
    document.getElementById('statScore').textContent = this.engine.score;
    const lvlEl = document.getElementById('statLevel');
    lvlEl.textContent = this.engine.level;
    if (this.engine.levCol > 0) {
      lvlEl.style.color = '#f43f5e'; // Flashing neon pink/purple on level up
    } else {
      lvlEl.style.color = '';
    }
    document.getElementById('statSkill').textContent = this.engine.skill;
    document.getElementById('statBalls').textContent = this.engine.ballCount;
  }

  initTouchControls() {
    const bindTouch = (id, action) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      let lastTriggerTime = 0;
      const trigger = (e) => {
        const now = Date.now();
        if (now - lastTriggerTime < 200) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        lastTriggerTime = now;
        if (e.cancelable) e.preventDefault();
        if (this.isPlaying && !this.isPaused) {
          action();
          this.renderer.drawEngineState(this.engine);
        }
      };

      btn.addEventListener('pointerdown', trigger, { passive: false });
      btn.addEventListener('touchstart', trigger, { passive: false });
      btn.addEventListener('click', trigger);
    };

    bindTouch('btnTouchLeft', () => this.engine.moveOBall(1));
    bindTouch('btnTouchRight', () => this.engine.moveOBall(4));
    bindTouch('btnTouchRotCW', () => this.engine.transform(this.engine.rotCW));
    bindTouch('btnTouchRotCCW', () => this.engine.transform(this.engine.rotCCW));
    bindTouch('btnTouchFlip', () => {
      if (!this.engine.transform(this.engine.flipX)) {
        this.engine.transform(this.engine.flipY);
      }
    });
    bindTouch('btnTouchF', () => this.engine.rotColors());
    bindTouch('btnTouchSpace', () => this.engine.zip());
  }

  startGame() {
    this.audio.init();
    this.engine.initGame();
    this.engine.build();

    this.isPlaying = true;
    this.isPaused = false;
    this.moveTime = 0;
    this.accumulatedTime = 0;
    this.lastTime = performance.now();

    document.getElementById('overlayStart').classList.add('hidden');
    document.getElementById('overlayGameOver').classList.add('hidden');
    document.getElementById('btnPause').disabled = false;

    // Draw initial state immediately
    this.renderer.drawEngineState(this.engine);
    this.updateUI();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  togglePause() {
    if (!this.isPlaying) return;
    this.isPaused = !this.isPaused;
    this.engine.pauseFlag = this.isPaused;

    if (this.isPaused) {
      document.getElementById('overlayPause').classList.remove('hidden');
    } else {
      document.getElementById('overlayPause').classList.add('hidden');
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  gameLoop(currentTime) {
    if (!this.isPlaying || this.isPaused) return;

    const dt = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulatedTime += dt;

    // Authentic Pascal Timer Tick: PauseTime (100ms at Level 1, 20ms at Level 50)
    const tickDelay = Math.max(16, this.engine.pauseTime);

    if (this.accumulatedTime >= tickDelay) {
      this.accumulatedTime = 0;
      this.moveTime++;

      if (this.moveTime >= 8) {
        this.moveTime = 0;

        if (!this.engine.moveOBall(this.engine.direction)) {
          this.engine.stamp();

          if (this.engine.matcher) {
            this.engine.checkMatches();
          }

          this.engine.checkAdvance();

          if (this.engine.checkGameOver()) {
            this.handleGameOver();
            return;
          } else {
            this.engine.build();
          }
        }
      }
    }

    this.renderer.drawEngineState(this.engine);
    this.updateUI();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  handleGameOver() {
    this.isPlaying = false;
    this.updateHighScores(this.engine.score, this.engine.level, this.engine.skill);
    document.getElementById('finalScore').textContent = this.engine.score;
    document.getElementById('overlayGameOver').classList.remove('hidden');
    document.getElementById('btnPause').disabled = true;
  }

  updateUI() {
    document.getElementById('statScore').textContent = this.engine.score;
    document.getElementById('statLevel').textContent = this.engine.level;
    document.getElementById('statSkill').textContent = this.engine.skill;
    document.getElementById('statBalls').textContent = this.engine.ballCount;
  }

  updateHighScores(score, level, skill) {
    if (score <= 0) return;
    this.highScores.push({
      date: new Date().toLocaleDateString(),
      score: score,
      level: level,
      skill: skill,
      mode: this.engine.matcher ? 'Color Match' : 'Row Build'
    });

    this.highScores.sort((a, b) => b.score - a.score);
    this.highScores = this.highScores.slice(0, 10);
    localStorage.setItem('oddballz_hiscores', JSON.stringify(this.highScores));
  }

  showHighScoresModal() {
    const tbody = document.getElementById('recordsTableBody');
    if (tbody) {
      tbody.innerHTML = '';

      if (this.highScores.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1rem 0;">No records saved yet!</td></tr>';
      } else {
        this.highScores.forEach((hs, idx) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="rank-col">#${idx + 1}</td>
            <td style="font-weight:bold; color:var(--accent-cyan);">${hs.score}</td>
            <td>Lvl ${hs.level}</td>
            <td style="font-size:0.8rem; color:var(--text-muted);">${hs.mode}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    const modal = document.getElementById('gameDialogView');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
    }
  }

  closeHighScoresModal() {
    const modal = document.getElementById('gameDialogView');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.oddApp = new OddballzApp();
});
