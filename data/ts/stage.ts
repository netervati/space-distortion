const setStage = (): HTMLCanvasElement => {
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "black";
    const canvas = document.createElement("canvas");

    canvas.style.border = '3px solid white';
    canvas.style.left = '50%';
    canvas.style.position = 'fixed';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    canvas.width = 700;
    canvas.height = 650;
    canvas.style.backgroundColor = "#06030B";
    document.body.appendChild(canvas);

    return canvas;
};

export default setStage;

