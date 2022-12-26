var Player = /** @class */ (function () {
    function Player(spawnX, spawnY) {
        this._playerSpawnX = spawnX;
        this._playerSpawnY = spawnY;
        this.x = this._playerSpawnX;
        this.y = this._playerSpawnY;
        this.shield = 100;
        this.shieldOn = 0;
        this.curShieldOn = 0;
        this.collision = 0;
        this.deathDelay = 75;
        this.dead = 0;
    }
    Player.prototype.reset = function () {
        this.x = this._playerSpawnX;
        this.y = this._playerSpawnY;
        this.shield = 100;
        this.shieldOn = 0;
        this.curShieldOn = 0;
        this.collision = 0;
        this.deathDelay = 75;
        this.dead = 0;
    };
    Player.prototype.updateDeathState = function () {
        if (this.deathDelay > 0) {
            this.deathDelay--;
            if (this.deathDelay < 25) {
                this.y += 6;
            }
            else if (this.deathDelay < 15) {
                this.y += 15;
            }
        }
        else {
            this.dead = 1;
        }
    };
    return Player;
}());
export default Player;
