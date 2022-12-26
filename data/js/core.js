import Hazards from './hazards.js';
import Particles from './particles.js';
import setStage from './stage.js';
import Wave from './wave.js';
import { IMG, SFX } from './assets.js';


class Netervati{
    constructor(){
        this._canvas = setStage();
        this._ctx = this._canvas.getContext("2d");

        this._allowStart = 0;
        this._gameStart = 0;
        this._loadCutscene = 0;
        this._initialCutscene = 0;
        this._warningTransition = 105;
        this._warningCurAlpha = 1;
        this._playBgm = 0;
        this._endingCutscene = 0;
        this._gameOver = 0;

        this._playerX = (this._canvas.width / 2) - 25;
        this._playerY = this._canvas.height - 150;
        this._playerShield = 100;
        this._shieldOn = 0;
        this._curShieldOn = 0;
        this._playerCollision = 0;
        this._playerDeathDelay = 75;
        this._playerDead = 0;
        this._distance = 0;
        this._distanceMilestone = 100;

        this._particles = new Particles(this._playerX);
        this._wave = new Wave();
        this._hazards = new Hazards();

        this.update();
    }
    beginGame(){
        this._beginTime = performance.now();
        this._allowStart = 1;
    }
    reload(){
        this._particles.reset();
        this._hazards.reset();

        this._gameOver = 0;
        this._playerX = (this._canvas.width / 2) - 25;
        this._playerY = this._canvas.height - 150;
        this._playerShield = 100;
        this._shieldOn = 0;
        this._curShieldOn = 0;
        this._playerCollision = 0;
        this._playerDeathDelay = 75;
        this._playerDead = 0;
        this._distance = 0;
        this._distanceMilestone = 100;
        SFX["gammaRay"].pause();
        SFX["gammaRay"].currentTime = 0;
    }
    logKey(pv){
        if (this._playerCollision == 0){
            if (pv["type"] == "movement"){
                if (pv["direction"] == "right"){
                    if (this._playerX + 3 + 16 < this._canvas.width - 25){
                        this._playerX+= 3;
                    }
                }
                else if (pv["direction"] == "left"){
                    if (this._playerX - 3 > 0){
                        this._playerX -= 3;
                    }
                }
            }
            else if (pv["type"] == "shield"){
                if (this._shieldOn == 0 && this._gameStart == 1 && this._distance < 4900){
                    this._shieldOn = 1;
                    if (this._playerShield > 0){
                        this._playerShield--;
                        this._curShieldOn = this._playerShield;
                        SFX["shield"].play();
                    }
                }
            }
        }
    }
    async update(){
        this._wave.update();
        this._particles.update(this._canvas.height, this._playerX);

        await this.render();

        if (this._gameStart == 1 && this._gameOver == 0){
            if (this._shieldOn == 0){
                if (this._playerShield < 100){
                    this._playerShield+=0.25;
                }
            }
            else{
                if (this._playerShield > 0){
                    this._playerShield--;
                }
            }

            const proceedHazardUpdate = this._hazards.spawnAsteroid(
                this._canvas.width,
                this._distance,
                this._playerX
            )

            if (proceedHazardUpdate == true) {
                let adjustHazards = false;

                if (
                    this._distance > this._distanceMilestone
                    && this._distanceMilestone < 5000
                    && this._hazards.asteroidSummonBasis > 40
                ) {
                    this._distanceMilestone += 100;
                    adjustHazards = true;
                }

                this._hazards.adjustSpawnSettings(
                    adjustHazards,
                    this._distanceMilestone
                );
            }   

            if (this._hazards.asteroid.length > 0){
                const spliceAsteroid = [];

                for (const asteroid of this._hazards.asteroid) {
                    asteroid.y += asteroid.speed;

                    const { blocked, collided } = this._hazards.collideWithAsteroid(
                        this._playerShield,
                        this._shieldOn,
                        this._playerX,
                        this._playerY,
                        asteroid
                    );

                    if (blocked === true) {
                        this._playerShield = this._playerShield - 50 || 0;
                        SFX.disintegrate.play();
                    } else {
                        if (collided === true) {
                            this._playerCollision = 1;
                        }

                        if (asteroid.y < this._canvas.height){
                            spliceAsteroid.push(asteroid);
                        }
                    }

                }

                this._hazards.asteroid = spliceAsteroid;
            }

            this._hazards.updateDeathParticles();

            const activeComet = this._hazards.spawnComet(
                this._canvas.height,
                this._distance,
                this._playerX
            );

            if (activeComet === true) {
                const collided = this._hazards.collideWithComet(
                    this._playerCollision,
                    this._playerX,
                    this._playerY
                );

                if (collided === true) {
                    this._playerCollision = 1;
                }
            }

            const gammaState = this._hazards.updateGammaRay(
                this._canvas.height,
                this._canvas.width,
                this._distance
            );

            if (gammaState === 'starting') {
                SFX.gammaRay.play();
            } else if (gammaState === 'expanding') {
                const collided = this._hazards.collideWithGammaRay(this._playerX);

                if (collided === true) {
                    this._playerCollision = 1;
                }

                if (this._hazards.gammaRayExpansion === 120){
                    SFX.dissipate.play();
                }
            }

            if (this._playerCollision == 0){
                this._distance++;
                if (this._distance == 5000){
                    this._gameOver = 1;
                }
                if (this._distance < 3500){
                    if (this._wave._curveIn > 0){
                        this._wave._curveIn--;
                    }
                }
            }
            else{ 
                if (this._playerDeathDelay > 0){
                    this._playerDeathDelay--;
                    if (this._playerDeathDelay < 25){
                        this._playerY+=6;
                    }
                    else if (this._playerDeathDelay < 15){
                        this._playerY+=15;
                    }
                    if (this._playerDeathDelay == 74){
                        SFX["explosion"].play();
                    }
                }
                else{
                    this._playerDead = 1;
                }
            }
        }
        if (this._gameOver == 0){
            if (this._gameStart != 0){
                if (this._wave._curveIn > 0){
                    this._wave._curveIn-=2;
                }
            }
        }
        else{
            if (this._wave._curveIn < 100){
                this._wave._curveIn+=2;
            }
            if (this._endingCutscene < 150){
                this._endingCutscene++;
            }
        }
        if (this._curShieldOn != 0){
            if (this._curShieldOn - this._playerShield > 50 || this._playerShield <= 0){
                this._curShieldOn = 0;
            }
        }
        else{
            this._shieldOn = 0;
        }
        if (this._loadCutscene == 1 && this._initialCutscene < 600){
            this._initialCutscene++;
            if (this._initialCutscene == 100){
                SFX["warning"].play();
            }
            if (this._initialCutscene >= 100 && this._initialCutscene < 188 && this._initialCutscene > this._warningTransition){
                this._warningTransition += 8;
                if (this._warningCurAlpha == 1){
                    this._warningCurAlpha = 0.5;
                }
                else if (this._warningCurAlpha == 0.5){
                    this._warningCurAlpha = 0.075
                }
                else{
                    this._warningCurAlpha = 1;
                }
            }
        }
        else if (this._initialCutscene >= 600 && this._gameStart == 0){
            this._gameStart = 1;
            SFX["bgm"].play();
            SFX["bgm"].loop = true;
        }
        if (this._allowStart == 1 && this._gameStart == 0){
            if (performance.now() - this._beginTime > 24){
                this._loadCutscene = 1;
            }
        }
        setTimeout(()=>{
            this.update();
        },24);
    }
    async render(){
        this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height);
        this._ctx.imageSmoothingEnabled = false;

