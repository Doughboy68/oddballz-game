/**
 * OddUnit.js - Direct JavaScript Port of ODDUNIT.PAS (1992)
 * (c) 1991/1992 Fred Kohler & Brian Semotiuk
 * Ported to ES6 for Oddballz Web Engine
 */

export class OddUnitEngine {
  constructor() {
    // 50 Levels Attributes from ODDUNIT.PAS LevAttr
    this.levAttr = [
      { lDelay: 100, lShapes: 2, lColors: 3 },
      { lDelay: 100, lShapes: 2, lColors: 4 },
      { lDelay: 100, lShapes: 3, lColors: 4 },
      { lDelay: 100, lShapes: 3, lColors: 5 },
      { lDelay: 100, lShapes: 4, lColors: 5 },
      { lDelay: 100, lShapes: 4, lColors: 6 },
      { lDelay: 100, lShapes: 5, lColors: 6 },
      { lDelay: 100, lShapes: 5, lColors: 6 },
      { lDelay: 100, lShapes: 6, lColors: 6 },
      { lDelay: 100, lShapes: 7, lColors: 6 },
      { lDelay: 100, lShapes: 7, lColors: 6 },
      { lDelay: 98,  lShapes: 7, lColors: 6 },
      { lDelay: 95,  lShapes: 7, lColors: 6 },
      { lDelay: 93,  lShapes: 7, lColors: 6 },
      { lDelay: 90,  lShapes: 7, lColors: 6 },
      { lDelay: 88,  lShapes: 7, lColors: 6 },
      { lDelay: 85,  lShapes: 7, lColors: 6 },
      { lDelay: 83,  lShapes: 7, lColors: 6 },
      { lDelay: 80,  lShapes: 7, lColors: 6 },
      { lDelay: 78,  lShapes: 7, lColors: 6 },
      { lDelay: 76,  lShapes: 7, lColors: 6 },
      { lDelay: 74,  lShapes: 7, lColors: 6 },
      { lDelay: 72,  lShapes: 7, lColors: 6 },
      { lDelay: 70,  lShapes: 7, lColors: 6 },
      { lDelay: 68,  lShapes: 7, lColors: 6 },
      { lDelay: 66,  lShapes: 7, lColors: 6 },
      { lDelay: 64,  lShapes: 7, lColors: 6 },
      { lDelay: 62,  lShapes: 7, lColors: 6 },
      { lDelay: 60,  lShapes: 7, lColors: 6 },
      { lDelay: 59,  lShapes: 7, lColors: 6 },
      { lDelay: 58,  lShapes: 7, lColors: 6 },
      { lDelay: 57,  lShapes: 7, lColors: 6 },
      { lDelay: 56,  lShapes: 7, lColors: 6 },
      { lDelay: 55,  lShapes: 7, lColors: 6 },
      { lDelay: 54,  lShapes: 7, lColors: 6 },
      { lDelay: 53,  lShapes: 7, lColors: 6 },
      { lDelay: 52,  lShapes: 7, lColors: 6 },
      { lDelay: 51,  lShapes: 7, lColors: 6 },
      { lDelay: 50,  lShapes: 7, lColors: 6 },
      { lDelay: 49,  lShapes: 7, lColors: 6 },
      { lDelay: 48,  lShapes: 7, lColors: 6 },
      { lDelay: 47,  lShapes: 7, lColors: 6 },
      { lDelay: 46,  lShapes: 7, lColors: 6 },
      { lDelay: 45,  lShapes: 7, lColors: 6 },
      { lDelay: 42,  lShapes: 7, lColors: 6 },
      { lDelay: 40,  lShapes: 7, lColors: 6 },
      { lDelay: 35,  lShapes: 7, lColors: 6 },
      { lDelay: 30,  lShapes: 7, lColors: 6 },
      { lDelay: 25,  lShapes: 7, lColors: 6 },
      { lDelay: 20,  lShapes: 7, lColors: 6 }
    ];

    // Freq array from Pascal source for 16-bit sound synth
    this.freq = [25, 27, 28, 30, 32, 33, 35, 37, 39, 40, 42, 44, 45, 47, 49, 51, 52, 54, 56];

    // Grid row specifications
    this.midRow = [
      { x: 12, y: 19 }, { x: 11, y: 18 }, { x: 10, y: 17 }, { x: 9, y: 16 },
      { x: 8, y: 15 }, { x: 7, y: 14 }, { x: 6, y: 13 }, { x: 5, y: 12 },
      { x: 4, y: 11 }, { x: 4, y: 10 }, { x: 4, y: 9 }, { x: 4, y: 8 },
      { x: 4, y: 7 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }
    ];

    this.rtRow = [
      { x: 20, y: 19 }, { x: 19, y: 19 }, { x: 18, y: 19 }, { x: 17, y: 19 },
      { x: 16, y: 19 }, { x: 15, y: 19 }, { x: 14, y: 19 }, { x: 13, y: 19 },
      { x: 12, y: 19 }
    ];

    this.ltRow = [
      { x: 12, y: 19 }, { x: 13, y: 19 }, { x: 14, y: 19 }, { x: 15, y: 19 },
      { x: 16, y: 19 }, { x: 17, y: 19 }, { x: 18, y: 19 }, { x: 19, y: 19 },
      { x: 20, y: 19 }
    ];

    // Shapes definitions
    this.ballShapes = [
      [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }],
      [{ x: -1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }],
      [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }],
      [{ x: -1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 0 }],
      [{ x: -1, y: -1 }, { x: -2, y: -1 }, { x: 1, y: 0 }],
      [{ x: -1, y: 0 }, { x: -2, y: -1 }, { x: -2, y: -2 }],
      [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 1 }]
    ];

    // Transformation Matrices (RotCW, RotCCW, FlipX, FlipY)
    this.rotCCW = [
      [{ x: -2, y: 0 }, { x: -2, y: -1 }, { x: -2, y: -2 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
      [{ x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: -1, y: -2 }, { x: 0, y: 0 }],
      [{ x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }],
      [{ x: 0, y: 0 }, { x: 1, y: 2 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }],
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 0 }]
    ];

    this.rotCW = [
      [{ x: 0, y: -2 }, { x: 1, y: -1 }, { x: 2, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
      [{ x: -1, y: -2 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 0, y: 0 }],
      [{ x: -2, y: -2 }, { x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
      [{ x: 0, y: 0 }, { x: -2, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 2 }],
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: -2, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 2 }]
    ];

    this.flipY = [
      [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
      [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 0 }],
      [{ x: -2, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
      [{ x: 0, y: 0 }, { x: -2, y: -1 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: -2, y: -2 }, { x: -1, y: -2 }, { x: 0, y: -2 }]
    ];

    this.flipX = [
      [{ x: 0, y: -2 }, { x: -1, y: -2 }, { x: -2, y: -2 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
      [{ x: 1, y: -1 }, { x: 0, y: -1 }, { x: -1, y: -1 }, { x: -2, y: -1 }, { x: 0, y: 0 }],
      [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }],
      [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
      [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 0, y: 2 }]
    ];

    this.startPos = [
      { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 }
    ];

    // State Variables
    this.matcher = true; // Color matching game default!
    this.level = 1;
    this.score = 0;
    this.skill = 1;
    this.ballCount = 0;
    this.rows = 0;
    this.rowCount = 0;
    this.matchesDone = 0;
    this.levCol = 0;
    this.newLevel = 0;
    this.shapes = 2;
    this.colors = 3;
    this.pauseTime = 100;
    this.direction = 2; // Default drop direction (2: down-left, 5: down-right)
    this.enough = false;
    this.endGame = false;
    this.pauseFlag = false;

    this.colorInc = [0, 0, 0, 0, 0];
    this.colorCount = [0, 0, 0, 0];
    this.matchCount = 0;
    this.sameBonus = 0;

    // BallMap array: [2..22][0..21]
    this.ballMap = [];
    this.oddballz = {
      image: [0, 0, 0, 0],
      map: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
      rel: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
    };

    // Callback event handlers for audio and FX
    this.onPlaySound = null;
    this.onPopBalls = null;

    this.initEngine();
  }

  initEngine() {
    this.ballMap = [];
    for (let x = 0; x <= 24; x++) {
      this.ballMap[x] = [];
      for (let y = 0; y <= 23; y++) {
        this.ballMap[x][y] = { inMap: false, bzMap: 0, x: 0, y: 0 };
      }
    }

    // Populate InMap and pixel coordinates
    for (let x = 4; x <= 20; x++) {
      for (let y = 0; y <= 19; y++) {
        if ((y < 12 && x < y + 10) || (y > 11 && x > y - 8)) {
          this.ballMap[x][y].inMap = true;
          const mpts = { x: x, y: y };
          this.initMapCoord(mpts);
          this.ballMap[x][y].x = mpts.x;
          this.ballMap[x][y].y = mpts.y;
        }
      }
    }

    this.initGame();
  }

  initMapCoord(mpts) {
    const xSize = 8;
    const ySize = 13;
    if (mpts.y < 12) {
      mpts.x = ((9 - mpts.y) * xSize) + ((mpts.x - 3) * xSize * 2) + xSize;
    } else {
      mpts.x = ((mpts.y - 11) * xSize) + ((mpts.x - (mpts.y - 7)) * xSize * 2) + xSize;
    }
    mpts.y = (mpts.y - 3) * ySize;
  }

  initGame() {
    this.eraseBallMap();
    this.level = 1;
    this.score = 0;
    this.skill = 1;
    this.ballCount = 0;
    this.rows = 0;
    this.rowCount = 0;
    this.matchesDone = 0;
    this.matchCount = 0;
    this.sameBonus = 0;
    this.enough = false;
    this.endGame = false;

    const attr = this.levAttr[this.level - 1];
    this.shapes = attr.lShapes;
    this.pauseTime = attr.lDelay;
    this.colors = attr.lColors;

    this.initColorInc();
  }

  initColorInc() {
    this.colorInc[0] = 1;
    for (let i = 0; i <= 3; i++) {
      let temp = 1;
      for (let j = 0; j <= i; j++) {
        temp *= this.colors;
      }
      temp += 1;
      this.colorInc[i + 1] = temp;
      this.colorCount[i] = 0;
    }
  }

  eraseBallMap() {
    for (let x = 4; x <= 20; x++) {
      for (let y = 0; y <= 19; y++) {
        this.ballMap[x][y].bzMap = 0;
      }
    }
  }

  checkInMap(pts) {
    if (pts.x < 0 || pts.x > 24 || pts.y < 0 || pts.y > 23) return false;
    return this.ballMap[pts.x][pts.y].inMap;
  }

  move(pts, direction) {
    switch (direction) {
      case 0: pts.x -= 1; pts.y -= 1; break;
      case 1: pts.x -= 1; break;
      case 2: pts.y += 1; break;
      case 3: pts.y -= 1; break;
      case 4: pts.x += 1; break;
      case 5: pts.x += 1; pts.y += 1; break;
      case 6: pts.x -= 2; pts.y -= 1; break;
      case 7: pts.x -= 1; pts.y += 1; break;
      case 8: pts.x += 1; pts.y += 2; break;
      case 9: pts.x -= 1; pts.y -= 2; break;
      case 10: pts.x += 1; pts.y -= 1; break;
      case 11: pts.x += 2; pts.y += 1; break;
    }
  }

  // Active falling piece building
  build() {
    this.direction = Math.random() < 0.5 ? 5 : 2;
    const config = Math.floor(Math.random() * this.shapes);
    const pos = Math.floor(Math.random() * 4);

    if (this.matcher) {
      for (let i = 0; i <= 3; i++) {
        if (i === 0) {
          this.oddballz.image[i] = (this.colorCount[i] % this.colors) + 1;
        } else {
          this.oddballz.image[i] = (Math.floor(this.colorCount[i] / (this.colorInc[i] - 1)) % this.colors) + 1;
        }
        this.colorCount[i] += this.colorInc[i];
      }
    } else {
      // Rows Game: All balls in falling shape share the exact SAME color (GetRColors)
      const sameColor = config < 6 ? config + 1 : Math.floor(Math.random() * 6) + 1;
      for (let i = 0; i <= 3; i++) {
        this.oddballz.image[i] = sameColor;
      }
    }

    this.oddballz.map[0].x = this.startPos[pos].x;
    this.oddballz.map[0].y = this.startPos[pos].y;
    this.oddballz.rel[0].x = 0;
    this.oddballz.rel[0].y = 0;

    for (let i = 1; i <= 3; i++) {
      this.oddballz.rel[i].x = this.ballShapes[config][i - 1].x;
      this.oddballz.rel[i].y = this.ballShapes[config][i - 1].y;
      this.oddballz.map[i].x = this.oddballz.map[0].x + this.ballShapes[config][i - 1].x;
      this.oddballz.map[i].y = this.oddballz.map[0].y + this.ballShapes[config][i - 1].y;
    }

    const rotCount = Math.floor(Math.random() * 6);
    for (let i = 0; i < rotCount; i++) this.transform(this.rotCW);
    if (Math.random() < 0.5) this.transform(this.flipX);
    if (Math.random() < 0.5) this.transform(this.flipY);

    this.ballCount++;
  }

  transform(tMatrix) {
    let transable = true;
    const saveMove = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];

    for (let i = 1; i <= 3; i++) {
      const rx = this.oddballz.rel[i].x + 2;
      const ry = this.oddballz.rel[i].y + 2;
      if (rx < 0 || rx > 4 || ry < 0 || ry > 4) {
        transable = false;
        break;
      }
      saveMove[i].x = tMatrix[ry][rx].x;
      saveMove[i].y = tMatrix[ry][rx].y;
      const pts = {
        x: this.oddballz.map[0].x + saveMove[i].x,
        y: this.oddballz.map[0].y + saveMove[i].y
      };

      if (!this.checkInMap(pts) || this.ballMap[pts.x][pts.y].bzMap !== 0) {
        transable = false;
        break;
      }
    }

    if (transable) {
      for (let i = 1; i <= 3; i++) {
        this.oddballz.rel[i].x = saveMove[i].x;
        this.oddballz.rel[i].y = saveMove[i].y;
        this.oddballz.map[i].x = this.oddballz.map[0].x + saveMove[i].x;
        this.oddballz.map[i].y = this.oddballz.map[0].y + saveMove[i].y;
      }
    }
    return transable;
  }

  // Movement & Rotations
  moveOBall(dir) {
    let moveable = true;
    const saveMove = [];

    for (let i = 0; i <= 3; i++) {
      const pts = { x: this.oddballz.map[i].x, y: this.oddballz.map[i].y };
      this.move(pts, dir);
      if (this.checkInMap(pts) && this.ballMap[pts.x][pts.y].bzMap === 0) {
        saveMove[i] = { x: pts.x, y: pts.y };
      } else {
        moveable = false;
        break;
      }
    }

    if (moveable) {
      for (let i = 0; i <= 3; i++) {
        this.oddballz.map[i].x = saveMove[i].x;
        this.oddballz.map[i].y = saveMove[i].y;
      }
    }
    return moveable;
  }

  // The Essential 'F' Key RotColors procedure!
  rotColors() {
    if (!this.matcher) return; // Only works in Color Matching mode
    const saveColor = this.oddballz.image[0];
    for (let i = 0; i <= 2; i++) {
      this.oddballz.image[i] = this.oddballz.image[i + 1];
    }
    this.oddballz.image[3] = saveColor;
    if (this.onPlaySound) this.onPlaySound('click');
  }

  // Hard Drop (Zip) - Gives 1 whole point!
  zip() {
    let zipBonus = false;
    if (this.moveOBall(this.direction)) {
      zipBonus = true;
    }
    while (this.moveOBall(this.direction)) {
      if (this.onPlaySound) this.onPlaySound('zip');
    }
    if (zipBonus) this.score += 1;
  }

  stamp() {
    for (let i = 0; i <= 3; i++) {
      const mx = this.oddballz.map[i].x;
      const my = this.oddballz.map[i].y;
      if (this.checkInMap({ x: mx, y: my })) {
        this.ballMap[mx][my].bzMap = this.oddballz.image[i];
      }
    }
  }

  supported(spts) {
    const p1 = { x: spts.x, y: spts.y };
    const p2 = { x: spts.x, y: spts.y };
    this.move(p1, 2); // Down-Left
    this.move(p2, 5); // Down-Right

    const empty1 = this.checkInMap(p1) && this.ballMap[p1.x][p1.y].bzMap === 0;
    const empty2 = this.checkInMap(p2) && this.ballMap[p2.x][p2.y].bzMap === 0;

    if (empty1 && empty2) return false;
    return true;
  }

  checkGaps() {
    let noneDropped = true;
    let flipGate = true;

    for (let y = 19; y >= 0; y--) {
      for (let x = 4; x <= 20; x++) {
        const startPts = { x: x, y: y };
        const saveColor = this.ballMap[x][y].bzMap;

        if (this.checkInMap(startPts) && saveColor !== 0) {
          if (!this.supported(startPts)) {
            noneDropped = false;
            let current = { x: x, y: y };

            while (!this.supported(current)) {
              this.ballMap[current.x][current.y].bzMap = 0;
              const dropDir = flipGate ? 2 : 5;
              flipGate = !flipGate;

              const target = { x: current.x, y: current.y };
              this.move(target, dropDir);

              if (this.checkInMap(target) && this.ballMap[target.x][target.y].bzMap === 0) {
                current = target;
              }
              this.ballMap[current.x][current.y].bzMap = saveColor;
              if (this.onPlaySound) this.onPlaySound('drop');
            }
          }
        }
      }
    }
    return noneDropped;
  }

  // 1992 Color Matching Engine: 5+ Parallel & 3+ Perpendicular
  matchColors() {
    const matchList = [];
    let index = 0;

    const rowLength = (startPts, dir, saveColor) => {
      let sameCount = 1;
      let curr = { x: startPts.x, y: startPts.y };
      while (true) {
        this.move(curr, dir);
        if (this.checkInMap(curr) && this.ballMap[curr.x][curr.y].bzMap === saveColor) {
          sameCount++;
        } else {
          break;
        }
      }
      return sameCount;
    };

    const add2List = (startPts, rdir, saveColor) => {
      this.matchesDone++;
      this.matchCount++;
      let curr = { x: startPts.x, y: startPts.y };
      while (this.checkInMap(curr) && this.ballMap[curr.x][curr.y].bzMap === saveColor) {
        matchList.push({ x: curr.x, y: curr.y });
        this.move(curr, rdir);
      }
    };

    for (let x = 4; x <= 20; x++) {
      for (let y = 0; y <= 19; y++) {
        const startPts = { x: x, y: y };
        const saveColor = this.ballMap[x][y].bzMap;

        if (this.checkInMap(startPts) && saveColor !== 0) {
          // Dir 4 (Parallel Edge, >= 5)
          let prev = { x: x, y: y };
          this.move(prev, 1);
          if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
            const len = rowLength(startPts, 4, saveColor);
            if (len >= 5) {
              add2List(startPts, 4, saveColor);
              this.sameBonus += len - 3;
            }
          }

          // Dir 0 (Parallel Edge, >= 5)
          prev = { x: x, y: y };
          this.move(prev, 5);
          if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
            const len = rowLength(startPts, 0, saveColor);
            if (len >= 5) {
              add2List(startPts, 0, saveColor);
              this.sameBonus += len - 3;
            }
          }

          // Dir 3 (Parallel Edge, >= 5)
          prev = { x: x, y: y };
          this.move(prev, 2);
          if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
            const len = rowLength(startPts, 3, saveColor);
            if (len >= 5) {
              add2List(startPts, 3, saveColor);
              this.sameBonus += len - 3;
            }
          }

          // Dir 11 (Perpendicular, >= 3)
          prev = { x: x, y: y };
          this.move(prev, 6);
          if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
            const len = rowLength(startPts, 11, saveColor);
            if (len >= 3) {
              add2List(startPts, 11, saveColor);
              this.sameBonus += len - 2;
            }
          }

          // Dir 9 (Perpendicular, >= 3)
          prev = { x: x, y: y };
          this.move(prev, 8);
          if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
            const len = rowLength(startPts, 9, saveColor);
            if (len >= 3) {
              add2List(startPts, 9, saveColor);
              this.sameBonus += len - 2;
            }
          }

          // Dir 10 (Perpendicular, >= 3)
          prev = { x: x, y: y };
          this.move(prev, 7);
          if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
            const len = rowLength(startPts, 10, saveColor);
            if (len >= 3) {
              add2List(startPts, 10, saveColor);
              this.sameBonus += len - 2;
            }
          }
        }
      }
    }

    // Delete matched balls
    if (matchList.length > 0) {
      if (this.onPopBalls) this.onPopBalls(matchList);
      for (const m of matchList) {
        this.ballMap[m.x][m.y].bzMap = 0;
      }
      if (this.onPlaySound) this.onPlaySound('pop');
    }

    return matchList.length;
  }

  // 1992 Rows Game Engine: Check & Clear Full Edge-to-Edge Rows
  rowFull(rPts, dir) {
    let curr = { x: rPts.x, y: rPts.y };
    do {
      if (this.ballMap[curr.x][curr.y].bzMap === 0) {
        return false;
      }
      this.move(curr, dir);
    } while (this.checkInMap(curr));
    return true;
  }

  deleteRow(rPts, rdir, cdir) {
    this.rowCount++;
    let curr = { x: rPts.x, y: rPts.y };

    const rowCells = [];
    let p = { x: rPts.x, y: rPts.y };
    while (this.checkInMap(p)) {
      rowCells.push({ x: p.x, y: p.y });
      this.move(p, rdir);
    }
    if (this.onPopBalls) this.onPopBalls(rowCells);
    if (this.onPlaySound) this.onPlaySound('pop');

    do {
      let colPts = { x: curr.x, y: curr.y };
      do {
        let x = colPts.x, y = colPts.y;
        this.move(colPts, cdir);
        if (this.checkInMap(colPts)) {
          this.ballMap[x][y].bzMap = this.ballMap[colPts.x][colPts.y].bzMap;
        } else {
          this.ballMap[x][y].bzMap = 0;
        }
      } while (this.checkInMap(colPts) && this.ballMap[colPts.x][colPts.y].bzMap !== 0);

      this.move(curr, rdir);
    } while (this.checkInMap(curr));
  }

  checkRows() {
    let noRows = true;
    let coldir = Math.random() < 0.5 ? 3 : 0;

    for (let r = 0; r <= 15; r++) {
      let rPts = { x: this.midRow[r].x, y: this.midRow[r].y };
      while (this.rowFull(rPts, 4)) {
        noRows = false;
        this.deleteRow(rPts, 4, coldir);
      }
    }

    for (let r = 0; r <= 8; r++) {
      let rPts = { x: this.ltRow[r].x, y: this.ltRow[r].y };
      while (this.rowFull(rPts, 0)) {
        noRows = false;
        this.deleteRow(rPts, 0, 3);
      }
    }

    for (let r = 0; r <= 8; r++) {
      let rPts = { x: this.rtRow[r].x, y: this.rtRow[r].y };
      while (this.rowFull(rPts, 3)) {
        noRows = false;
        this.deleteRow(rPts, 3, 0);
      }
    }

    return !noRows;
  }

  checkMatches() {
    let index = 0;
    let hasClearedRows = false;
    let noneDropped = false;

    do {
      if (this.matcher) {
        index = this.matchColors();
      } else {
        hasClearedRows = this.checkRows();
      }
      noneDropped = this.checkGaps();
    } while (index > 0 || hasClearedRows || !noneDropped);
  }

  checkAdvance() {
    if (this.levCol > 0) this.levCol--;

    if (this.rowCount > 0) {
      const cnt = Math.min(this.rowCount, 10);
      this.score += Math.pow(2, cnt);
      this.rows += this.rowCount;
      this.rowCount = 0;
    }

    if (this.matchCount > 0) {
      const cnt = Math.min(this.matchCount, 10);
      this.score += Math.pow(2, cnt);
      this.matchCount = 0;
      this.score += this.sameBonus;
      this.sameBonus = 0;
    }

    if (this.ballCount > 0) {
      this.skill = Math.floor((this.score * 10) / this.ballCount);
    }

    if ((this.matchesDone > 11 || this.rows > 5) && this.level < 50) {
      this.level++;
      this.matchesDone = 0;
      this.rows = 0;
      this.levCol = 5;
      if (this.onPlaySound) this.onPlaySound('levelup');

      const attr = this.levAttr[this.level - 1];
      this.shapes = attr.lShapes;
      this.pauseTime = attr.lDelay;
      this.colors = attr.lColors;
      this.initColorInc();
    }
  }

  checkGameOver() {
    for (let x = 4; x <= 12; x++) {
      for (let y = 0; y <= 3; y++) {
        if (this.checkInMap({ x: x, y: y }) && this.ballMap[x][y].bzMap !== 0) {
          this.endGame = true;
          this.enough = true;
          if (this.onPlaySound) this.onPlaySound('gameover');
          return true;
        }
      }
    }
    return false;
  }
}
