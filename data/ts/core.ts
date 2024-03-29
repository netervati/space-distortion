import Cutscenes from './cutscenes';
import Hazards from './hazards';
import Particles from './particles';
import Player from './player';
import setStage from './stage';
import Wave from './wave';
import { IMG, SFX } from './assets';

class Netervati {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _cutscenes: Cutscenes;
    _allowStart: number;
    _gameStart: number;
    _playBgm: number;
    _gameOver: number;
    _player: Player;
    _distance: number;
    _distanceMilestone: number;
    _beginTime: number;
    _particles: Particles;
    _wave: Wave;
    _hazards: Hazards;

    constructor() {
        this._canvas = setStage();

        const context2D = this._canvas.getContext('2d');
        if (context2D === null) {
            throw 'Canvas undefined';
        }

        this._ctx = context2D;

        this._cutscenes = new Cutscenes();

        this._allowStart = 0;
        this._gameStart = 0;
        this._playBgm = 0;
        this._gameOver = 0;

        this._player = new Player(
            this._canvas.width / 2 - 25,
            this._canvas.height - 150,
        );

        this._distance = 0;
        this._distanceMilestone = 100;
        this._beginTime = 0;

        this._particles = new Particles(this._player.x);
        this._wave = new Wave();
        this._hazards = new Hazards();
    }

    beginGame() {
        this._beginTime = performance.now();
        this._allowStart = 1;
    }

    reload() {
        this._particles.reset();
        this._hazards.reset();
        this._player.reset();

        this._gameOver = 0;
        this._distance = 0;
        this._distanceMilestone = 100;
        SFX.gammaRay.pause();
        SFX.gammaRay.currentTime = 0;
    }

