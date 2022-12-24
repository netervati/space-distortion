const setStage = (): HTMLCanvasElement => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.style.backgroundColor = '#06030B';
    canvas.style.border = '3px solid white';
    canvas.style.left = '50%';
    canvas.style.position = 'fixed';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    canvas.width = 700;
    canvas.height = 650;

    document.body.style.margin = '0';
    document.body.style.backgroundColor = 'black';
    document.body.appendChild(canvas);

    return canvas;
};

export default setStage;
