var loadAudio = function (file, dir) {
    if (dir === void 0) { dir = 'data/sfx/'; }
    var audio = new Audio();
    audio.src = "".concat(dir).concat(file);
    return audio;
};
var loadImage = function (file) {
    var img = document.createElement("img");
    img.src = "data/img/".concat(file);
    return img;
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
export var IMG = {
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
