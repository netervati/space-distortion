const loadAudio = (
    file: string,
    dir: string ='data/sfx/'
): HTMLAudioElement => {
    const audio = new Audio();
    audio.src = `${dir}${file}`;

    return audio;
}

type SFXKeys = 'gammaRay' | 'dissipate' | 'shield' | 'explosion'
                | 'disintegrate' | 'warning' | 'bgm';
type SFXMap = { [key in SFXKeys]: HTMLAudioElement; }

export const SFX: SFXMap = {
    gammaRay: loadAudio('gamma-wave.mp3'),
    dissipate: loadAudio('gamma-dissipate.mp3'),
    shield : loadAudio('shield.mp3'),
    explosion: loadAudio('explosion.mp3'),
    disintegrate: loadAudio('disintegrate.mp3'),
    warning: loadAudio('warning.mp3'),
    bgm: loadAudio('Chill In the Space.mp3', 'data/'),
};

