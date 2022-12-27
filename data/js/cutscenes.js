import { IMG } from './assets.js';
var Cutscenes = /** @class */ (function () {
    function Cutscenes() {
        this.load = 0;
        this.init = 0;
        this.warningTransition = 105;
        this.warningCurAlpha = 1;
        this.ending = 0;
    }
    Cutscenes.prototype.render = function (ctx, canvasWidth, canvasHeight, gameOver, playerDead) {
        var centerWidth = canvasWidth / 2;
        var centerHeight = canvasHeight / 2;
        if (playerDead === 1) {
            ctx.drawImage(IMG.restart, 0, 0, 112, 9, centerWidth - 112, centerHeight - 9, 218, 16);
        }
        if (this.load === 0) {
            ctx.drawImage(IMG.title, 0, 0, 186, 22, centerWidth - 186, centerHeight - 50, 372, 44);
            ctx.drawImage(IMG.begin, 0, 0, 125, 9, centerWidth - 125, centerHeight + 10, 250, 16);
        }
        if (this.init >= 100 && this.init < 188) {
            ctx.save();
            ctx.globalAlpha = this.warningCurAlpha;
            ctx.drawImage(IMG.warning, 0, 0, 56, 18, centerWidth - 56, centerHeight - 9, 112, 40);
            ctx.restore();
        }
        var dWidth = function (frameCount) {
            var modFrameCount = 9 * (frameCount + 1);
            return modFrameCount * 2;
        };
        if (this.init >= 200 && this.init < 350) {
            var frameCount = 0;
            if (this.init < 258) {
                if (this.init % 2 > 0) {
                    frameCount++;
                }
                frameCount = this.init - 200;
                frameCount /= 2;
            }
            else {
                frameCount = 258;
            }
            ctx.drawImage(IMG.introa, 0, 0, 9 * (frameCount + 1), 26, centerWidth - 125, centerHeight - 13, dWidth(frameCount), 40);
        }
        if (this.init >= 360 && this.init < 470) {
            var frameCountB = 0;
            if (this.init < 470) {
                if (this.init % 2 > 0) {
                    frameCountB++;
                }
                frameCountB = this.init - 360;
                frameCountB /= 2;
            }
            else {
                frameCountB = 470;
            }
            ctx.drawImage(IMG.introb, 0, 0, 9 * (frameCountB + 1), 26, centerWidth - 141, centerHeight - 13, dWidth(frameCountB), 40);
        }
        if (this.init >= 480 && this.init < 600) {
            var frameCountC = 0;
            if (this.init < 600) {
                if (this.init % 2 > 0) {
                    frameCountC++;
                }
                frameCountC = this.init - 480;
                frameCountC /= 2;
            }
            else {
                frameCountC = 600;
            }
            ctx.drawImage(IMG.introc, 0, 0, 9 * (frameCountC + 1), 26, centerWidth - 125, centerHeight - 13, dWidth(frameCountC), 40);
        }
        if (gameOver === 1) {
            if (this.ending < 100) {
                var frameCountD = 0;
                if (this.ending < 600) {
                    if (this.ending % 2 > 0) {
                        frameCountD++;
                    }
                    frameCountD = this.ending;
                    frameCountD /= 2;
                }
                else {
                    frameCountD = 100;
                }
                ctx.drawImage(IMG.end, 0, 0, 9 * (frameCountD + 1), 26, centerWidth - 125, centerHeight - 13, dWidth(frameCountD), 40);
            }
            if (this.ending >= 150) {
                ctx.drawImage(IMG.thanks, 0, 0, 120, 26, centerWidth - 120, centerHeight - 9, 240, 40);
            }
        }
    };
    Cutscenes.prototype.updateWarningCutscene = function () {
        if (this.init >= 100 &&
            this.init < 188 &&
            this.init > this.warningTransition) {
            this.warningTransition += 8;
            if (this.warningCurAlpha === 1) {
                this.warningCurAlpha = 0.5;
            }
            else if (this.warningCurAlpha === 0.5) {
                this.warningCurAlpha = 0.075;
            }
            else {
                this.warningCurAlpha = 1;
            }
        }
    };
    return Cutscenes;
}());
export default Cutscenes;