        this._particles.renderStarPositions(this._ctx);
        this._wave.render(this._ctx, this._canvas.width, this._canvas.height);
        this._hazards.renderGammaRay(this._ctx, this._canvas.height);

        if (this._playerDead == 0){
            if (this._playerCollision == 0){
                this._particles.renderShipBoosters(this._ctx, this._playerY);
            }

            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.moveTo(this._playerX+18,this._playerY - 5);
            this._ctx.lineTo(this._playerX-15,(this._playerY - 10) + 50);
            this._ctx.lineTo(this._playerX-25,(this._playerY - 10) + 50);
            this._ctx.lineTo(this._playerX-40,(this._playerY - 10) + 70);
            this._ctx.lineTo(this._playerX+18,(this._playerY - 10) + 70);
            this._ctx.lineTo(this._playerX+18,(this._playerY - 10) + 80);
            this._ctx.lineTo(this._playerX+22,(this._playerY - 10) + 80);
            this._ctx.lineTo(this._playerX+22,(this._playerY - 10) + 70);
            this._ctx.lineTo(this._playerX+80,(this._playerY - 10) + 70);
            this._ctx.lineTo(this._playerX+65,(this._playerY - 10) + 50);
            this._ctx.lineTo(this._playerX+55,(this._playerY - 10) + 50);
            this._ctx.lineTo(this._playerX+22,this._playerY - 5);
            this._ctx.lineTo(this._playerX+17,this._playerY - 5);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.fillStyle = "#06030B";
            this._ctx.fill();

            this._ctx.beginPath();
            this._ctx.moveTo(this._playerX,this._playerY + 20);
            this._ctx.lineTo(this._playerX,this._playerY + 60);
            this._ctx.quadraticCurveTo(this._playerX + 5, this._playerY+ 60 + 4, this._playerX + 10, this._playerY + 60);
            this._ctx.quadraticCurveTo(this._playerX + 20, this._playerY+ 60 + 8, this._playerX + 30, this._playerY + 60);
            this._ctx.quadraticCurveTo(this._playerX + 35, this._playerY+ 60 + 4, this._playerX + 40, this._playerY + 60);
            this._ctx.lineTo(this._playerX+40,this._playerY + 20);
            this._ctx.lineTo(this._playerX+25,this._playerY + 20);
            this._ctx.lineTo(this._playerX+25,this._playerY);
            this._ctx.lineTo(this._playerX+15,this._playerY);
            this._ctx.lineTo(this._playerX+15,this._playerY + 20);
            this._ctx.lineTo(this._playerX-1.75,this._playerY + 20);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.fillStyle = "#0A0710";
            this._ctx.fill();
            this._ctx.restore();

            if (this._playerShield > 0 && this._shieldOn == 1){
                this._ctx.save();
                this._ctx.globalAlpha = this._playerShield > 50 ? 1 : this._playerShield > 30 ? 0.1 : 0.05;
                this._ctx.beginPath();
                this._ctx.shadowBlur = 5;
                this._ctx.shadowColor = "yellow";
                this._ctx.moveTo(this._playerX - 15,this._playerY - 30);
                this._ctx.lineTo(this._playerX - 18,this._playerY - 28);
                this._ctx.lineTo(this._playerX + 63,this._playerY - 28);
                this._ctx.lineTo(this._playerX + 60,this._playerY - 30);
                this._ctx.lineTo(this._playerX - 16,this._playerY - 30);
                this._ctx.strokeStyle = "white";
                this._ctx.lineWidth = 4;
                this._ctx.stroke();
                this._ctx.fillStyle = "white";
                this._ctx.fill();
                this._ctx.restore();
            }

            if (this._playerDeathDelay < 75){
                this._particles.renderShipExplosions(
                    this._ctx,
                    this._playerDeathDelay,
                    this._playerX,
                    this._playerY
                );
            }
        }
        
