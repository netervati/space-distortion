var Cutscenes = /** @class */ (function () {
    function Cutscenes() {
        this.load = 0;
        this.init = 0;
        this.warningTransition = 105;
        this.warningCurAlpha = 1;
        this.ending = 0;
    }
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