    async logKey(pv: { type: string; direction: string }): Promise<void> {
        if (this._player.collision !== 0) {
            return;
        }

        if (pv.type === 'movement') {
            if (pv.direction === 'right') {
                if (this._player.x + 19 < this._canvas.width - 25) {
                    this._player.x += 3;
                }
            } else if (pv.direction === 'left') {
                if (this._player.x - 3 > 0) {
                    this._player.x -= 3;
                }
            }
        } else if (pv.type === 'shield') {
            if (
                this._player.shieldOn === 0 &&
                this._gameStart === 1 &&
                this._distance < 4900
            ) {
                this._player.shieldOn = 1;

                if (this._player.shield > 0) {
                    this._player.shield--;
                    this._player.curShieldOn = this._player.shield;
                    await SFX.shield.play();
                }
            }
        }
    }
    async update(): Promise<void> {
        this._wave.update();
        this._particles.update(this._canvas.height, this._player.x);

        this.render();

        if (this._gameStart === 1 && this._gameOver === 0) {
            if (this._player.shieldOn == 0) {
                if (this._player.shield < 100) {
                    this._player.shield += 0.25;
                }
            } else {
                if (this._player.shield > 0) {
                    this._player.shield--;
                }
            }

            const proceedHazardUpdate = this._hazards.spawnAsteroid(
                this._canvas.width,
                this._distance,
                this._player.x,
            );

            if (proceedHazardUpdate === true) {
                let adjustHazards = false;

                if (
                    this._distance > this._distanceMilestone &&
                    this._distanceMilestone < 5000 &&
                    this._hazards.asteroidSummonBasis > 40
                ) {
                    this._distanceMilestone += 100;
                    adjustHazards = true;
                }

                this._hazards.adjustSpawnSettings(
                    adjustHazards,
                    this._distanceMilestone,
                );
            }

            if (this._hazards.asteroid.length > 0) {
                const spliceAsteroid = [];

                for (const asteroid of this._hazards.asteroid) {
                    asteroid.y += asteroid.speed;

                    const { blocked, collided } =
                        this._hazards.collideWithAsteroid(
                            this._player.shield,
                            this._player.shieldOn,
                            this._player.x,
                            this._player.y,
                            asteroid,
                        );

                    if (blocked === true) {
                        this._player.shield = this._player.shield - 50 || 0;
                        await SFX.disintegrate.play();
                    } else {
                        if (collided === true) {
                            this._player.collision = 1;
                        }

                        if (asteroid.y < this._canvas.height) {
                            spliceAsteroid.push(asteroid);
                        }
                    }
                }

                this._hazards.asteroid = spliceAsteroid;
            }

            this._hazards.updateDeathParticles();

            const activeComet = this._hazards.spawnComet(
                this._canvas.height,
                this._distance,
                this._player.x,
            );

            if (activeComet === true) {
                const collided = this._hazards.collideWithComet(
                    this._player.collision,
                    this._player.x,
                    this._player.y,
                );

                if (collided === true) {
                    this._player.collision = 1;
                }
            }

            const gammaState = this._hazards.updateGammaRay(
                this._canvas.height,
                this._canvas.width,
                this._distance,
            );

            if (gammaState === 'starting') {
                await SFX.gammaRay.play();
            } else if (gammaState === 'expanding') {
                const collided = this._hazards.collideWithGammaRay(
                    this._player.x,
                );

                if (collided === true) {
                    this._player.collision = 1;
                }

                if (this._hazards.gammaRayExpansion === 120) {
                    await SFX.dissipate.play();
                }
            }

            if (this._player.collision === 0) {
                this._distance++;

                if (this._distance === 5000) {
                    this._gameOver = 1;
                }

                if (this._distance < 3500) {
                    if (this._wave._curveIn > 0) {
                        this._wave._curveIn--;
                    }
                }
            } else {
                this._player.updateDeathState();

                if (this._player.deathDelay === 74) {
                    await SFX.explosion.play();
                }
            }
        }

        if (this._gameOver === 0) {
            if (this._gameStart !== 0) {
                if (this._wave._curveIn > 0) {
                    this._wave._curveIn -= 2;
                }
            }
        } else {
            if (this._wave._curveIn < 100) {
                this._wave._curveIn += 2;
            }

            if (this._cutscenes.ending < 150) {
                this._cutscenes.ending++;
            }
        }

        if (this._player.curShieldOn !== 0) {
            if (
                this._player.curShieldOn - this._player.shield > 50 ||
                this._player.shield <= 0
            ) {
                this._player.curShieldOn = 0;
            }
        } else {
            this._player.shieldOn = 0;
        }

        if (this._cutscenes.load === 1 && this._cutscenes.init < 600) {
            this._cutscenes.init++;

            if (this._cutscenes.init === 100) {
                await SFX.warning.play();
            }

            this._cutscenes.updateWarningCutscene();
        } else if (this._cutscenes.init >= 600 && this._gameStart === 0) {
            this._gameStart = 1;
            await SFX.bgm.play();
            SFX.bgm.loop = true;
        }

        if (this._allowStart === 1 && this._gameStart === 0) {
            if (performance.now() - this._beginTime > 24) {
                this._cutscenes.load = 1;
            }
        }

        setTimeout(async (): Promise<void> => {
            await this.update();
        }, 24);
    }

    render(): void {
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
                this._particles.renderShipExplosions(
                    this._ctx,
                    this._player.deathDelay,
                    this._player.x,
                    this._player.y,
                );
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

        let addMargin = 16;
        let fontXmargin = 40;
        const stringNum: string = this._distance.toString();
        for (let i = 0, len = stringNum.length; i < len; i += 1) {
            addMargin += 2;
            fontXmargin += addMargin;

            this._ctx.save();
            this._ctx.shadowBlur = 10;
            this._ctx.globalAlpha = this._gameStart === 1 ? 1 : 0;
            this._ctx.shadowColor = 'white';

            this._ctx.drawImage(
                IMG.numbers,
                Number(stringNum.charAt(i)) * 9,
                0,
                9,
                9,
                fontXmargin,
                30,
                24,
                24,
            );

            this._ctx.restore();
        }

        this._cutscenes.render(
            this._ctx,
            this._canvas.width,
            this._canvas.height,
            this._gameOver,
            this._player.dead,
        );
    }
}

export default Netervati;
