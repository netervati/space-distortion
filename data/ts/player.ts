export default class Player {
    _playerSpawnX: number;
    _playerSpawnY: number;
    x: number;
    y: number;
    shield: number;
    shieldOn: number;
    curShieldOn: number;
    collision: number;
    deathDelay: number;
    dead: number;

    constructor(spawnX: number, spawnY: number) {
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

    reset() {
        this.x = this._playerSpawnX;
        this.y = this._playerSpawnY;
        this.shield = 100;
        this.shieldOn = 0;
        this.curShieldOn = 0;
        this.collision = 0;
        this.deathDelay = 75;
        this.dead = 0;
    }
}
