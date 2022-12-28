var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Cutscenes from './cutscenes.js';
import Hazards from './hazards.js';
import Particles from './particles.js';
import Player from './player.js';
import setStage from './stage.js';
import Wave from './wave.js';
import { IMG, SFX } from './assets.js';
var Netervati = /** @class */ (function () {
    function Netervati() {
        this._canvas = setStage();
        var context2D = this._canvas.getContext('2d');
        if (context2D === null) {
            throw 'Canvas undefined';
        }
        this._ctx = context2D;
        this._cutscenes = new Cutscenes();
        this._allowStart = 0;
        this._gameStart = 0;
        this._playBgm = 0;
        this._gameOver = 0;
        this._player = new Player(this._canvas.width / 2 - 25, this._canvas.height - 150);
        this._distance = 0;
        this._distanceMilestone = 100;
        this._beginTime = 0;
        this._particles = new Particles(this._player.x);
        this._wave = new Wave();
        this._hazards = new Hazards();
    }
    Netervati.prototype.beginGame = function () {
        this._beginTime = performance.now();
        this._allowStart = 1;
    };
    Netervati.prototype.reload = function () {
        this._particles.reset();
        this._hazards.reset();
        this._player.reset();
        this._gameOver = 0;
        this._distance = 0;
        this._distanceMilestone = 100;
        SFX.gammaRay.pause();
        SFX.gammaRay.currentTime = 0;
    };
    Netervati.prototype.logKey = function (pv) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._player.collision !== 0) {
                            return [2 /*return*/];
                        }
                        if (!(pv.type === 'movement')) return [3 /*break*/, 1];
                        if (pv.direction === 'right') {
                            if (this._player.x + 19 < this._canvas.width - 25) {
                                this._player.x += 3;
                            }
                        }
                        else if (pv.direction === 'left') {
                            if (this._player.x - 3 > 0) {
                                this._player.x -= 3;
                            }
                        }
                        return [3 /*break*/, 3];
                    case 1:
                        if (!(pv.type === 'shield')) return [3 /*break*/, 3];
                        if (!(this._player.shieldOn === 0 &&
                            this._gameStart === 1 &&
                            this._distance < 4900)) return [3 /*break*/, 3];
                        this._player.shieldOn = 1;
                        if (!(this._player.shield > 0)) return [3 /*break*/, 3];
                        this._player.shield--;
                        this._player.curShieldOn = this._player.shield;
                        return [4 /*yield*/, SFX.shield.play()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Netervati.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proceedHazardUpdate, adjustHazards, spliceAsteroid, _i, _a, asteroid, _b, blocked, collided, activeComet, collided, gammaState, collided;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._wave.update();
                        this._particles.update(this._canvas.height, this._player.x);
                        if (!(this._gameStart === 1 && this._gameOver === 0)) return [3 /*break*/, 13];
                        if (this._player.shieldOn == 0) {
                            if (this._player.shield < 100) {
                                this._player.shield += 0.25;
                            }
                        }
                        else {
                            if (this._player.shield > 0) {
                                this._player.shield--;
                            }
                        }
                        proceedHazardUpdate = this._hazards.spawnAsteroid(this._canvas.width, this._distance, this._player.x);
                        if (proceedHazardUpdate === true) {
                            adjustHazards = false;
                            if (this._distance > this._distanceMilestone &&
                                this._distanceMilestone < 5000 &&
                                this._hazards.asteroidSummonBasis > 40) {
                                this._distanceMilestone += 100;
                                adjustHazards = true;
                            }
                            this._hazards.adjustSpawnSettings(adjustHazards, this._distanceMilestone);
                        }
                        if (!(this._hazards.asteroid.length > 0)) return [3 /*break*/, 6];
                        spliceAsteroid = [];
                        _i = 0, _a = this._hazards.asteroid;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        asteroid = _a[_i];
                        asteroid.y += asteroid.speed;
                        _b = this._hazards.collideWithAsteroid(this._player.shield, this._player.shieldOn, this._player.x, this._player.y, asteroid), blocked = _b.blocked, collided = _b.collided;
                        if (!(blocked === true)) return [3 /*break*/, 3];
                        this._player.shield = this._player.shield - 50 || 0;
                        return [4 /*yield*/, SFX.disintegrate.play()];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        if (collided === true) {
                            this._player.collision = 1;
                        }
                        if (asteroid.y < this._canvas.height) {
                            spliceAsteroid.push(asteroid);
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        this._hazards.asteroid = spliceAsteroid;
                        _c.label = 6;
                    case 6:
                        this._hazards.updateDeathParticles();
                        activeComet = this._hazards.spawnComet(this._canvas.height, this._distance, this._player.x);
                        if (activeComet === true) {
                            collided = this._hazards.collideWithComet(this._player.collision, this._player.x, this._player.y);
                            if (collided === true) {
                                this._player.collision = 1;
                            }
                        }
                        gammaState = this._hazards.updateGammaRay(this._canvas.height, this._canvas.width, this._distance);
                        if (!(gammaState === 'starting')) return [3 /*break*/, 8];
                        return [4 /*yield*/, SFX.gammaRay.play()];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 10];
                    case 8:
                        if (!(gammaState === 'expanding')) return [3 /*break*/, 10];
                        collided = this._hazards.collideWithGammaRay(this._player.x);
                        if (collided === true) {
                            this._player.collision = 1;
                        }
                        if (!(this._hazards.gammaRayExpansion === 120)) return [3 /*break*/, 10];
                        return [4 /*yield*/, SFX.dissipate.play()];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        if (!(this._player.collision === 0)) return [3 /*break*/, 11];
                        this._distance++;
                        if (this._distance === 5000) {
                            this._gameOver = 1;
                        }
                        if (this._distance < 3500) {
                            if (this._wave._curveIn > 0) {
                                this._wave._curveIn--;
                            }
                        }
                        return [3 /*break*/, 13];
                    case 11:
                        this._player.updateDeathState();
                        if (!(this._player.deathDelay === 74)) return [3 /*break*/, 13];
                        return [4 /*yield*/, SFX.explosion.play()];
                    case 12:
                        _c.sent();
                        _c.label = 13;
                    case 13:
                        if (this._gameOver === 0) {
                            if (this._gameStart !== 0) {
                                if (this._wave._curveIn > 0) {
                                    this._wave._curveIn -= 2;
                                }
                            }
                        }
                        else {
                            if (this._wave._curveIn < 100) {
                                this._wave._curveIn += 2;
                            }
                            if (this._cutscenes.ending < 150) {
                                this._cutscenes.ending++;
                            }
                        }
                        if (this._player.curShieldOn !== 0) {
                            if (this._player.curShieldOn - this._player.shield > 50 ||
                                this._player.shield <= 0) {
                                this._player.curShieldOn = 0;
                            }
                        }
                        else {
                            this._player.shieldOn = 0;
                        }
                        if (!(this._cutscenes.load === 1 && this._cutscenes.init < 600)) return [3 /*break*/, 16];
                        this._cutscenes.init++;
                        if (!(this._cutscenes.init === 100)) return [3 /*break*/, 15];
                        return [4 /*yield*/, SFX.warning.play()];
                    case 14:
                        _c.sent();
                        _c.label = 15;
                    case 15:
                        this._cutscenes.updateWarningCutscene();
                        return [3 /*break*/, 18];
                    case 16:
                        if (!(this._cutscenes.init >= 600 && this._gameStart === 0)) return [3 /*break*/, 18];
                        this._gameStart = 1;
                        return [4 /*yield*/, SFX.bgm.play()];
                    case 17:
                        _c.sent();
                        SFX.bgm.loop = true;
                        _c.label = 18;
                    case 18:
                        if (this._allowStart === 1 && this._gameStart === 0) {
                            if (performance.now() - this._beginTime > 24) {
                                this._cutscenes.load = 1;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Netervati.prototype.render = function () {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.imageSmoothingEnabled = false;
        this._particles.renderStarPositions(this._ctx);
        this._wave.render(this._ctx, this._canvas.width, this._canvas.height);
        this._hazards.renderGammaRay(this._ctx, this._canvas.height);
        if (this._player.dead === 0) {
            if (this._player.collision === 0) {
                this._particles.renderShipBoosters(this._ctx, this._player.y);
            }
            this._player.render(this._ctx);
            if (this._player.deathDelay < 75) {
                this._particles.renderShipExplosions(this._ctx, this._player.deathDelay, this._player.x, this._player.y);
            }
        }
        this._hazards.render(this._ctx, this._canvas.height);
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.shadowBlur = 10;
        this._ctx.globalAlpha = this._gameStart == 1 ? 1 : 0;
        this._ctx.shadowColor = this._player.shield > 50 ? 'yellow' : 'white';
        this._ctx.fillStyle = this._player.shield > 50 ? 'white' : 'red';
        this._ctx.fillRect(60, 10, this._player.shield, 8);
        this._ctx.restore();
        var addMargin = 16;
        var fontXmargin = 40;
        var stringNum = this._distance.toString();
        for (var i = 0, len = stringNum.length; i < len; i += 1) {
            addMargin += 2;
            fontXmargin += addMargin;
            this._ctx.save();
            this._ctx.shadowBlur = 10;
            this._ctx.globalAlpha = this._gameStart === 1 ? 1 : 0;
            this._ctx.shadowColor = 'white';
            this._ctx.drawImage(IMG.numbers, Number(stringNum.charAt(i)) * 9, 0, 9, 9, fontXmargin, 30, 24, 24);
            this._ctx.restore();
        }
        this._cutscenes.render(this._ctx, this._canvas.width, this._canvas.height, this._gameOver, this._player.dead);
    };
    return Netervati;
}());
export default Netervati;