        this._hazards.render(this._ctx, this._canvas.height); 
        
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.shadowBlur = 10;
        this._ctx.globalAlpha = this._gameStart == 1 ? 1 : 0;
        this._ctx.shadowColor = this._playerShield > 50 ? "yellow" : "white";
        this._ctx.fillStyle = this._playerShield > 50 ? "white" : "red";
        this._ctx.fillRect(60,10,this._playerShield,8);
        this._ctx.restore();

        let addMargin = 16; 
        let fontXmargin = 40;
        let stringNum = this._distance.toString();
        for (var i = 0, len = stringNum.length; i < len; i += 1) {
            addMargin += 2;
            fontXmargin += addMargin;
            this._ctx.save();
            this._ctx.shadowBlur = 10;
            this._ctx.globalAlpha = this._gameStart == 1 ? 1 : 0;
            this._ctx.shadowColor = "white";
            this._ctx.drawImage(IMG.numbers, stringNum.charAt(i) * 9, 0, 9, 9, fontXmargin, 30, 24, 24);
            this._ctx.restore();
        }
        
        if (this._playerDead == 1){
            this._ctx.drawImage(IMG.restart, 0, 0, 112, 9, (this._canvas.width / 2) - 112, (this._canvas.height / 2) - 9, 218, 16);
        }

