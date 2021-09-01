const SFX = {
    gammaRay: new Audio(),
    dissipate: new Audio(),
    shield : new Audio(),
    explosion: new Audio(),
    disintegrate: new Audio(),
    warning: new Audio(),
    bgm: new Audio()
}
let sfxDir = "data/sfx/";
SFX["gammaRay"].src = sfxDir+"gamma-wave.mp3";
SFX["shield"].src = sfxDir+"shield.mp3";
SFX["dissipate"].src = sfxDir+"gamma-dissipate.mp3";
SFX["explosion"].src = sfxDir+"explosion.mp3";
SFX["disintegrate"].src = sfxDir+"disintegrate.mp3";
SFX["warning"].src = sfxDir+"warning.mp3";
SFX["bgm"].src = "data/Chill In the Space.mp3";
