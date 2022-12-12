var loadAudio = function (file, dir) {
    if (dir === void 0) { dir = 'data/sfx/'; }
    var audio = new Audio();
    audio.src = "" + dir + file;
    return audio;
};
export var SFX = {
    gammaRay: loadAudio('gamma-wave.mp3'),
    dissipate: loadAudio('gamma-dissipate.mp3'),
    shield: loadAudio('shield.mp3'),
    explosion: loadAudio('explosion.mp3'),
    disintegrate: loadAudio('disintegrate.mp3'),
    warning: loadAudio('warning.mp3'),
    bgm: loadAudio('Chill In the Space.mp3', 'data/'),
};
