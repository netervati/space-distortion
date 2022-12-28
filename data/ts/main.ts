import Netervati from './core';
import KeyboardController from './function';

await (async () => {
    const appGame: Netervati = new Netervati();
    let lastTime = 0;
    const frameRate = 1000 / 24;

    const mainLoop = async (): Promise<void> => {
        if (lastTime === 0) {
            lastTime = performance.now();
        }

        const deltaTime = frameRate * (performance.now() - lastTime);

        appGame.render();

        if (deltaTime >= 1000) {
            lastTime = performance.now();

            await appGame.update();
        }

        await new Promise((resolve) => requestAnimationFrame(resolve)).then(
            mainLoop,
        );
    };

    KeyboardController(
        {
            KeyS: async (): Promise<void> => {
                await appGame.logKey({
                    type: 'shield',
                    direction: '',
                });
            },
            KeyA: async (): Promise<void> => {
                await appGame.logKey({
                    type: 'movement',
                    direction: 'left',
                });
            },
            KeyD: async (): Promise<void> => {
                await appGame.logKey({
                    type: 'movement',
                    direction: 'right',
                });
            },
            Enter: (): void => {
                if (appGame._allowStart === 0) {
                    appGame.beginGame();
                }
            },
            KeyR: (): void => {
                if (appGame._player.dead === 1) {
                    appGame.reload();
                }
            },
        },
        12,
    );

    await mainLoop();
})();
