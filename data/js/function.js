/**
 * In this file, I had to integrate the code provided in an answer for a stackoverflow question. Here's the link:
 * https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
 */

function KeyboardController(keys, repeat) {
    var timers= {};
    document.onkeydown= function(event) {
        var key= (event || window.event).keyCode;
        if (!(key in keys)){return true;}
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0){timers[key]= setInterval(keys[key], repeat);}
        }
        return false;
    };
    document.onkeyup= function(event) {
        var key= (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key]!==null){clearInterval(timers[key]);}
            delete timers[key];
        }
    };
    window.onblur= () => {
        for (key in timers){if (timers[key]!==null){clearInterval(timers[key]);}}
        timers= {};
    };
};

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