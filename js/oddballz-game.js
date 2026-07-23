/**
 * Oddballz (1992) - Complete Standalone Game Bundle
 * Recreates Fred Kohler & Brian Semotiuk's 1992 Hexagonal Gravity Arcade Game.
 * Pure Vanilla JavaScript (No CORS module restrictions - works on file:// and http://).
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. ODDUNIT ENGINE (Ported from ODDUNIT.PAS)
  // =========================================================================
  class OddUnitEngine {
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

      this.ballShapes = [
        [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }],
        [{ x: -1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }],
        [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }],
        [{ x: -1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 0 }],
        [{ x: -1, y: -1 }, { x: -2, y: -1 }, { x: 1, y: 0 }],
        [{ x: -1, y: 0 }, { x: -2, y: -1 }, { x: -2, y: -2 }],
        [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 1 }]
      ];

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

      this.matcher = true;
      this.level = 1;
      this.score = 0;
      this.skill = 1;
      this.ballCount = 0;
      this.rows = 0;
      this.rowCount = 0;
      this.matchesDone = 0;
      this.levCol = 0;
      this.shapes = 2;
      this.colors = 3;
      this.pauseTime = 100;
      this.direction = 2;
      this.enough = false;
      this.endGame = false;
      this.pauseFlag = false;

      this.colorInc = [0, 0, 0, 0, 0];
      this.colorCount = [0, 0, 0, 0];
      this.matchCount = 0;
      this.sameBonus = 0;

      this.ballMap = [];
      this.oddballz = {
        image: [0, 0, 0, 0],
        map: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
        rel: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]
      };

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

    rotColors() {
      if (!this.matcher) return;
      const saveColor = this.oddballz.image[0];
      for (let i = 0; i <= 2; i++) {
        this.oddballz.image[i] = this.oddballz.image[i + 1];
      }
      this.oddballz.image[3] = saveColor;
      if (this.onPlaySound) this.onPlaySound('click');
    }

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
      this.move(p1, 2);
      this.move(p2, 5);

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

    matchColors() {
      const matchList = [];

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
            let prev = { x: x, y: y };
            this.move(prev, 1);
            if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
              const len = rowLength(startPts, 4, saveColor);
              if (len >= 5) {
                add2List(startPts, 4, saveColor);
                this.sameBonus += len - 3;
              }
            }

            prev = { x: x, y: y };
            this.move(prev, 5);
            if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
              const len = rowLength(startPts, 0, saveColor);
              if (len >= 5) {
                add2List(startPts, 0, saveColor);
                this.sameBonus += len - 3;
              }
            }

            prev = { x: x, y: y };
            this.move(prev, 2);
            if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
              const len = rowLength(startPts, 3, saveColor);
              if (len >= 5) {
                add2List(startPts, 3, saveColor);
                this.sameBonus += len - 3;
              }
            }

            prev = { x: x, y: y };
            this.move(prev, 6);
            if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
              const len = rowLength(startPts, 11, saveColor);
              if (len >= 3) {
                add2List(startPts, 11, saveColor);
                this.sameBonus += len - 2;
              }
            }

            prev = { x: x, y: y };
            this.move(prev, 8);
            if (!this.checkInMap(prev) || this.ballMap[prev.x][prev.y].bzMap !== saveColor) {
              const len = rowLength(startPts, 9, saveColor);
              if (len >= 3) {
                add2List(startPts, 9, saveColor);
                this.sameBonus += len - 2;
              }
            }

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

      if (matchList.length > 0) {
        if (this.onPopBalls) this.onPopBalls(matchList);
        for (const m of matchList) {
          this.ballMap[m.x][m.y].bzMap = 0;
        }
        if (this.onPlaySound) this.onPlaySound('pop');
      }

      return matchList.length;
    }

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

  // =========================================================================
  // 2. CANVAS RENDERER ENGINE
  const EMBEDDED_TITLE_LOGO = 'data:image/png;base64,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';
  // =========================================================================
  const EMBEDDED_BALL_BMPS = {
    'BALL0256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAA0bGNaUgAAAAAAAAAAAAEANy0kJBoSCQAAAAAAACfe3ZSMi0pBK+uEwAAAAAgMCwIBAD1sbGNjg8kAAAARHEfGhISDQkJaIoOAAAACWWZAAUFABgUAElqCs4AAA2FvUEFoIBgENgkSQnOmQASiQRhCqAgQBC0AEUFqpkAFqkIggrgBAgIkO4ABYlVABbNDYIPEyBITJCulwBlUQAA8i2iwgAlRYWJqnYYRQAAACAxVnqeACkpTk5yFCQAAAAAQGCAgMDgAAgMDBAAAAAAAAAbIEFhYoKiwwAAAAAAAAAAAADVAAQILAAAAAAAAA==',
    'BALL1256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAAYEBgQGAAAAAAAAAAAABAYICAgICAYEAAAAAAAABggICgoKCgoICAQAAAAABgYICgoKCgoKCggIBAAAAAYICgoMDAwMDAoKCAYAAAQICgoMDgwODA4MCgoIBgAGCAoKDA4ODg4MDAoKCAQABAgKCgwMDg4ODgwKCggGAAYICAwMDg/+DgwMCgoIBAAECAoKDA4ODg4ODAoKCAYAAAYICgoMDAwMDAoKCAYAAAAECAgICgwKCgoKCAgEAAAAAAYICAoICgoICAYGAAAAAAAABAYICAgICAYGAAAAAAAAAAAABAYEBgQAAAAAAAAA==',
    'BALL2256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAACAgICAgAAAAAAAAAAAAICAwMDAwMCAgAAAAAAAAIDBAQEBAQEBAMCAAAAAAIDBAQEBAQFBAQEAwIAAAADAwQEBQUFBAUEBAQDAAACAwQEBQUFBQYFBQQEAwIAAgMEBAUFBgYFBQUEBAMCAAIDBAQFBQYFBgUFBAQDAgACAwQEBQU/xgYFBQQEAwIAAgMEBAUFBQUFBQUEBAMCAAADAwQEBQUFBQUEBAQCAAAAAgMEBAQEBAQEBAQDAgAAAAACAwMEBAQEBAMDAgAAAAAAAAIDAwMDAwMDAgAAAAAAAAAAAAICAgICAAAAAAAAA==',
    'BALL3256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAABQkFCgUAAAAAAAAAAAAFCgkKCgkKCQUAAAAAAAAJCgoKCgoKCgoKBQAAAAAFCgoOCg8ODgsOCgoFAAAACgoKDg8ODw8ODgoKCgAABQoKDg8ODw8ODw8OCgoFAAoJCg4PDxMTDxMODgoKCQAFCgoODg8TDw8PDw4KCgUACQoKDg8PthMTDw4LCgoJAAUKCg4PDg8ODxIPDgoJBQAACgoKDg8PDw8PCg4KCgAAAAkKCg4ODg4ODg4KCgUAAAAABQoKCgoKCgoKCgkAAAAAAAAFCgoJCgoJCgUAAAAAAAAAAAAFCgUJBgAAAAAAAA==',
    'BALL4256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAASEhISEgAAAAAAAAAAABISGxsbGxsSEgAAAAAAABIbJCQkJCQkJBsSAAAAABIbJCQkJCQtJCQkGxIAAAAbGyQkLS0tJC0kJCQbAAASGyQkLS0tLTYtLSQkGxIAEhskJC0tNjYtLS0kJBsSABIbJCQtLTYtNi0tJCQbEgASGyQkLS0/9jYtLSQkGxIAEhskJC0tLS0tLS0kJBsSAAAbGyQkLS0tLS0kJCQSAAAAEhskJCQkJCQkJCQbEgAAAAASGxskJCQkJBsbEgAAAAAAABIbGxsbGxsbEgAAAAAAAAAAABISEhISAAAAAAAAA==',
    'BALL5256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCq ANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAACQkJCQkAAAAAAAAAAAAJCQ0NDQ0NCQkAAAAAAAAJDRISEhISERINCQAAAAAJDRIREhISFhISEQ4JAAAADQ0SEhYWFhIWEhIRDQAACQ0SEhYWFhYaFxYSEQ4JAAkNEhIWFhobFhYWEhINCQAJDRISFhYbFhsWFhISDQkACQ0SEhYW/xobFhYSEg0JAAkNEhIWFhYWFhYWEhINCQAADQ4REhYWFhYWEhIRCQAAAAkNEhESEhISEhESDQkAAAAACQ0OEhISEhIODQkAAAAAAAAJDQ0NDQ0NDQkAAAAAAAAAAAAJCQkJCQAAAAAAAA==',
    'BALL6256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AAAAAAAAQWFhQWEAAAAAAAAAAABBYYGCYYJhYWEAAAAAAABhgoKCgqKCooJhYQAAAABhYYKCwqKioqOigoFBAAAAYYKCosPCw8PCooKCYQAAQYKCosLjw+PC48PCgoJBAGGBgqLD4+Pj48PCooKBYQBBgoKiw+Pj4+Pjw6KCgkEAYWGCwsPC/+Pjw8LCgoFhAEGCgaLj4+PD4+PDooKCQQAAYWKCosPCw8PCooKCYQAAAEGCgYKiwqLCooKCgUEAAAAAYYKCgoKCgoKBYmEAAAAAAABBYYJhgmKBYmEAAAAAAAAAAABBYUFhQQAAAAAAAA==',
    'BALLM256.BMP': 'data:image/bmp;base64,Qk0mBQAAAAAAADYEAAAoAAAADwAAAA8AAAABAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAAACqAAAA/wAAAAAkAABVJAAAqiQAAP8kAAAASQAAVUkAAKpJAAD/SQAAAG0AAFVtAACqbQAA/20AAACSAABVkgAAqpIAAP+SAAAAtgAAVbYAAKq2AAD/tgAAANsAAFXbAACq2wAA/9sAAAD/AABV/wAAqv8AAP//AAAAACQAVQAkAKoAJAD/ACQAACQkAFUkJACqJCQA/yQkAABJJABVSSQAqkkkAP9JJAAAbSQAVW0kAKptJAD/bSQAAJIkAFWSJACqkiQA/5IkAAC2JABVtiQAqrYkAP+2JAAA2yQAVdskAKrbJAD/2yQAAP8kAFX/JACq/yQA//8kAAAASQBVAEkAqgBJAP8ASQAAJEkAVSRJAKokSQD/JEkAAElJAFVJSQCqSUkA/0lJAABtSQBVbUkAqm1JAP9tSQAAkkkAVZJJAKqSSQD/kkkAALZJAFW2SQCqtkkA/7ZJAADbSQBV20kAqttJAP/bSQAA/0kAVf9JAKr/SQD//0kAAABtAFUAbQCqAG0A/wBtAAAkbQBVJG0AqiRtAP8kbQAASW0AVUltAKpJbQD/SW0AAG1tAFVtbQCqbW0A/21tAACSbQBVkm0AqpJtAP+SbQAAtm0AVbZtAKq2bQD/tm0AANttAFXbbQCq220A/9ttAAD/bQBV/20Aqv9tAP//bQAAAJIAVQCSAKoAkgD/AJIAACSSAFUkkgCqJJIA/ySSAABJkgBVSZIAqkmSAP9JkgAAbZIAVW2SAKptkgD/bZIAAJKSAFWSkgCqkpIA/5KSAAC2kgBVtpIAqraSAP+2kgAA25IAVduSAKrbkgD/25IAAP+SAFX/kgCq/5IA//+SAAAAtgBVALYAqgC2AP8AtgAAJLYAVSS2AKoktgD/JLYAAEm2AFVJtgCqSbYA/0m2AABttgBVbbYAqm22AP9ttgAAkrYAVZK2AKqStgD/krYAALa2AFW2tgCqtrYA/7a2AADbtgBV27YAqtu2AP/btgAA/7YAVf+2AKr/tgD//7YAAADbAFUA2wCqANsA/wDbAAAk2wBVJNsAqiTbAP8k2wAASdsAVUnbAKpJ2wD/SdsAAG3bAFVt2wCqbdsA/23bAACS2wBVktsAqpLbAP+S2wAAttsAVbbbAKq22wD/ttsAANvbAFXb2wCq29sA/9vbAAD/2wBV/9sAqv/bAP//2wAAAP8AVQD/AKoA/wD/AP8AACT/AFUk/wCqJP8A/yT/AABJ/wBVSf8Aqkn/AP9J/wAAbf8AVW3/AKpt/wD/bf8AAJL/AFWS/wCqkv8A/5L/AAC2/wBVtv8Aqrb/AP+2/wAA2/8AVdv/AKrb/wD/2/8AAP//AFX//wCq//8A////AP//////AAAAAAD//////wD///8AAAAAAAAAAAD///8A//8AAAAAAAAAAAAAAP//AP8AAAAAAAAAAAAAAAAA/wD/AAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAP8A/wAAAAAAAAAAAAAAAAD/AP//AAAAAAAAAAAAAAD//wD///8AAAAAAAAAAAD///8A//////8AAAAAAP//////AA=='
  };

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.baseWidth = 320;
      this.baseHeight = 240;

      this.colors = [
        { main: '#000000', glow: '#000000', highlight: '#000000' },
        { main: '#ef4444', glow: '#f87171', highlight: '#fca5a5' },
        { main: '#22c55e', glow: '#4ade80', highlight: '#86efac' },
        { main: '#3b82f6', glow: '#60a5fa', highlight: '#93c5fd' },
        { main: '#eab308', glow: '#facc15', highlight: '#fef08a' },
        { main: '#06b6d4', glow: '#22d3ee', highlight: '#67e8f9' },
        { main: '#a855f7', glow: '#c084fc', highlight: '#e9d5ff' },
        { main: '#f97316', glow: '#fb923c', highlight: '#fdba74' }
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
      const files = ['BALL0256.BMP', 'BALL1256.BMP', 'BALL2256.BMP', 'BALL3256.BMP', 'BALL4256.BMP', 'BALL5256.BMP', 'BALL6256.BMP', 'BALLM256.BMP', 'PLAY256.BMP', 'INTRO256.BMP'];

      const checkDone = () => {
        loaded++;
        if (loaded === files.length) {
          this.processMaskedBitmaps();
          if (callback) callback();
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
          checkDone();
        };
        // Use embedded Base64 data URI for ball bitmaps to avoid CORS/tainted canvas errors on file:// protocol
        if (typeof EMBEDDED_INTRO_BMP !== 'undefined' && file === 'INTRO256.BMP') {
          img.src = EMBEDDED_INTRO_BMP;
        } else if (EMBEDDED_BALL_BMPS[file]) {
          img.src = EMBEDDED_BALL_BMPS[file];
        } else {
          img.src = file;
        }
      });
    }

    processMaskedBitmaps() {
      const maskImg = this.bitmaps['BALLM256.BMP'];
      let maskData = null;
      if (maskImg) {
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = 16;
        maskCanvas.height = 16;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(maskImg, 0, 0);
        try {
          maskData = maskCtx.getImageData(0, 0, 16, 16).data;
        } catch (e) {}
      }

      for (let c = 0; c <= 6; c++) {
        const fileName = `BALL${c}256.BMP`;
        const img = this.bitmaps[fileName];
        if (!img) continue;

        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        try {
          const imgData = ctx.getImageData(0, 0, 16, 16);
          const data = imgData.data;

          for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
              const i = (y * 16 + x) * 4;
              let isTransparent = false;

              if (maskData) {
                // In BALLM256.BMP, White (255,255,255) is the background outside the ball sphere
                const mr = maskData[i];
                if (mr > 128) {
                  isTransparent = true;
                }
              } else {
                // Geometric circle radius fallback
                const dx = x - 7.5;
                const dy = y - 7.5;
                if (Math.sqrt(dx * dx + dy * dy) > 7.5) {
                  isTransparent = true;
                }
              }

              if (isTransparent) {
                data[i + 3] = 0; // Set alpha to 0 for background
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          this.bitmaps[fileName] = canvas;
        } catch (e) {
          console.warn('Bitmap transparency processing error:', e);
        }
      }
    }

    clear() {
      this.ctx.fillStyle = '#0a0b10';
      this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);
    }

    drawPlayfieldBackground(isStartScreen = false) {
      if (this.useBitmaps) {
        if (isStartScreen && this.bitmaps['INTRO256.BMP']) {
          this.ctx.drawImage(this.bitmaps['INTRO256.BMP'], 0, 0, this.baseWidth, this.baseHeight);
          return;
        }
        if (this.bitmaps['PLAY256.BMP']) {
          this.ctx.drawImage(this.bitmaps['PLAY256.BMP'], 0, 0, this.baseWidth, this.baseHeight);
          return;
        }
      }

      this.ctx.fillStyle = '#07090e';
      this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      this.ctx.lineWidth = 1.5;

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

      const col = this.colors[colorIndex] || this.colors[1];
      const cx = xPx + 8;
      const cy = yPx + 8;
      const r = 7.5 * scale;

      this.ctx.save();

      this.ctx.shadowColor = col.glow;
      this.ctx.shadowBlur = 8;

      const grad = this.ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      grad.addColorStop(0, col.highlight);
      grad.addColorStop(0.5, col.main);
      grad.addColorStop(1, '#050508');

      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      this.ctx.beginPath();
      this.ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.25, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = col.glow;
      this.ctx.lineWidth = 0.75;
      this.ctx.stroke();

      this.ctx.restore();
    }

    drawInBoxStats(engine) {
      if (!engine) return;
      this.ctx.save();
      this.ctx.font = '700 11px "Fira Code", "Courier New", monospace';
      this.ctx.textBaseline = 'top';

      // 1. Upper-Left Box (Level)
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(7, 22, 26, 15);
      this.ctx.fillStyle = (engine.levCol > 0) ? '#ff00ff' : '#4bebc7';
      this.ctx.fillText(String(engine.level || 1), 9, 23);

      // 2. Upper-Right Box (Skill)
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(258, 22, 56, 15);
      this.ctx.fillStyle = '#4bebc7';
      this.ctx.fillText(String(engine.skill || 1), 260, 23);

      // 3. Lower-Left Box (Oddballz Ball Count)
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(8, 198, 36, 15);
      this.ctx.fillStyle = '#4bebc7';
      this.ctx.fillText(String(engine.ballCount || 0), 10, 199);

      // 4. Lower-Right Box (Score)
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(234, 215, 79, 15);
      this.ctx.fillStyle = '#4bebc7';
      this.ctx.fillText(String(engine.score || 0), 236, 216);

      this.ctx.restore();
    }

    drawEngineState(engine) {
      const isStartScreen = window.oddApp ? window.oddApp.isStartScreen : false;
      this.drawPlayfieldBackground(isStartScreen);

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

      if (!engine.endGame && !engine.pauseFlag) {
        for (let i = 0; i <= 3; i++) {
          const mapPt = engine.oddballz.map[i];
          if (mapPt.x >= 0 && mapPt.x <= 24 && mapPt.y >= 0 && mapPt.y <= 23) {
            const px = this.getPixelX(mapPt.x, mapPt.y);
            const py = (mapPt.y - 3) * 13;
            const color = engine.oddballz.image[i];
            this.drawBall(px, py, color);
          }
        }
      }

      this.drawInBoxStats(engine);
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

  // =========================================================================
  // 3. WEB AUDIO RETRO SYNTHESIZER & MP3 AUDIO PLAYER
  // =========================================================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.freq = [25, 27, 28, 30, 32, 33, 35, 37, 39, 40, 42, 44, 45, 47, 49, 51, 52, 54, 56];
      this.currentTrack = null;
      this.bgAudio = null;
      this.activeAudios = [];
      this.audioStateBeforeFocusLoss = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    pauseForFocusLoss() {
      this.audioStateBeforeFocusLoss = {
        enabled: this.enabled,
        track: this.currentTrack,
        isPlaying: !!(this.bgAudio && !this.bgAudio.paused && !this.bgAudio._disposed)
      };

      if (this.bgAudio && !this.bgAudio._disposed) {
        try {
          this.bgAudio.pause();
        } catch (e) {}
      }
      if (this.ctx && this.ctx.state === 'running') {
        try {
          this.ctx.suspend();
        } catch (e) {}
      }
    }

    resumeFromFocusGain() {
      if (this.ctx && this.ctx.state === 'suspended') {
        try {
          this.ctx.resume();
        } catch (e) {}
      }

      if (!this.enabled || !this.audioStateBeforeFocusLoss) return;

      const { isPlaying, track } = this.audioStateBeforeFocusLoss;
      this.audioStateBeforeFocusLoss = null;

      if (isPlaying && track && this.bgAudio && !this.bgAudio._disposed) {
        try {
          const playPromise = this.bgAudio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              this.playMidiTrack(track);
            });
          }
        } catch (e) {
          this.playMidiTrack(track);
        }
      }
    }

    stopMidi() {
      if (this.activeAudios && this.activeAudios.length > 0) {
        this.activeAudios.forEach(a => {
          a._disposed = true;
          try {
            a.pause();
            a.currentTime = 0;
            a.src = '';
          } catch (e) {}
        });
      }
      this.activeAudios = [];
      this.bgAudio = null;
      this.currentTrack = null;
    }

    removeAudio(audio) {
      if (!audio) return;
      audio._disposed = true;
      try {
        audio.pause();
        audio.src = '';
      } catch (e) {}
      if (this.activeAudios) {
        this.activeAudios = this.activeAudios.filter(a => a !== audio);
      }
      if (this.bgAudio === audio) {
        this.bgAudio = null;
      }
    }

    playMidiTrack(trackName) {
      if (!this.enabled) {
        this.stopMidi();
        return;
      }

      // If the requested track is ALREADY active, do not restart it!
      if (this.currentTrack === trackName && this.bgAudio && !this.bgAudio._disposed) {
        return;
      }

      this.stopMidi();
      this.currentTrack = trackName;

      const nameUpper = `ODD${trackName.toUpperCase()}.mp3`;
      const nameLower = `odd${trackName.toLowerCase()}.mp3`;

      const tryPlay = (src, fallbackSrc) => {
        const audio = new Audio(src);
        audio._disposed = false;
        audio.loop = (trackName !== 'end');
        audio.volume = 0.6;
        this.activeAudios.push(audio);
        this.bgAudio = audio;

        if (!this.enabled) {
          this.stopMidi();
          return;
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            if (!this.enabled || audio._disposed) {
              audio.pause();
              audio.currentTime = 0;
              audio.src = '';
              this.removeAudio(audio);
            }
          }).catch(() => {
            if (audio._disposed) return;
            this.removeAudio(audio);
            if (!this.enabled) return;

            if (fallbackSrc) {
              const audio2 = new Audio(fallbackSrc);
              audio2._disposed = false;
              audio2.loop = (trackName !== 'end');
              audio2.volume = 0.6;
              this.activeAudios.push(audio2);
              this.bgAudio = audio2;

              if (!this.enabled) {
                this.stopMidi();
                return;
              }

              audio2.play().then(() => {
                if (!this.enabled || audio2._disposed) {
                  audio2.pause();
                  audio2.currentTime = 0;
                  audio2.src = '';
                  this.removeAudio(audio2);
                }
              }).catch(err => {
                this.removeAudio(audio2);
                console.warn(`Could not play MP3: ${src} or ${fallbackSrc}`);
              });
            }
          });
        }
      };

      tryPlay(nameUpper, nameLower);
    }

    playSound(type, param) {
      if (!this.enabled || !this.ctx) return;

      const t = this.ctx.currentTime;

      switch (type) {
        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.05);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }

        case 'drop': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, t);
          osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }

        case 'zip': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.linearRampToValueAtTime(150, t + 0.03);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.03);
          break;
        }

        case 'pop': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, t);
          osc.frequency.exponentialRampToValueAtTime(1046.50, t + 0.12);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.12);
          break;
        }

        case 'levelup': {
          const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
          notes.forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, t + idx * 0.06);
            gain.gain.setValueAtTime(0.2, t + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.06 + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.06);
            osc.stop(t + idx * 0.06 + 0.12);
          });
          break;
        }

        case 'gameover': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.exponentialRampToValueAtTime(50, t + 0.6);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.6);
          break;
        }
      }
    }
  }

  // =========================================================================
  // 4. MAIN APP CONTROLLER & CONTROLS
  // =========================================================================
  class OddballzApp {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.engine = new OddUnitEngine();
      this.renderer = new Renderer(this.canvas);
      this.audio = new SoundEngine();

      this.isPlaying = false;
      this.isPaused = false;
      this.isStartScreen = true;
      this.animFrameId = null;
      this.wasPausedByModal = false;
      this.wasPausedByFocusLoss = false;
      this.moveTime = 0;
      this.lastTime = 0;
      this.accumulatedTime = 0;

      try {
        this.highScores = JSON.parse(localStorage.getItem('oddballz_hiscores') || '[]');
      } catch (e) {
        this.highScores = [];
      }

      this.initAudioHooks();
      this.initEventListeners();
      this.initTouchControls();
      
      this.renderer.loadBitmaps(() => {
        this.renderer.drawEngineState(this.engine);
      });
      const imgIntroLogo = document.getElementById('imgIntroLogo');
      if (imgIntroLogo && typeof EMBEDDED_TITLE_LOGO !== 'undefined') {
        imgIntroLogo.src = EMBEDDED_TITLE_LOGO;
      }

      this.renderer.drawEngineState(this.engine);
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
      const closeModal = () => {
        const modal = document.getElementById('gameDialogView');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          modal.style.opacity = '0';
          modal.style.visibility = 'hidden';
        }
        if (this.wasPausedByModal) {
          this.wasPausedByModal = false;
          if (this.isPlaying && this.isPaused) {
            this.togglePause();
          }
        }
      };

      const setSoundEnabled = (enabled) => {
        this.audio.enabled = enabled;
        const toggleSound = document.getElementById('toggleSound');
        if (toggleSound) toggleSound.checked = enabled;

        if (!enabled) {
          this.audio.stopMidi();
        } else {
          if (this.isPlaying && !this.isPaused) {
            this.audio.playMidiTrack('play');
          } else {
            const overlayGameOver = document.getElementById('overlayGameOver');
            const isGameOverShowing = overlayGameOver && !overlayGameOver.classList.contains('hidden');

            if (isGameOverShowing) {
              this.audio.playMidiTrack('end');
            } else if (this.isStartScreen) {
              this.audio.playMidiTrack('intro');
            }
          }
        }
      };

      window.addEventListener('keydown', (e) => {
        const code = e.code;

        if (code === 'Escape') {
          const modal = document.getElementById('gameDialogView');
          if (modal && modal.classList.contains('show')) {
            closeModal();
            e.preventDefault();
            return;
          }
          const modalEnd = document.getElementById('dialogConfirmEnd');
          if (modalEnd && modalEnd.classList.contains('show')) {
            this.closeEndGameModal();
            e.preventDefault();
            return;
          }
        }

        const overlayGameOver = document.getElementById('overlayGameOver');
        const isGameOverShowing = overlayGameOver && !overlayGameOver.classList.contains('hidden');

        if (code === 'Enter') {
          if (!this.isPlaying) {
            if (isGameOverShowing) {
              this.returnToTitle();
            } else {
              this.startGame();
            }
          }
          e.preventDefault();
          return;
        }

        if (code === 'KeyR') {
          if (!this.isPlaying && !isGameOverShowing) {
            this.switchMode(false);
            this.startGame();
          }
          e.preventDefault();
          return;
        }

        if (code === 'KeyC') {
          if (!this.isPlaying && !isGameOverShowing) {
            this.switchMode(true);
            this.startGame();
          }
          e.preventDefault();
          return;
        }

        if (code === 'KeyM') {
          const toggle = document.getElementById('toggleSound');
          if (toggle) {
            const nextState = !toggle.checked;
            setSoundEnabled(nextState);
          }
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
            if (this.engine.matcher) {
              this.engine.rotColors();
            }
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
            if (this.engine.transform(this.engine.flipX)) {
              if (this.engine.onPlaySound) this.engine.onPlaySound('click');
            }
            e.preventDefault();
            break;

          case 'KeyY':
          case 'End':
            if (this.engine.transform(this.engine.flipY)) {
              if (this.engine.onPlaySound) this.engine.onPlaySound('click');
            }
            e.preventDefault();
            break;

          case 'Space':
            this.engine.zip();
            e.preventDefault();
            break;
        }

        this.renderer.drawEngineState(this.engine);
      });

      const bindBtn = (id, handler) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        let lastTriggerTime = 0;
        const trigger = (e) => {
          const now = Date.now();
          if (now - lastTriggerTime < 250) {
            if (e.cancelable) e.preventDefault();
            return;
          }
          lastTriggerTime = now;
          if (e.cancelable) e.preventDefault();
          handler();
        };

        btn.addEventListener('pointerdown', trigger, { passive: false });
        btn.addEventListener('touchstart', trigger, { passive: false });
        btn.addEventListener('click', trigger);
      };

      bindBtn('btnStart', () => this.startGame());
      bindBtn('btnOverlayStart', () => this.startGame());
      bindBtn('btnGameOverReturn', () => this.returnToTitle());
      bindBtn('btnPause', () => this.togglePause());
      bindBtn('btnPauseResume', () => this.togglePause());
      bindBtn('btnEndGame', () => this.promptEndGame());
      bindBtn('btnPauseEnd', () => this.promptEndGame());
      bindBtn('btnConfirmEndYes', () => this.confirmEndGame());
      bindBtn('btnConfirmEndNo', () => this.closeEndGameModal());
      bindBtn('btnViewRecords', () => this.showHighScoresModal());
      bindBtn('btnOverlayRecords', () => this.showHighScoresModal());
      bindBtn('btnGameOverRecords', () => this.showHighScoresModal());
      bindBtn('btnCloseRecords', () => closeModal());

      const gameDialogView = document.getElementById('gameDialogView');
      if (gameDialogView) {
        gameDialogView.addEventListener('click', (e) => {
          if (e.target === gameDialogView) closeModal();
        });
      }

      const dialogConfirmEnd = document.getElementById('dialogConfirmEnd');
      if (dialogConfirmEnd) {
        dialogConfirmEnd.addEventListener('click', (e) => {
          if (e.target === dialogConfirmEnd) this.closeEndGameModal();
        });
      }

      // Auto-pause and mute sound when window or browser tab loses focus
      const handleFocusLoss = () => {
        this.audio.pauseForFocusLoss();
        if (this.isPlaying && !this.isPaused) {
          this.wasPausedByFocusLoss = true;
          this.togglePause();
        }
      };

      const handleFocusGain = () => {
        this.audio.resumeFromFocusGain();
      };

      window.addEventListener('blur', handleFocusLoss);
      window.addEventListener('focus', handleFocusGain);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          handleFocusLoss();
        } else {
          handleFocusGain();
        }
      });

      const toggleSound = document.getElementById('toggleSound');
      if (toggleSound) {
        toggleSound.addEventListener('change', (e) => {
          setSoundEnabled(e.target.checked);
        });
      }

      // Interaction listener: starts intro music as soon as user clicks or presses any key
      const tryStartIntro = () => {
        this.audio.init();
        if (!this.isPlaying && this.audio.enabled && this.isStartScreen) {
          if (this.audio.currentTrack !== 'intro') {
            this.audio.playMidiTrack('intro');
          }
        }
      };

      window.addEventListener('pointerdown', tryStartIntro);
      window.addEventListener('keydown', tryStartIntro);

      const tabColor = document.getElementById('tabColorMatch');
      const tabRow = document.getElementById('tabRowBuild');

      if (tabColor) tabColor.addEventListener('click', () => {
        if (!this.isPlaying) this.switchMode(true);
      });
      if (tabRow) tabRow.addEventListener('click', () => {
        if (!this.isPlaying) this.switchMode(false);
      });
    }

    switchMode(isColorMatch) {
      if (this.isPlaying) return;

      const tabColor = document.getElementById('tabColorMatch');
      const tabRow = document.getElementById('tabRowBuild');
      this.engine.matcher = isColorMatch;

      if (isColorMatch) {
        if (tabColor) tabColor.classList.add('active');
        if (tabRow) tabRow.classList.remove('active');
      } else {
        if (tabRow) tabRow.classList.add('active');
        if (tabColor) tabColor.classList.remove('active');
      }
      this.engine.initGame();
      this.updateUI();
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
        if (this.engine.transform(this.engine.flipX) || this.engine.transform(this.engine.flipY)) {
          if (this.audio && this.audio.enabled) this.audio.playSound('click');
        }
      });
      bindTouch('btnTouchF', () => {
        if (this.engine.matcher) {
          this.engine.rotColors();
        }
      });
      bindTouch('btnTouchSpace', () => this.engine.zip());
    }

    startGame() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.isStartScreen = false;
      this.wasPausedByModal = false;
      this.wasPausedByFocusLoss = false;

      try {
        this.audio.init();
        if (this.audio.enabled) {
          this.audio.playMidiTrack('play');
        }
      } catch (e) {
        console.warn("MIDI audio error:", e);
      }
      this.engine.initGame();
      this.engine.endGame = false;
      this.engine.pauseFlag = false;
      this.engine.build();

      this.isPlaying = true;
      this.isPaused = false;
      this.moveTime = 0;
      this.accumulatedTime = 0;
      this.lastTime = performance.now();

      const overlayStart = document.getElementById('overlayStart');
      if (overlayStart) overlayStart.classList.add('hidden');

      const overlayGameOver = document.getElementById('overlayGameOver');
      if (overlayGameOver) overlayGameOver.classList.add('hidden');

      const overlayPause = document.getElementById('overlayPause');
      if (overlayPause) {
        overlayPause.classList.add('hidden');
        overlayPause.style.display = 'none';
      }

      const btnPause = document.getElementById('btnPause');
      if (btnPause) btnPause.disabled = false;

      const btnEndGame = document.getElementById('btnEndGame');
      if (btnEndGame) btnEndGame.disabled = false;

      this.renderer.drawEngineState(this.engine);
      this.updateUI();

      this.animFrameId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    togglePause() {
      if (!this.isPlaying) return;
      const now = Date.now();
      if (this.lastPauseToggle && now - this.lastPauseToggle < 150) return;
      this.lastPauseToggle = now;

      this.isPaused = !this.isPaused;
      this.engine.pauseFlag = this.isPaused;

      const overlayPause = document.getElementById('overlayPause');
      if (this.isPaused) {
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }
        this.audio.stopMidi();
        if (overlayPause) {
          overlayPause.classList.remove('hidden');
          overlayPause.style.display = 'flex';
        }
      } else {
        if (this.audio.enabled) {
          this.audio.playMidiTrack('play');
        }
        if (overlayPause) {
          overlayPause.classList.add('hidden');
          overlayPause.style.display = 'none';
        }
        this.lastTime = performance.now();
        this.animFrameId = requestAnimationFrame((t) => this.gameLoop(t));
      }
    }

    gameLoop(currentTime) {
      if (!this.isPlaying || this.isPaused) {
        this.animFrameId = null;
        return;
      }

      const dt = currentTime - this.lastTime;
      this.lastTime = currentTime;
      this.accumulatedTime += dt;

      const tickDelay = Math.max(16, this.engine.pauseTime);

      if (this.accumulatedTime >= tickDelay) {
        this.accumulatedTime = 0;
        this.moveTime++;

        if (this.moveTime >= 8) {
          this.moveTime = 0;

          if (!this.engine.moveOBall(this.engine.direction)) {
            this.engine.stamp();

            this.engine.checkMatches();
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

      this.animFrameId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    handleGameOver() {
      this.isPlaying = false;
      this.engine.endGame = true;
      if (this.audio.enabled) {
        this.audio.playMidiTrack('end');
      }
      this.updateHighScores(this.engine.score, this.engine.level, this.engine.skill);
      const finalScore = document.getElementById('finalScore');
      if (finalScore) finalScore.textContent = this.engine.score;

      const overlayGameOver = document.getElementById('overlayGameOver');
      if (overlayGameOver) overlayGameOver.classList.remove('hidden');

      const btnPause = document.getElementById('btnPause');
      if (btnPause) btnPause.disabled = true;

      const btnEndGame = document.getElementById('btnEndGame');
      if (btnEndGame) btnEndGame.disabled = true;

      this.renderer.drawEngineState(this.engine);
      this.updateUI();
    }

    returnToTitle() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.isPlaying = false;
      this.isPaused = false;
      this.isStartScreen = true;
      this.wasPausedByModal = false;
      this.wasPausedByFocusLoss = false;

      this.engine.endGame = true;
      this.engine.pauseFlag = false;

      const overlayGameOver = document.getElementById('overlayGameOver');
      if (overlayGameOver) overlayGameOver.classList.add('hidden');

      const overlayPause = document.getElementById('overlayPause');
      if (overlayPause) {
        overlayPause.classList.add('hidden');
        overlayPause.style.display = 'none';
      }

      const overlayStart = document.getElementById('overlayStart');
      if (overlayStart) overlayStart.classList.remove('hidden');

      const btnPause = document.getElementById('btnPause');
      if (btnPause) btnPause.disabled = true;

      const btnEndGame = document.getElementById('btnEndGame');
      if (btnEndGame) btnEndGame.disabled = true;

      if (this.audio.enabled) {
        this.audio.playMidiTrack('intro');
      }

      this.renderer.drawEngineState(this.engine);
      this.updateUI();
    }

    promptEndGame() {
      if (!this.isPlaying) return;
      const modal = document.getElementById('dialogConfirmEnd');
      if (!this.isPaused) {
        this.wasPausedByModal = true;
        this.togglePause();
      }
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.zIndex = '99999999';
      }
    }

    closeEndGameModal() {
      const modal = document.getElementById('dialogConfirmEnd');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
      }
      if (this.wasPausedByModal) {
        this.wasPausedByModal = false;
        if (this.isPlaying && this.isPaused) {
          this.togglePause();
        }
      }
    }

    confirmEndGame() {
      this.wasPausedByModal = false;
      const modal = document.getElementById('dialogConfirmEnd');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
      }
      this.returnToTitle();
    }

    updateUI() {
      const statScore = document.getElementById('statScore');
      if (statScore) statScore.textContent = this.engine.score;

      const lvlEl = document.getElementById('statLevel');
      if (lvlEl) {
        lvlEl.textContent = this.engine.level;
        lvlEl.style.color = this.engine.levCol > 0 ? '#f43f5e' : '';
      }

      const statSkill = document.getElementById('statSkill');
      if (statSkill) statSkill.textContent = this.engine.skill;

      const statBalls = document.getElementById('statBalls');
      if (statBalls) statBalls.textContent = this.engine.ballCount;

      const tabColor = document.getElementById('tabColorMatch');
      const tabRow = document.getElementById('tabRowBuild');
      if (tabColor) tabColor.classList.toggle('disabled', this.isPlaying);
      if (tabRow) tabRow.classList.toggle('disabled', this.isPlaying);

      const btnTouchF = document.getElementById('btnTouchF');
      if (btnTouchF) {
        const isColorMatch = this.engine.matcher;
        btnTouchF.disabled = !isColorMatch;
        btnTouchF.classList.toggle('disabled', !isColorMatch);
      }
    }

    updateHighScores(score, level, skill) {
      if (score <= 0) return;
      this.highScores.push({
        date: new Date().toLocaleDateString(),
        score: score,
        level: level,
        skill: skill,
        mode: this.engine.matcher ? 'Color Match' : 'Rows Game'
      });

      this.highScores.sort((a, b) => b.score - a.score);
      this.highScores = this.highScores.slice(0, 10);
      try {
        localStorage.setItem('oddballz_hiscores', JSON.stringify(this.highScores));
      } catch (e) {
        console.warn("Could not write to localStorage:", e);
      }
    }

    showHighScoresModal() {
      const modal = document.getElementById('gameDialogView');

      if (this.isPlaying && !this.isPaused) {
        this.wasPausedByModal = true;
        this.togglePause();
      }

      const tbody = document.getElementById('recordsTableBody');
      if (tbody) {
        tbody.innerHTML = '';

        const scores = Array.isArray(this.highScores) ? this.highScores : [];
        if (scores.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:1rem 0;">No records saved yet!</td></tr>';
        } else {
          scores.forEach((hs, idx) => {
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

      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.zIndex = '99999999';
      }
    }

    closeHighScoresModal() {
      closeModal();
    }
  }

  // Auto-instantiate on DOM load
  const initApp = () => {
    if (!window.oddApp) {
      window.oddApp = new OddballzApp();
    }
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
