import Netervati from './core.js';
import KeyboardController from './function.js';

const appGame = new Netervati();

KeyboardController({
    'KeyS': () => {
        appGame.logKey({
            type: "shield",
        });
    },
    'KeyA': () => {
        appGame.logKey({
            type: "movement",
            direction: "left"
        });
    },
    'KeyD': () => {
        appGame.logKey({
            type: "movement",
            direction: "right"
        });
    },
    'Enter': () => {
        if (appGame._allowStart == 0){
            appGame.beginGame();
        }
    },
    'KeyR': () => {
        if (appGame._player.dead === 1){
            appGame.reload();
        }
    }
}, 12);

