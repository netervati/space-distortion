export default class Player {
    _spawnX: number;
    _spawnY: number;
    x: number;
    y: number;
    shield: number;
    shieldOn: number;
    curShieldOn: number;
    collision: number;
    deathDelay: number;
    dead: number;

    constructor(spawnX: number, spawnY: number) {
        this._spawnX = spawnX;
        this._spawnY = spawnY;
        this.x = this._spawnX;
        this.y = this._spawnY;
        this.shield = 100;
        this.shieldOn = 0;
        this.curShieldOn = 0;
        this.collision = 0;
        this.deathDelay = 75;
        this.dead = 0;
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        const upward = this.y - 10;

        ctx.beginPath();
        ctx.moveTo(this.x + 18, this.y - 5);
        ctx.lineTo(this.x - 15, upward + 50);
        ctx.lineTo(this.x - 25, upward + 50);
        ctx.lineTo(this.x - 40, upward + 70);
        ctx.lineTo(this.x + 18, upward + 70);
        ctx.lineTo(this.x + 18, upward + 80);
        ctx.lineTo(this.x + 22, upward + 80);
        ctx.lineTo(this.x + 22, upward + 70);
        ctx.lineTo(this.x + 80, upward + 70);
        ctx.lineTo(this.x + 65, upward + 50);
        ctx.lineTo(this.x + 55, upward + 50);
        ctx.lineTo(this.x + 22, this.y - 5);
        ctx.lineTo(this.x + 17, this.y - 5);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = '#06030B';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 20);
        ctx.lineTo(this.x, this.y + 60);
        ctx.quadraticCurveTo(this.x + 5, this.y + 64, this.x + 10, this.y + 60);
        ctx.quadraticCurveTo(
            this.x + 20,
            this.y + 68,
            this.x + 30,
            this.y + 60,
        );
        ctx.quadraticCurveTo(
            this.x + 35,
            this.y + 64,
            this.x + 40,
            this.y + 60,
        );
        ctx.lineTo(this.x + 40, this.y + 20);
        ctx.lineTo(this.x + 25, this.y + 20);
        ctx.lineTo(this.x + 25, this.y);
        ctx.lineTo(this.x + 15, this.y);
        ctx.lineTo(this.x + 15, this.y + 20);
        ctx.lineTo(this.x - 1.75, this.y + 20);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = '#0A0710';
        ctx.fill();
        ctx.restore();

        if (this.shield > 0 && this.shieldOn === 1) {
            ctx.save();
            ctx.globalAlpha =
                this.shield > 50 ? 1 : this.shield > 30 ? 0.1 : 0.05;
            ctx.beginPath();
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'yellow';
            ctx.moveTo(this.x - 15, this.y - 30);
            ctx.lineTo(this.x - 18, this.y - 28);
            ctx.lineTo(this.x + 63, this.y - 28);
            ctx.lineTo(this.x + 60, this.y - 30);
            ctx.lineTo(this.x - 16, this.y - 30);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.restore();
        }
    }

    reset(): void {
        this.x = this._spawnX;
        this.y = this._spawnY;
        this.shield = 100;
        this.shieldOn = 0;
        this.curShieldOn = 0;
        this.collision = 0;
        this.deathDelay = 75;
        this.dead = 0;
    }

    updateDeathState(): void {
        if (this.deathDelay > 0) {
            this.deathDelay--;

            if (this.deathDelay < 25) {
                this.y += 6;
            } else if (this.deathDelay < 15) {
                this.y += 15;
            }
        } else {
            this.dead = 1;
        }
    }
}
