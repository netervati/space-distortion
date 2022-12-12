import Netervati from './core.js';
import KeyboardController from './function.js';

const appGame = new Netervati();

KeyboardController({
    83: () => {
        appGame.logKey({
            type: "shield",
        });
    },
    65: () => {
        appGame.logKey({
            type: "movement",
            direction: "left"
        });
    },
    68: () => {
        appGame.logKey({
            type: "movement",
            direction: "right"
        });
    },
    13: () => {
        if (appGame._allowStart == 0){
            appGame.beginGame();
        }
    },
    82: () => {
        if (appGame._playerDead == 1){
            appGame.reload();
        }
    }
}, 12);

