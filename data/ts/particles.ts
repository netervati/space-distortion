export default class Particles {
    starPositions: Array<Array<number>>;
    __defaultShipBoosters: Array<Array<number>>
    __defaultShipExplosions: Array<Array<number>>
    shipBoosters: Array<Array<number>>
    shipExplosions: Array<Array<number>>
 
    constructor(playerX: number) {
        this.starPositions = [
            [100, 20],
            [400, 500],
            [600, 120],
            [300, 640],
            [130, 600],
            [210, 300],
            [425, 360],
            [600, 1],
            [340, 200],
        ];

        this.__defaultShipBoosters = [
            [playerX, 12, 15, 35, 17],
            [playerX, 5, 15, 35, 15],
            [playerX, 18, 15, 45, 18],
            [playerX, 1, 10, 40, 13],
            [playerX, 1, 12, 50, 15],
            [playerX, 1, 20, 25, 14],
            [playerX, 1, 20, 20, 13],
            [playerX, 1, 20, 20, 13],
            [playerX, 1, 18, 17, 20],
            [playerX, 1, 20, 20, 10]
        ];

        this.__defaultShipExplosions = [
            [25,40,75,68,3,1,68,40,50,1],
            [12,30,70,63,3,1,63,38,45,1],
            [8,50,73,65,3,1,65,40,47,1],
            [30,30,72,64,3,1,64,39,46,1],
            [45,50,65,56,3,1,56,45,50,1],
            [18,40,65,55,1,0,55,38,43,0.75],
            [35,50,60,50,1,0,50,32,37,0.30],
            [40,20,63,53,1,0,53,36,41,0.75],
            [0,4,58,48,1,0,48,30,35,0.30],
            [25,15,66,56,1,0,56,39,44,0.75],
            [-10,58,60,50,1,0,50,35,40,0.30],
            [-5,30,62,52,1,0,52,37,46,0.75]
        ];
        
        this.shipBoosters = this.__defaultShipBoosters;
        this.shipExplosions = this.__defaultShipExplosions;
    }

    update(canvasHeight: number, playerX: number) {
        let starPositionsLength = this.starPositions.length;

        for (let sp = 0; sp < starPositionsLength; sp++){
            if (this.starPositions[sp][1] + 8 < canvasHeight){
                this.starPositions[sp][1] += 8;
                continue;
            }

            if (this.starPositions[sp][1] === canvasHeight){
                this.starPositions[sp][1] = 0;
                continue;
            }
            
            this.starPositions[sp][1] = canvasHeight;
        }

        let shipBoostersLength = this.shipBoosters.length;
        for (let pb = 0; pb < shipBoostersLength; pb++){
            if (this.shipBoosters[pb][0] < (playerX + this.shipBoosters[pb][4]) - 25 ||
                this.shipBoosters[pb][0] > (playerX + this.shipBoosters[pb][4]) + 15) {
                if ((playerX + this.shipBoosters[pb][4]) > this.shipBoosters[pb][0]) {
                    this.shipBoosters[pb][0] += 7;
                } else {
                    this.shipBoosters[pb][0] -= 7;
                }
            }
            else if (this.shipBoosters[pb][0] < (playerX + this.shipBoosters[pb][4]) - 15 ||
                     this.shipBoosters[pb][0] > (playerX + this.shipBoosters[pb][4]) + 5) {
                if ((playerX + this.shipBoosters[pb][4]) > this.shipBoosters[pb][0]) {
                    this.shipBoosters[pb][0] += 3;
                } else {
                    this.shipBoosters[pb][0] -= 3;
                }
            }
            else if (this.shipBoosters[pb][0] < playerX + this.shipBoosters[pb][4] - 5 ||
                     this.shipBoosters[pb][0] > playerX + this.shipBoosters[pb][4]) {
                if ((playerX + this.shipBoosters[pb][4]) > this.shipBoosters[pb][0]) {
                    this.shipBoosters[pb][0] += 1;
                } else {
                    this.shipBoosters[pb][0] -= 1;
                }
            }

            if (this.shipBoosters[pb][1] < this.shipBoosters[pb][2]){
                this.shipBoosters[pb][1]++;
            }
            else{
                this.shipBoosters[pb][1] = 0;
            }
        }

    }

    renderStarPositions(ctx: CanvasRenderingContext2D) {
        this.starPositions.forEach(star => {
            ctx.beginPath();
            ctx.arc(star[0], star[1], 1, 0, 2*Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
        });
    }

    renderShipBoosters(ctx: CanvasRenderingContext2D, playerY: number) {
        this.shipBoosters.forEach(booster =>{
            ctx.beginPath();
            ctx.arc(
                booster[0] + 10, (playerY + 45 + booster[1]) + booster[3],
                (booster[2] - booster[1]) / 4 + 2, 0, 2*Math.PI
            );
            ctx.fillStyle = "white";
            ctx.fill();
        });
    }

    renderShipExplosions(
        ctx: CanvasRenderingContext2D,
        playerDeathDelay: number,
        playerX: number,
        playerY: number
    ) {
        this.shipExplosions.forEach(explosion => {
            if (explosion[3] < playerDeathDelay && explosion[2] >= playerDeathDelay){
                ctx.beginPath();
                ctx.arc(
                    playerX + explosion[0], playerY + explosion[1],
                    (explosion[2] - playerDeathDelay) * explosion[4],
                    0, 2 * Math.PI
                );
                ctx.fillStyle = explosion[5] == 0 ? "white" : "#9EA0A2";
                ctx.fill();
            }
            else if (explosion[6] >= playerDeathDelay && explosion[8] < playerDeathDelay){
                ctx.beginPath();
                ctx.arc(
                    playerX + explosion[0], playerY + explosion[1],
                    (playerDeathDelay - explosion[7]) * explosion[9],
                    0, 2 * Math.PI
                );
                ctx.fillStyle = explosion[5] == 0 ? "white" : "#9EA0A2";
                ctx.fill();
            }
        });

    }

    reset() {
        this.shipBoosters = this.__defaultShipBoosters;
    }
}

