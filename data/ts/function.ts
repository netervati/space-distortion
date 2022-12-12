/**
 * In this file, I had to integrate the code provided in an answer for a stackoverflow question. Here's the link:
 * https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript
 */

function KeyboardController(keys: { [key: number]: Function }, repeat: number) {
    let timers: { [key: number]: undefined | number } = {};

    document.onkeydown = (event: KeyboardEvent): boolean => {
        const key: number = (event || window.event).keyCode;

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

    document.onkeyup = (event: KeyboardEvent): void => {
        const key: number = (event || window.event).keyCode;

        if (key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }

            delete timers[key];
        }
    };

    window.onblur = () => {
        for (let key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }
        }

        timers = {};
    };
};

export default KeyboardController;