        if (this._loadCutscene == 0){
            this._ctx.drawImage(IMG.title, 0, 0, 186, 22, (this._canvas.width / 2) - 186, (this._canvas.height / 2) - 50, 372, 44);
            this._ctx.drawImage(IMG.begin, 0, 0, 125, 9, (this._canvas.width / 2) - 125, (this._canvas.height / 2) + 10, 250, 16);
        }

        if (this._initialCutscene >= 100 && this._initialCutscene < 188){
            this._ctx.save();
            this._ctx.globalAlpha = this._warningCurAlpha;
            this._ctx.drawImage(IMG.warning, 0, 0, 56, 18, (this._canvas.width / 2) - 56, (this._canvas.height / 2) - 9, 112, 40);
            this._ctx.restore();
        }
        
        if (this._initialCutscene >= 200 && this._initialCutscene < 350){
            let frameCount = 0;
            if (this._initialCutscene < 258){
                if (this._initialCutscene % 2 > 0){
                    frameCount++;
                }
                frameCount =this._initialCutscene - 200;
                frameCount/=2;
            }
            else{
                frameCount = 258;
            }
            this._ctx.drawImage(IMG.introa, 0, 0, 9 * (frameCount + 1), 26, (this._canvas.width / 2) - 125, (this._canvas.height / 2) - 13, (9 * (frameCount + 1)) * 2, 40);
        }

        if (this._initialCutscene >= 360 && this._initialCutscene < 470){
            let frameCountB = 0;
            if (this._initialCutscene < 470){
                if (this._initialCutscene % 2 > 0){
                    frameCountB++;
                }
                frameCountB =this._initialCutscene - 360;
                frameCountB/=2;
            }
            else{
                frameCountB = 470;
            }
            this._ctx.drawImage(IMG.introb, 0, 0, 9 * (frameCountB + 1), 26, (this._canvas.width / 2) - 141, (this._canvas.height / 2) - 13, (9 * (frameCountB + 1)) * 2, 40);
        }

        if (this._initialCutscene >= 480 && this._initialCutscene < 600){
            let frameCountC = 0;
            if (this._initialCutscene < 600){
                if (this._initialCutscene % 2 > 0){
                    frameCountC++;
                }
                frameCountC =this._initialCutscene - 480;
                frameCountC/=2;
            }
            else{
                frameCountC = 600;
            }
            this._ctx.drawImage(IMG.introc, 0, 0, 9 * (frameCountC + 1), 26, (this._canvas.width / 2) - 125, (this._canvas.height / 2) - 13, (9 * (frameCountC + 1)) * 2, 40);
        }

        if (this._gameOver == 1){
            if (this._endingCutscene < 100){
                let frameCountD = 0;
                if (this._endingCutscene < 600){
                    if (this._endingCutscene % 2 > 0){
                        frameCountD++;
                    }
                    frameCountD =this._endingCutscene;
                    frameCountD/=2;
                }
                else{
                    frameCountD = 100;
                }
                this._ctx.drawImage(IMG.end, 0, 0, 9 * (frameCountD + 1), 26, (this._canvas.width / 2) - 125, (this._canvas.height / 2) - 13, (9 * (frameCountD + 1)) * 2, 40);
            }
            if (this._endingCutscene >= 150){
                this._ctx.drawImage(IMG.thanks, 0, 0, 120, 26, (this._canvas.width / 2) - 120, (this._canvas.height / 2) - 9, 240, 40);
            }
        }

    }
}

export default Netervati;

