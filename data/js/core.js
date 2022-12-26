import Hazards from './hazards.js';
import Particles from './particles.js';
import Player from './player.js';
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

        this._player = new Player(
            this._canvas.width / 2 - 25,
            this._canvas.height - 150,
        );

        this._distance = 0;
        this._distanceMilestone = 100;

        this._particles = new Particles(this._player.x);
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
        this._player.reset();

        this._gameOver = 0;
        this._distance = 0;
        this._distanceMilestone = 100;
        SFX["gammaRay"].pause();
        SFX["gammaRay"].currentTime = 0;
    }
    logKey(pv){
        if (this._player.collision == 0){
            if (pv["type"] == "movement"){
                if (pv["direction"] == "right"){
                    if (this._player.x + 3 + 16 < this._canvas.width - 25){
                        this._player.x+= 3;
                    }
                }
                else if (pv["direction"] == "left"){
                    if (this._player.x - 3 > 0){
                        this._player.x -= 3;
                    }
                }
            }
            else if (pv["type"] == "shield"){
                if (this._player.shieldOn == 0 && this._gameStart == 1 && this._distance < 4900){
                    this._player.shieldOn = 1;
                    if (this._player.shield > 0){
                        this._player.shield--;
                        this._player.curShieldOn = this._player.shield;
                        SFX["shield"].play();
                    }
                }
            }
        }
    }
    async update(){
        this._wave.update();
        this._particles.update(this._canvas.height, this._player.x);

        await this.render();

        if (this._gameStart == 1 && this._gameOver == 0){
            if (this._player.shieldOn == 0){
                if (this._player.shield < 100){
                    this._player.shield+=0.25;
                }
            }
            else{
                if (this._player.shield > 0){
                    this._player.shield--;
                }
            }

            const proceedHazardUpdate = this._hazards.spawnAsteroid(
                this._canvas.width,
                this._distance,
                this._player.x
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
                        this._player.shield,
                        this._player.shieldOn,
                        this._player.x,
                        this._player.y,
                        asteroid
                    );

                    if (blocked === true) {
                        this._player.shield = this._player.shield - 50 || 0;
                        SFX.disintegrate.play();
                    } else {
                        if (collided === true) {
                            this._player.collision = 1;
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
                this._player.x
            );

            if (activeComet === true) {
                const collided = this._hazards.collideWithComet(
                    this._player.collision,
                    this._player.x,
                    this._player.y
                );

                if (collided === true) {
                    this._player.collision = 1;
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
                const collided = this._hazards.collideWithGammaRay(this._player.x);

                if (collided === true) {
                    this._player.collision = 1;
                }

                if (this._hazards.gammaRayExpansion === 120){
                    SFX.dissipate.play();
                }
            }

            if (this._player.collision == 0){
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
                this._player.updateDeathState();

                if (this._player.deathDelay === 74) {
                    SFX.explosion.play();
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
        if (this._player.curShieldOn != 0){
            if (this._player.curShieldOn - this._player.shield > 50 || this._player.shield <= 0){
                this._player.curShieldOn = 0;
            }
        }
        else{
            this._player.shieldOn = 0;
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

        if (this._player.dead == 0){
            if (this._player.collision == 0){
                this._particles.renderShipBoosters(this._ctx, this._player.y);
            }

            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.moveTo(this._player.x+18,this._player.y - 5);
            this._ctx.lineTo(this._player.x-15,(this._player.y - 10) + 50);
            this._ctx.lineTo(this._player.x-25,(this._player.y - 10) + 50);
            this._ctx.lineTo(this._player.x-40,(this._player.y - 10) + 70);
            this._ctx.lineTo(this._player.x+18,(this._player.y - 10) + 70);
            this._ctx.lineTo(this._player.x+18,(this._player.y - 10) + 80);
            this._ctx.lineTo(this._player.x+22,(this._player.y - 10) + 80);
            this._ctx.lineTo(this._player.x+22,(this._player.y - 10) + 70);
            this._ctx.lineTo(this._player.x+80,(this._player.y - 10) + 70);
            this._ctx.lineTo(this._player.x+65,(this._player.y - 10) + 50);
            this._ctx.lineTo(this._player.x+55,(this._player.y - 10) + 50);
            this._ctx.lineTo(this._player.x+22,this._player.y - 5);
            this._ctx.lineTo(this._player.x+17,this._player.y - 5);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.fillStyle = "#06030B";
            this._ctx.fill();

            this._ctx.beginPath();
            this._ctx.moveTo(this._player.x,this._player.y + 20);
            this._ctx.lineTo(this._player.x,this._player.y + 60);
            this._ctx.quadraticCurveTo(this._player.x + 5, this._player.y+ 60 + 4, this._player.x + 10, this._player.y + 60);
            this._ctx.quadraticCurveTo(this._player.x + 20, this._player.y+ 60 + 8, this._player.x + 30, this._player.y + 60);
            this._ctx.quadraticCurveTo(this._player.x + 35, this._player.y+ 60 + 4, this._player.x + 40, this._player.y + 60);
            this._ctx.lineTo(this._player.x+40,this._player.y + 20);
            this._ctx.lineTo(this._player.x+25,this._player.y + 20);
            this._ctx.lineTo(this._player.x+25,this._player.y);
            this._ctx.lineTo(this._player.x+15,this._player.y);
            this._ctx.lineTo(this._player.x+15,this._player.y + 20);
            this._ctx.lineTo(this._player.x-1.75,this._player.y + 20);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.fillStyle = "#0A0710";
            this._ctx.fill();
            this._ctx.restore();

            if (this._player.shield > 0 && this._player.shieldOn == 1){
                this._ctx.save();
                this._ctx.globalAlpha = this._player.shield > 50 ? 1 : this._player.shield > 30 ? 0.1 : 0.05;
                this._ctx.beginPath();
                this._ctx.shadowBlur = 5;
                this._ctx.shadowColor = "yellow";
                this._ctx.moveTo(this._player.x - 15,this._player.y - 30);
                this._ctx.lineTo(this._player.x - 18,this._player.y - 28);
                this._ctx.lineTo(this._player.x + 63,this._player.y - 28);
                this._ctx.lineTo(this._player.x + 60,this._player.y - 30);
                this._ctx.lineTo(this._player.x - 16,this._player.y - 30);
                this._ctx.strokeStyle = "white";
                this._ctx.lineWidth = 4;
                this._ctx.stroke();
                this._ctx.fillStyle = "white";
                this._ctx.fill();
                this._ctx.restore();
            }

            if (this._player.deathDelay < 75){
                this._particles.renderShipExplosions(
                    this._ctx,
                    this._player.deathDelay,
                    this._player.x,
                    this._player.y
                );
            }
        }
        
        this._hazards.render(this._ctx, this._canvas.height); 
        
        this._ctx.save();
        this._ctx.beginPath();
        this._ctx.shadowBlur = 10;
        this._ctx.globalAlpha = this._gameStart == 1 ? 1 : 0;
        this._ctx.shadowColor = this._player.shield > 50 ? "yellow" : "white";
        this._ctx.fillStyle = this._player.shield > 50 ? "white" : "red";
        this._ctx.fillRect(60,10,this._player.shield,8);
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
        
        if (this._player.dead == 1){
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

