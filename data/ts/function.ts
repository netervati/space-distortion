function KeyboardController(
    keys: { [key: string]: () => Promise<void> | void },
    repeat: number,
): void {
    let timers: { [key: string]: undefined | number } = {};

    document.onkeydown = async (event: KeyboardEvent): Promise<boolean> => {
        const key: string = (event || window.event).code;

        if (!(key in keys)) {
            return true;
        }

        if (!(key in timers)) {
            timers[key] = undefined;
            await keys[key]();

            if (repeat !== 0) {
                timers[key] = setInterval(keys[key], repeat);
            }
        }

        return false;
    };

    document.onkeyup = (event: KeyboardEvent): void => {
        const key: string = (event || window.event).code;

        if (key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }

            delete timers[key];
        }
    };

    window.onblur = (): void => {
        for (const key in timers) {
            if (timers[key] !== null) {
                clearInterval(timers[key]);
            }
        }

        timers = {};
    };
}

export default KeyboardController;
