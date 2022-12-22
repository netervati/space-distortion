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

    update(): void {
        const curveTransitionLength: number = this._curvePoints.length;

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
    ): void {
        const setCurveWidth: Function = (
            point: number,
            subtractCanvasWidth: boolean
        ): number => {
            let curvePoint: number = Math.max(0, point - this._curveIn);

            if (subtractCanvasWidth === true) {
                curvePoint = canvasWidth - curvePoint;
            }

            return curvePoint;
        }

        let sides: number = 2;
        ctx.save();

        while(sides > 0){
            const toSubtract: boolean = sides > 1;
            const curveWidthA: number = setCurveWidth(this._curvePoints[3][0], toSubtract);
            const curveWidthB: number = setCurveWidth(this._curvePoints[2][0], toSubtract);
            const curveWidthC: number = setCurveWidth(this._curvePoints[1][0], toSubtract);
            const curveWidthD: number = setCurveWidth(this._curvePoints[0][0], toSubtract);
            const curveWidthE: number = setCurveWidth(0, toSubtract);

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

