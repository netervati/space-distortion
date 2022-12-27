import Netervati from './core';
import KeyboardController from './function';

await (async () => {
    const appGame: Netervati = new Netervati();

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

    await appGame.update();
})();
