import Particles from './particles.js';
import setStage from './stage.js';
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
        this._curveTransitionPoints = [[100,0,1],[50,1,0],[25,1,0],[60,1,1]];
        this._curveIn = 100;

        this._asteroid = [];
        this._asteroidSummon = 300;
        this._asteroidSummonBasis = 300;
        this._asteroidSpeedFactor = 6;
        this._asteroidDeathParticles = [];
        this._comet = {x:0,y:0,trail:40,trailSwitch:0};
        this._cometSummon = 400;
        this._cometSummonBasis = 400;
        this._cometSpeedFactor = 12;
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

        this._asteroid = [];
        this._asteroidSummon = 300;
        this._asteroidSummonBasis = 300;
        this._asteroidSpeedFactor = 6;
        this._asteroidDeathParticles = [];
        this._comet = {x:0,y:0,trail:40,trailSwitch:0};
        this._cometSummon = 400;
        this._cometSummonBasis = 400;
        this._cometSpeedFactor = 12;
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
        let curveTransitionLength = this._curveTransitionPoints.length;
        for (let tx = 0; tx < curveTransitionLength; tx++){
            if (this._curveTransitionPoints[tx][0] > 0 && this._curveTransitionPoints[tx][1] != this._curveTransitionPoints[tx][2]){
                this._curveTransitionPoints[tx][0] --;
            }
            else if (this._curveTransitionPoints[tx][0] < 100 && this._curveTransitionPoints[tx][1] == this._curveTransitionPoints[tx][2]){
                this._curveTransitionPoints[tx][0] ++;
            }
            if (this._curveTransitionPoints[tx][0] == 100){
                this._curveTransitionPoints[tx][1] == 1 ? this._curveTransitionPoints[tx][1] = 0 : this._curveTransitionPoints[tx][1] = 1;
            }
            else if (this._curveTransitionPoints[tx][0] == 0){
                this._curveTransitionPoints[tx][1] == 1 ? this._curveTransitionPoints[tx][1] = 0 : this._curveTransitionPoints[tx][1] = 1;
            }
        }

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

            if (this._distance < 4900){
                this._asteroidSummon--;
                if (this._asteroidSummon == 0){
                    let decideDistance = Math.floor(Math.random() * 2) + 1;
                    let randomX = decideDistance == 1 ? this._playerX : Math.random() * ((this._canvas.width - 200) - 100) + 100;
                    this._asteroid.push({x:randomX,y:0,speed:this._asteroidSpeedFactor});
                    if (this._distance > this._distanceMilestone && this._distanceMilestone < 5000 && this._asteroidSummonBasis > 40){
                        this._asteroidSummonBasis -= 25;
                        this._distanceMilestone += 100;
                        if (this._distanceMilestone > 1000 && this._asteroidSpeedFactor < 18){
                            this._asteroidSpeedFactor++;
                            this._cometSpeedFactor++;
                        }
                        if (this._cometSummonBasis > 100){
                            this._cometSummonBasis -= 50;
                        }
                    }
                    this._asteroidSummon = this._asteroidSummonBasis;
                }
            }
            if (this._asteroid.length > 0){
                let spliceAsteroid = [];
                let asteroidLength = this._asteroid.length;
                for (let av = 0; av < asteroidLength; av++){
                    this._asteroid[av]["y"] += this._asteroid[av]["speed"];
                    let playerBlock = 0;
                    if (this._playerShield > 50 && this._shieldOn == 1){
                        if (this._playerY - 30 <= this._asteroid[av]["y"] + 25 && this._asteroid[av]["y"] + 25 <= this._playerY + 10 ){
                            if (this._playerX - 18 <= this._asteroid[av]["x"] - 25 && this._asteroid[av]["x"] - 25 <= this._playerX + 63){
                                playerBlock = 1;
                            }
                            else if (this._playerX - 18 >= this._asteroid[av]["x"] - 25 && this._playerX - 18 <= this._asteroid[av]["x"] + 35){
                                playerBlock = 1;
                            }
                        }
                    }
                    if (playerBlock == 1){
                        this._asteroidDeathParticles.push({x:this._asteroid[av]["x"],y:this._asteroid[av]["y"],life:30});
                        this._playerShield - 50 > 0 ? this._playerShield -= 50 : this._playerShield = 0;
                        SFX["disintegrate"].play();
                        continue;
                    }
                    else{
                        if (this._playerY <= this._asteroid[av]["y"] + 25 && this._asteroid[av]["y"] + 25 <= this._playerY + 60){
                            if (this._playerX - 2 <= this._asteroid[av]["x"] - 25 && this._asteroid[av]["x"] - 25 <= this._playerX + 40){
                                this._playerCollision = 1;
                            }
                            else if (this._playerX - 2 >= this._asteroid[av]["x"] - 25 && this._playerX - 2 <= this._asteroid[av]["x"] + 35){
                                this._playerCollision = 1;
                            }
                        }

                        if (this._asteroid[av]["y"] < this._canvas.height){
                            spliceAsteroid.push(this._asteroid[av]);
                        }
                    }
                }
                this._asteroid = [];
                if (spliceAsteroid.length > 0){
                    this._asteroid = spliceAsteroid;
                }
            }
            if (this._asteroidDeathParticles.length > 0){
                let spliceAsteroidDeathParticles = [];
                let asteroidDeathParticlesLength = this._asteroidDeathParticles.length;
                for (let ad = 0; ad < asteroidDeathParticlesLength; ad++){
                    if (this._asteroidDeathParticles[ad]["life"] > 0){
                        this._asteroidDeathParticles[ad]["life"]--;
                        spliceAsteroidDeathParticles.push(this._asteroidDeathParticles[ad]);
                    }
                }
                this._asteroidDeathParticles = [];
                if (spliceAsteroidDeathParticles.length > 0){
                    this._asteroidDeathParticles = spliceAsteroidDeathParticles;
                }
            }
            if (this._cometSummon > 0){
                this._cometSummon--;
            }
            else{
                if (this._comet["y"] == 0){
                    if (this._distance < 4900){
                        this._comet["x"] = Math.floor(Math.random() * ((this._playerX + 40)-this._playerX)) + this._playerX;
                        this._comet["y"]+=this._cometSpeedFactor;
                    }
                }
                else if (this._comet["y"] < this._canvas.height+200){
                    this._comet["y"]+=this._cometSpeedFactor;
                    if (this._comet["trail"] > 20 && this._comet["trailSwitch"] == 0){
                        this._comet["trail"]-=2;
                    }
                    else if (this._comet["trail"] < 40 && this._comet["trailSwitch"] == 1){
                        this._comet["trail"]+=2;
                    }
                    else if (this._comet["trail"] == 20){
                        this._comet["trailSwitch"] = 1;
                    } 
                    else if (this._comet["trail"] == 40){
                        this._comet["trailSwitch"] = 0;
                    }
                    if (this._playerY <= this._comet["y"] + this._comet["trail"] && this._comet["y"] + this._comet["trail"] <= this._playerY + 60 && this._playerCollision == 0){
                        if (this._playerX - 2 <= this._comet["x"] - this._comet["trail"] + 5 && this._comet["x"] - this._comet["trail"] + 5 <= this._playerX + 40){
                            this._playerCollision = 1;
                        }
                        else if (this._playerX - 2 >= this._comet["x"] - this._comet["trail"] + 5 && this._playerX - 2 <= this._comet["x"] + this._comet["trail"] - 5){
                            this._playerCollision = 1;
                        }
                    }
                }
                else{
                    if (this._distance < 4900){
                        this._cometSummon = this._cometSummonBasis;
                    }
                    this._comet["y"] = 0;
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
                    if (this._curveIn > 0){
                        this._curveIn--;
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
                if (this._curveIn > 0){
                    this._curveIn-=2;
                }
            }
        }
        else{
            if (this._curveIn < 100){
                this._curveIn+=2;
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
        
        let sides = 2;
        this._ctx.save();
        while(sides > 0){
            let curveWidthA = this._curveTransitionPoints[3][0] - this._curveIn > 0 ? this._curveTransitionPoints[3][0] - this._curveIn : 0;
            let curveWidthB = this._curveTransitionPoints[2][0] - this._curveIn > 0 ? this._curveTransitionPoints[2][0] - this._curveIn : 0;
            let curveWidthC = this._curveTransitionPoints[1][0] - this._curveIn > 0 ? this._curveTransitionPoints[1][0] - this._curveIn : 0 ;
            let curveWidthD = this._curveTransitionPoints[0][0] - this._curveIn > 0 ? this._curveTransitionPoints[0][0] - this._curveIn : 0;
            let curveWidthE = 0;
            if (sides > 1){
                curveWidthA = this._canvas.width - curveWidthA;
                curveWidthB = this._canvas.width - curveWidthB;
                curveWidthC = this._canvas.width - curveWidthC;
                curveWidthD = this._canvas.width - curveWidthD;
                curveWidthE = this._canvas.width - curveWidthE;
            }
            this._ctx.beginPath();
            this._ctx.shadowBlur = 5;
            this._ctx.shadowColor = "white";
            this._ctx.moveTo(curveWidthA, this._canvas.height);
            this._ctx.bezierCurveTo(curveWidthB, 425, curveWidthC, 225, curveWidthD, 0);
            this._ctx.lineTo(curveWidthE, 0);  
            this._ctx.lineTo(curveWidthE, this._canvas.height);  
            this._ctx.lineTo(curveWidthA, this._canvas.height);   
            this._ctx.strokeStyle = "white";
            this._ctx.lineWidth = 100 - this._curveIn < 10 ? 100 - this._curveIn : 10;
            this._ctx.stroke();
            this._ctx.fillStyle = "#0A0710";
            this._ctx.fill();

            sides--;
        }
        this._ctx.restore();

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

        if (this._asteroid.length > 0){
            this._asteroid.forEach((asteroid)=>{
                this._ctx.save();
                this._ctx.beginPath();
                this._ctx.moveTo(asteroid["x"]-25,asteroid["y"]);
                this._ctx.lineTo(asteroid["x"]-25,asteroid["y"]+15);
                this._ctx.quadraticCurveTo(asteroid["x"]-15,asteroid["y"]+18,asteroid["x"]-10,asteroid["y"]+20);
                this._ctx.quadraticCurveTo(asteroid["x"],asteroid["y"]+25,asteroid["x"]+5,asteroid["y"]+25);
                this._ctx.quadraticCurveTo(asteroid["x"]+20,asteroid["y"]+25,asteroid["x"]+30,asteroid["y"]);
                this._ctx.quadraticCurveTo(asteroid["x"]+35,asteroid["y"]-10,asteroid["x"],asteroid["y"]-15);
                this._ctx.quadraticCurveTo(asteroid["x"]-20,asteroid["y"]-10,asteroid["x"]-25,asteroid["y"]);
                this._ctx.strokeStyle = "white";
                this._ctx.lineWidth = 4;
                this._ctx.stroke();
                this._ctx.fillStyle = "#06030B";
                this._ctx.fill();
                this._ctx.restore();
            });
        }
        if (this._asteroidDeathParticles.length > 0){
            let ADParticles = [[1,-5,1.5],[-1,5,1.5],[1,-2,0.75],[-1,2,0.75],[1,-5,3],[-1,5,3],[1,-3,2],[-1,3,2],[1,-6,6],[-1,3,12],[1,0,5],[-1,0,5],[1,-3,10],[-1,3,10],[1,2,6],[-1,-4,6]];
            this._asteroidDeathParticles.forEach((particle)=>{
                ADParticles.forEach((adp)=>{
                    this._ctx.save();
                    this._ctx.shadowBlur = 5;
                    this._ctx.shadowColor = "yellow";
                    this._ctx.fillStyle = "white";
                    this._ctx.fillRect(particle["x"] + ((30 - particle["life"]) * adp[2]) * adp[0], particle["y"] + adp[1], 3, 3);
                    this._ctx.restore();
                });
            });
        }

        if (this._comet["y"] > 0 && this._comet["y"] < this._canvas.height + 200){
            this._ctx.save();
            this._ctx.beginPath();
            this._ctx.shadowBlur = 5;
            this._ctx.shadowColor = "blue";
            let trail = this._comet["trail"];
            this._ctx.arc(this._comet["x"],this._comet["y"],trail,0,1*Math.PI);
            this._ctx.quadraticCurveTo(this._comet["x"]-trail+5,this._comet["y"]-10,this._comet["x"],this._comet["y"]-130);
            this._ctx.quadraticCurveTo(this._comet["x"]+trail-5,this._comet["y"]-10,this._comet["x"]+trail,this._comet["y"]);
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

