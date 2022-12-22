var Hazards = /** @class */ (function () {
    function Hazards() {
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
            [-1, -4, 6]
        ];
    }
    Hazards.prototype.reset = function () {
        this.asteroid = [];
        this.asteroidSummon = 300;
        this.asteroidSummonBasis = 300;
        this.asteroidSpeedFactor = 6;
        this.asteroidDeathParticles = [];
    };
    Hazards.prototype.renderAsteroids = function (ctx) {
        var _this = this;
        if (this.asteroid.length > 0) {
            this.asteroid.forEach(function (asteroid) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(asteroid.x - 25, asteroid.y);
                ctx.lineTo(asteroid.x - 25, asteroid.y + 15);
                ctx.quadraticCurveTo(asteroid.x - 15, asteroid.y + 18, asteroid.x - 10, asteroid.y + 20);
                ctx.quadraticCurveTo(asteroid.x, asteroid.y + 25, asteroid.x + 5, asteroid.y + 25);
                ctx.quadraticCurveTo(asteroid.x + 20, asteroid.y + 25, asteroid.x + 30, asteroid.y);
                ctx.quadraticCurveTo(asteroid.x + 35, asteroid.y - 10, asteroid.x, asteroid.y - 15);
                ctx.quadraticCurveTo(asteroid.x - 20, asteroid.y - 10, asteroid.x - 25, asteroid.y);
                ctx.strokeStyle = "white";
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.fillStyle = "#06030B";
                ctx.fill();
                ctx.restore();
            });
        }
        if (this.asteroidDeathParticles.length > 0) {
            this.asteroidDeathParticles.forEach(function (particle) {
                _this.asteroidDeathParticlesSpawn.forEach(function (adp) {
                    ctx.save();
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "yellow";
                    ctx.fillStyle = "white";
                    ctx.fillRect(particle.x + ((30 - particle.life) * adp[2]) * adp[0], particle.y + adp[1], 3, 3);
                    ctx.restore();
                });
            });
        }
    };
    return Hazards;
}());
export default Hazards;
