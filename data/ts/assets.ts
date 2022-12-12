const loadAudio = (
    file: string,
    dir: string ='data/sfx/'
): HTMLAudioElement => {
    const audio = new Audio();
    audio.src = `${dir}${file}`;

    return audio;
}

const loadImage = (file: string): HTMLImageElement => {
    const img = document.createElement("img");
    img.src = `data/img/${file}`;

    return img;
};

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

export const IMG: { [key: string]: HTMLImageElement } = {
    numbers: loadImage('number.png'),
    restart: loadImage('restart.png'),
    begin: loadImage('begin.png'),
    warning: loadImage('warning.png'),
    introa: loadImage('introa.png'),
    introb: loadImage('introb.png'),
    introc: loadImage('introc.png'),
    end: loadImage('end.png'),
    title: loadImage('title.png'),
    thanks: loadImage('thanks.png'),
};

