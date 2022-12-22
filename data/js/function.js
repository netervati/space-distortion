/**
 * In this file, I had to integrate the code provided in an answer for a stackoverflow question. Here's the link:
 * https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
 */
function KeyboardController(keys, repeat) {
    var timers = {};
    document.onkeydown = function (event) {
        var key = (event || window.event).code;
        if (!(key in keys)) {
            return true;
        }
        if (!(key in timers)) {
            timers[key] = undefined;
            keys[key]();
            if (repeat !== 0) {
                timers[key] = setInterval(keys[key], repeat);
            }
        }
        return false;
    };
    document.onkeyup = function (event) {
        var key = (event || window.event).code;
        if (key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }
            delete timers[key];
        }
    };
    window.onblur = function () {
        for (var key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }
        }
        timers = {};
    };
}
;
export default KeyboardController;
