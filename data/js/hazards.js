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
    Hazards.prototype.spawnAsteroid = function (canvasWidth, distance, playerX) {
        if (distance < 4900) {
            this.asteroidSummon--;
            if (this.asteroidSummon === 0) {
                var decideDistance = Math.floor(Math.random() * 2) + 1;
                var randomX = decideDistance == 1
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
    };
    Hazards.prototype.spawnComet = function (canvasHeight, distance, playerX) {
        var activeComet = false;
        if (this.cometSummon > 0) {
            this.cometSummon--;
        }
        else {
            if (this.comet.y === 0) {
                if (distance < 4900) {
                    this.comet.x =
                        Math.floor(Math.random() * (playerX + 40 - playerX)) +
                            playerX;
                    this.comet.y += this.cometSpeedFactor;
                }
            }
            else if (this.comet.y < canvasHeight + 200) {
                this.comet.y += this.cometSpeedFactor;
                if (this.comet.trail > 20 && this.comet.trailSwitch === 0) {
                    this.comet.trail -= 2;
                }
                else if (this.comet.trail < 40 &&
                    this.comet.trailSwitch === 1) {
                    this.comet.trail += 2;
                }
                else if (this.comet.trail === 20) {
                    this.comet.trailSwitch = 1;
                }
                else if (this.comet.trail === 40) {
                    this.comet.trailSwitch = 0;
                }
                activeComet = true;
            }
            else {
                if (distance < 4900) {
                    this.cometSummon = this.cometSummonBasis;
                }
                this.comet.y = 0;
            }
        }
        return activeComet;
    };
    Hazards.prototype.updateDeathParticles = function () {
        if (this.asteroidDeathParticles.length > 0) {
            var spliceAsteroidDeathParticles_1 = [];
            this.asteroidDeathParticles.forEach(function (adp) {
                if (adp.life > 0) {
                    adp.life--;
                    spliceAsteroidDeathParticles_1.push(adp);
                }
            });
            this.asteroidDeathParticles = spliceAsteroidDeathParticles_1;
        }
    };
    Hazards.prototype.adjustSpawnSettings = function (adjust, distanceMilestone) {
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
    };
    Hazards.prototype.collideWithAsteroid = function (playerShield, shieldOn, playerX, playerY, asteroid) {
        var blocked = false;
        var collided = false;
        if (playerShield > 50 && shieldOn === 1) {
            if (playerY - 30 <= asteroid.y + 25 &&
                asteroid.y + 25 <= playerY + 10) {
                if (playerX - 18 <= asteroid.x - 25 &&
                    asteroid.x - 25 <= playerX + 63) {
                    blocked = true;
                }
                else if (playerX - 18 >= asteroid.x - 25 &&
                    playerX - 18 <= asteroid.x + 35) {
                    blocked = true;
                }
            }
        }
        if (blocked === true) {
            this.asteroidDeathParticles.push({
                x: asteroid.x,
                y: asteroid.y,
                life: 30,
            });
        }
        else {
            if (playerY <= asteroid.y + 25 && asteroid.y + 25 <= playerY + 60) {
                if (playerX - 2 <= asteroid.x - 25 &&
                    asteroid.x - 25 <= playerX + 40) {
                    collided = true;
                }
                else if (playerX - 2 >= asteroid.x - 25 &&
                    playerX - 2 <= asteroid.x + 35) {
                    collided = true;
                }
            }
        }
        return { blocked: blocked, collided: collided };
    };
    Hazards.prototype.collideWithComet = function (playerCollision, playerX, playerY) {
        var collided = false;
        if (playerY <= this.comet.y + this.comet.trail &&
            this.comet.y + this.comet.trail <= playerY + 60 &&
            playerCollision === 0) {
            if (playerX - 2 <= this.comet.x - this.comet.trail + 5 &&
                this.comet.x - this.comet.trail + 5 <= playerX + 40) {
                collided = true;
            }
            else if (playerX - 2 >= this.comet.x - this.comet.trail + 5 &&
                playerX - 2 <= this.comet.x + this.comet.trail - 5) {
                collided = true;
            }
        }
        return collided;
    };
    Hazards.prototype.reset = function () {
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
    };
    Hazards.prototype.render = function (ctx, canvasHeight) {
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
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 4;
                ctx.stroke();
                ctx.fillStyle = '#06030B';
                ctx.fill();
                ctx.restore();
            });
        }
        if (this.asteroidDeathParticles.length > 0) {
            this.asteroidDeathParticles.forEach(function (particle) {
                _this.asteroidDeathParticlesSpawn.forEach(function (adp) {
                    ctx.save();
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = 'yellow';
                    ctx.fillStyle = 'white';
                    var particleLife = 30 - particle.life;
                    ctx.fillRect(particle.x + particleLife * adp[2] * adp[0], particle.y + adp[1], 3, 3);
                    ctx.restore();
                });
            });
        }
        if (this.comet.y > 0 && this.comet.y < canvasHeight + 200) {
            ctx.save();
            ctx.beginPath();
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'blue';
            var trail = this.comet.trail;
            ctx.arc(this.comet.x, this.comet.y, trail, 0, 1 * Math.PI);
            ctx.quadraticCurveTo(this.comet.x - trail + 5, this.comet.y - 10, this.comet.x, this.comet.y - 130);
            ctx.quadraticCurveTo(this.comet.x + trail - 5, this.comet.y - 10, this.comet.x + trail, this.comet.y);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.restore();
        }
    };
    return Hazards;
}());
export default Hazards;
