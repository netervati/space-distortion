type Position = { x: number; y: number };
type AsteroidStructure = Position & { speed: number };
type ADPStructure = Position & { life: number };
type CometStructure = Position & { trail: number; trailSwitch: number };

export default class Hazards {
    asteroid: AsteroidStructure[];
    asteroidSummon: number;
    asteroidSummonBasis: number;
    asteroidSpeedFactor: number;
    asteroidDeathParticles: ADPStructure[];
    readonly asteroidDeathParticlesSpawn: number[][];
    comet: CometStructure;
    cometSummon: number;
    cometSummonBasis: number;
    cometSpeedFactor: number;

    constructor() {
        this.asteroid = [];
        this.asteroidSummon = 300;
        this.asteroidSummonBasis = 300;
        this.asteroidSpeedFactor = 6;
        this.asteroidDeathParticles = [];
        this.asteroidDeathParticlesSpawn = [
            [1, -5, 1.5],
            [-1, 5, 1.5],
            [1, -2, 0.75],
            [-1, 2, 0.75],
            [1, -5, 3],
            [-1, 5, 3],
            [1, -3, 2],
            [-1, 3, 2],
            [1, -6, 6],
            [-1, 3, 12],
            [1, 0, 5],
            [-1, 0, 5],
            [1, -3, 10],
            [-1, 3, 10],
            [1, 2, 6],
            [-1, -4, 6],
        ];
        this.comet = {
            x: 0,
            y: 0,
            trail: 40,
            trailSwitch: 0,
        };
        this.cometSummon = 400;
        this.cometSummonBasis = 400;
        this.cometSpeedFactor = 12;
    }

    update(canvasWidth: number, distance: number, playerX: number): boolean {
        if (distance < 4900) {
            this.asteroidSummon--;

            if (this.asteroidSummon === 0) {
                const decideDistance = Math.floor(Math.random() * 2) + 1;
                const randomX =
                    decideDistance == 1
                        ? playerX
                        : Math.random() * (canvasWidth - 200 - 100) + 100;
                this.asteroid.push({
                    x: randomX,
                    y: 0,
                    speed: this.asteroidSpeedFactor,
                });

                return true;
            }
        }

        return false;
    }

    adjustDifficulty(adjust: boolean, distanceMilestone: number): void {
        if (adjust === true) {
            this.asteroidSummonBasis -= 25;

            if (distanceMilestone > 1000 && this.asteroidSpeedFactor < 18) {
                this.asteroidSpeedFactor++;
                this.cometSpeedFactor++;
            }

            if (this.cometSummonBasis > 100) {
                this.cometSummonBasis -= 50;
            }
        }

        this.asteroidSummon = this.asteroidSummonBasis;
    }

    reset(): void {
        this.asteroid = [];
        this.asteroidSummon = 300;
        this.asteroidSummonBasis = 300;
        this.asteroidSpeedFactor = 6;
        this.asteroidDeathParticles = [];
        this.comet = {
            x: 0,
            y: 0,
            trail: 40,
            trailSwitch: 0,
        };
        this.cometSummon = 400;
        this.cometSummonBasis = 400;
        this.cometSpeedFactor = 12;
    }

    render(ctx: CanvasRenderingContext2D, canvasHeight: number): void {
        if (this.asteroid.length > 0) {
            this.asteroid.forEach((asteroid) => {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(asteroid.x - 25, asteroid.y);
                ctx.lineTo(asteroid.x - 25, asteroid.y + 15);
                ctx.quadraticCurveTo(
                    asteroid.x - 15,
                    asteroid.y + 18,
                    asteroid.x - 10,
                    asteroid.y + 20,
                );
                ctx.quadraticCurveTo(
                    asteroid.x,
                    asteroid.y + 25,
                    asteroid.x + 5,
                    asteroid.y + 25,
                );
                ctx.quadraticCurveTo(
                    asteroid.x + 20,
                    asteroid.y + 25,
                    asteroid.x + 30,
                    asteroid.y,
                );
                ctx.quadraticCurveTo(
                    asteroid.x + 35,
                    asteroid.y - 10,
                    asteroid.x,
                    asteroid.y - 15,
                );
                ctx.quadraticCurveTo(
                    asteroid.x - 20,
                    asteroid.y - 10,
                    asteroid.x - 25,
                    asteroid.y,
                );
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.fillStyle = '#06030B';
                ctx.fill();
                ctx.restore();
            });
        }

        if (this.asteroidDeathParticles.length > 0) {
            this.asteroidDeathParticles.forEach((particle) => {
                this.asteroidDeathParticlesSpawn.forEach((adp) => {
                    ctx.save();
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = 'yellow';
                    ctx.fillStyle = 'white';
                    const particleLife = 30 - particle.life;
                    ctx.fillRect(
                        particle.x + particleLife * adp[2] * adp[0],
                        particle.y + adp[1],
                        3,
                        3,
                    );
                    ctx.restore();
                });
            });
        }

        if (this.comet.y > 0 && this.comet.y < canvasHeight + 200) {
            ctx.save();
            ctx.beginPath();
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'blue';
            const trail = this.comet.trail;
            ctx.arc(this.comet.x, this.comet.y, trail, 0, 1 * Math.PI);
            ctx.quadraticCurveTo(
                this.comet.x - trail + 5,
                this.comet.y - 10,
                this.comet.x,
                this.comet.y - 130,
            );
            ctx.quadraticCurveTo(
                this.comet.x + trail - 5,
                this.comet.y - 10,
                this.comet.x + trail,
                this.comet.y,
            );
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.restore();
        }
    }
}