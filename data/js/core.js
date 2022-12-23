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

        this._gammaRaySummon = 600;
        this._gammaRayX = 0;
        this._gammaRayInitialTransition = 0;
        this._gammaRayExpansion = 0;
        this._gammaRayDissipate = 0;
        this._gammaRayParticleSpread = 200;

        this.update();
    }
    beginGame(){
        this._beginTime = performance.now();
        this._allowStart = 1;
    }
    reload(){
        this._particles.reset();
        this._hazards.reset();

        this._gammaRaySummon = 600;
        this._gammaRayX = 0;
        this._gammaRayInitialTransition = 0;
        this._gammaRayExpansion = 0;
        this._gammaRayDissipate = 0;
        this._gammaRayParticleSpread = 200;
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

            const proceedHazardUpdate = this._hazards.update(
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

                this._hazards.adjustDifficulty(
                    adjustHazards,
                    this._distanceMilestone
                );
            }   

            if (this._hazards.asteroid.length > 0){
                let spliceAsteroid = [];
                let asteroidLength = this._hazards.asteroid.length;
                for (let av = 0; av < asteroidLength; av++){
                    this._hazards.asteroid[av]["y"] += this._hazards.asteroid[av]["speed"];
                    let playerBlock = 0;
                    if (this._playerShield > 50 && this._shieldOn == 1){
                        if (this._playerY - 30 <= this._hazards.asteroid[av]["y"] + 25 && this._hazards.asteroid[av]["y"] + 25 <= this._playerY + 10 ){
                            if (this._playerX - 18 <= this._hazards.asteroid[av]["x"] - 25 && this._hazards.asteroid[av]["x"] - 25 <= this._playerX + 63){
                                playerBlock = 1;
                            }
                            else if (this._playerX - 18 >= this._hazards.asteroid[av]["x"] - 25 && this._playerX - 18 <= this._hazards.asteroid[av]["x"] + 35){
                                playerBlock = 1;
                            }
                        }
                    }
                    if (playerBlock == 1){
                        this._hazards.asteroidDeathParticles.push({x:this._hazards.asteroid[av]["x"],y:this._hazards.asteroid[av]["y"],life:30});
                        this._playerShield - 50 > 0 ? this._playerShield -= 50 : this._playerShield = 0;
                        SFX["disintegrate"].play();
                        continue;
                    }
                    else{
                        if (this._playerY <= this._hazards.asteroid[av]["y"] + 25 && this._hazards.asteroid[av]["y"] + 25 <= this._playerY + 60){
                            if (this._playerX - 2 <= this._hazards.asteroid[av]["x"] - 25 && this._hazards.asteroid[av]["x"] - 25 <= this._playerX + 40){
                                this._playerCollision = 1;
                            }
                            else if (this._playerX - 2 >= this._hazards.asteroid[av]["x"] - 25 && this._playerX - 2 <= this._hazards.asteroid[av]["x"] + 35){
                                this._playerCollision = 1;
                            }
                        }

                        if (this._hazards.asteroid[av]["y"] < this._canvas.height){
                            spliceAsteroid.push(this._hazards.asteroid[av]);
                        }
                    }
                }
                this._hazards.asteroid = [];
                if (spliceAsteroid.length > 0){
                    this._hazards.asteroid = spliceAsteroid;
                }
            }
            if (this._hazards.asteroidDeathParticles.length > 0){
                let spliceAsteroidDeathParticles = [];
                let asteroidDeathParticlesLength = this._hazards.asteroidDeathParticles.length;
                for (let ad = 0; ad < asteroidDeathParticlesLength; ad++){
                    if (this._hazards.asteroidDeathParticles[ad]["life"] > 0){
                        this._hazards.asteroidDeathParticles[ad]["life"]--;
                        spliceAsteroidDeathParticles.push(this._hazards.asteroidDeathParticles[ad]);
                    }
                }
                this._hazards.asteroidDeathParticles = [];
                if (spliceAsteroidDeathParticles.length > 0){
                    this._hazards.asteroidDeathParticles = spliceAsteroidDeathParticles;
                }
            }
            if (this._hazards.cometSummon > 0){
                this._hazards.cometSummon--;
            }
            else{
                if (this._hazards.comet["y"] == 0){
                    if (this._distance < 4900){
                        this._hazards.comet["x"] = Math.floor(Math.random() * ((this._playerX + 40)-this._playerX)) + this._playerX;
                        this._hazards.comet["y"]+=this._hazards.cometSpeedFactor;
                    }
                }
                else if (this._hazards.comet["y"] < this._canvas.height+200){
                    this._hazards.comet["y"]+=this._hazards.cometSpeedFactor;
                    if (this._hazards.comet["trail"] > 20 && this._hazards.comet["trailSwitch"] == 0){
                        this._hazards.comet["trail"]-=2;
                    }
                    else if (this._hazards.comet["trail"] < 40 && this._hazards.comet["trailSwitch"] == 1){
                        this._hazards.comet["trail"]+=2;
                    }
                    else if (this._hazards.comet["trail"] == 20){
                        this._hazards.comet["trailSwitch"] = 1;
                    } 
                    else if (this._hazards.comet["trail"] == 40){
                        this._hazards.comet["trailSwitch"] = 0;
                    }
                    if (this._playerY <= this._hazards.comet["y"] + this._hazards.comet["trail"] && this._hazards.comet["y"] + this._hazards.comet["trail"] <= this._playerY + 60 && this._playerCollision == 0){
                        if (this._playerX - 2 <= this._hazards.comet["x"] - this._hazards.comet["trail"] + 5 && this._hazards.comet["x"] - this._hazards.comet["trail"] + 5 <= this._playerX + 40){
                            this._playerCollision = 1;
                        }
                        else if (this._playerX - 2 >= this._hazards.comet["x"] - this._hazards.comet["trail"] + 5 && this._playerX - 2 <= this._hazards.comet["x"] + this._hazards.comet["trail"] - 5){
                            this._playerCollision = 1;
                        }
                    }
                }
                else{
                    if (this._distance < 4900){
                        this._hazards.cometSummon = this._hazards.cometSummonBasis;
                    }
                    this._hazards.comet["y"] = 0;
                }
            }
            if (this._gammaRaySummon > 0){
                this._gammaRaySummon--;
            }
            else{
                if (this._gammaRayDissipate == 0){
                    if (this._gammaRayExpansion == 0){
                        if (this._distance < 4900){
                            if (this._gammaRayInitialTransition < this._canvas.height + 5000){
                                if (this._gammaRayX == 0){
                                    this._gammaRayX = Math.floor(Math.random() * (this._canvas.width-200)) + 100;
                                }
                                this._gammaRayInitialTransition+=30;
                            }
                            else{
                                this._gammaRayInitialTransition = 0;
                                this._gammaRayExpansion++;
                                SFX["gammaRay"].play();
                            }
                        }
                    }
                    else if (this._gammaRayExpansion < 125){
                        this._gammaRayExpansion ++;
                        if (this._playerX - 2 <= this._gammaRayX - this._gammaRayExpansion && this._gammaRayX - this._gammaRayExpansion <= this._playerX + 40){
                            this._playerCollision = 1;
                        }
                        else if (this._playerX - 2 >= this._gammaRayX - this._gammaRayExpansion && this._playerX - 2 <= this._gammaRayX + (this._gammaRayExpansion/2)){
                            this._playerCollision = 1;
                        }
                        if (this._gammaRayExpansion == 120){
                            SFX["dissipate"].play();
                        }
                    }   
                    else{
                        this._gammaRayDissipate = 50;
                        this._gammaRayExpansion = 0;
                    }
                }
                else{
                    this._gammaRayDissipate-=5;
                    if (this._gammaRayDissipate <= 0){
                        if (this._distance < 4900){
                            this._gammaRaySummon = 600;
                            this._gammaRayX = 0;
                        }
                    }
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

        if (this._gammaRayInitialTransition > 0){
            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.shadowBlur = 10;
            this._ctx.shadowColor = "green";
            this._ctx.moveTo(this._gammaRayX,this._canvas.height + 5000);
            let moveToEnd = this._gammaRayInitialTransition > 0 ? this._canvas.height + 5000 - this._gammaRayInitialTransition : 0;
            this._ctx.lineTo(this._gammaRayX,moveToEnd);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.restore();
        }
        if (this._gammaRayExpansion > 0){
            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.shadowBlur = 10;
            this._ctx.shadowColor = "green";
            this._ctx.fillStyle = "white";
            this._ctx.fillRect(this._gammaRayX-this._gammaRayExpansion,0,this._gammaRayExpansion+(this._gammaRayExpansion/2),this._canvas.height);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.restore();
        }
        if (this._gammaRayDissipate > 0){
            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.shadowBlur = 10;
            this._ctx.shadowColor = "green";
            this._ctx.fillStyle = "white";
            this._ctx.fillRect(this._gammaRayX-this._gammaRayDissipate,0,this._gammaRayDissipate+(this._gammaRayDissipate/2),this._canvas.height);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.restore();
        }

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
        
        this._hazards.renderAsteroids(this._ctx);
        
        if (this._hazards.comet["y"] > 0 && this._hazards.comet["y"] < this._canvas.height + 200){
            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.shadowBlur = 5;
            this._ctx.shadowColor = "blue";
            let trail = this._hazards.comet["trail"];
            this._ctx.arc(this._hazards.comet["x"],this._hazards.comet["y"],trail,0,1*Math.PI);
            this._ctx.quadraticCurveTo(this._hazards.comet["x"]-trail+5,this._hazards.comet["y"]-10,this._hazards.comet["x"],this._hazards.comet["y"]-130);
            this._ctx.quadraticCurveTo(this._hazards.comet["x"]+trail-5,this._hazards.comet["y"]-10,this._hazards.comet["x"]+trail,this._hazards.comet["y"]);
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 4;
            this._ctx.stroke();
            this._ctx.fillStyle = "white";
            this._ctx.fill();
            this._ctx.restore();
        }
        
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

