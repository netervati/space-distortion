export default class Wave {
    _curveIn: number
    _curvePoints: number[][]

    constructor() {
        this._curveIn = 100;
        this._curvePoints = [
            [100, 0, 1],
            [50, 1, 0],
            [25, 1, 0],
            [60, 1, 1]
        ];
    }

    update() {
        let curveTransitionLength = this._curvePoints.length;

        for (let tx = 0; tx < curveTransitionLength; tx++){
            if (
                this._curvePoints[tx][0] > 0 &&
                this._curvePoints[tx][1] != this._curvePoints[tx][2]
            ) {
                this._curvePoints[tx][0] --;
            }
            else if (
                this._curvePoints[tx][0] < 100 &&
                this._curvePoints[tx][1] == this._curvePoints[tx][2]
            ) {
                this._curvePoints[tx][0] ++;
            }
            if (this._curvePoints[tx][0] == 100) {
                this._curvePoints[tx][1] == 1
                    ? this._curvePoints[tx][1] = 0
                    : this._curvePoints[tx][1] = 1;
            }
            else if (this._curvePoints[tx][0] == 0){
                this._curvePoints[tx][1] == 1
                    ? this._curvePoints[tx][1] = 0
                    : this._curvePoints[tx][1] = 1;
            }
        }
    }

    render(
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number
    ) {
        let sides = 2;
        ctx.save();
        while(sides > 0){
            let curveWidthA = this._curvePoints[3][0] - this._curveIn > 0
                ? this._curvePoints[3][0] - this._curveIn : 0;
            let curveWidthB = this._curvePoints[2][0] - this._curveIn > 0
                ? this._curvePoints[2][0] - this._curveIn : 0;
            let curveWidthC = this._curvePoints[1][0] - this._curveIn > 0
                ? this._curvePoints[1][0] - this._curveIn : 0 ;
            let curveWidthD = this._curvePoints[0][0] - this._curveIn > 0
                ? this._curvePoints[0][0] - this._curveIn : 0;
            let curveWidthE = 0;

            if (sides > 1){
                curveWidthA = canvasWidth - curveWidthA;
                curveWidthB = canvasWidth - curveWidthB;
                curveWidthC = canvasWidth - curveWidthC;
                curveWidthD = canvasWidth - curveWidthD;
                curveWidthE = canvasWidth - curveWidthE;
            }

            ctx.beginPath();
            ctx.shadowBlur = 5;
            ctx.shadowColor = "white";
            ctx.moveTo(curveWidthA, canvasHeight);
            ctx.bezierCurveTo(curveWidthB, 425, curveWidthC, 225, curveWidthD, 0);
            ctx.lineTo(curveWidthE, 0);  
            ctx.lineTo(curveWidthE, canvasHeight);  
            ctx.lineTo(curveWidthA, canvasHeight);   
            ctx.strokeStyle = "white";
            ctx.lineWidth = 100 - this._curveIn < 10 ? 100 - this._curveIn : 10;
            ctx.stroke();
            ctx.fillStyle = "#0A0710";
            ctx.fill();

            sides--;
        }
        ctx.restore();
    }
}

