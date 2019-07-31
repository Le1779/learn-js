var SmartLampView = function (builder) {
    let canvas = builder.canvas;

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;
    let powerRate = 0;

    initCanvas();

    function initCanvas() {

        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
            requestAnimationFrame(animation);
        }
    }

    this.setPower = function (rate) {
        powerRate = rate;
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawLamp(powerRate);
    }

    function drawLamp(rate) {
        let lampWidth = viewWidth / 3;
        let startX = centerX - lampWidth / 2;
        let startY = lampWidth / 2;
        let lampBaseHeight = lampWidth / 10;
        let lampBaseWidth = lampWidth / 3;
        let out = lampBaseHeight / 2;

        let color = 255 - 50 * rate;
        let rgba = `RGBA(${color}, ${color}, ${color}, 255)`;

        drawBackground(rate);

        drawLight();
        drawShadow();
        
        context.save();
        context.beginPath();
        context.fillStyle = "#888";
        context.strokeStyle = "#888";

        context.moveTo(startX, startY);
        context.bezierCurveTo(startX, startY - lampBaseHeight * 2, startX + lampWidth, startY - lampBaseHeight * 2, startX + lampWidth, startY);
        context.lineTo(startX + lampWidth + out, startY + lampBaseHeight);
        context.bezierCurveTo(startX + lampWidth + out, startY - lampBaseHeight, startX, startY - lampBaseHeight, startX - out, startY + lampBaseHeight);
        context.lineTo(startX, startY);
        context.fill();
        context.stroke();

        context.beginPath();

        context.shadowColor = rgba;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 20 * (1 - rate);

        context.fillStyle = rgba;
        context.strokeStyle = rgba;
        context.moveTo(startX - out, startY + lampBaseHeight);
        context.bezierCurveTo(startX - lampBaseHeight, startY + lampBaseWidth, startX + lampWidth + lampBaseHeight, startY + lampBaseWidth, startX + lampWidth + out, startY + lampBaseHeight);

        context.bezierCurveTo(startX + lampWidth + out, startY - lampBaseHeight, startX, startY - lampBaseHeight, startX - out, startY + lampBaseHeight);
        //context.moveTo(20, 20);
        //context.bezierCurveTo(20, 0, 200, 0, 200, 20);
        //context.lineTo(205, 30);
        //context.bezierCurveTo(205, 10, 20, 10, 15, 30);
        //context.lineTo(20, 20);
        //context.moveTo(15, 30);        
        //context.bezierCurveTo(10, 80, 205, 80, 205, 30);
        context.fill();
        context.stroke();
        context.restore();

        function drawShadow() {
            context.save();
            context.beginPath();
            context.fillStyle = "rgba(255, 255, 255 ,255)";

            let colorShadow = 0;
            let rgbaShadow = `RGBA(${colorShadow}, ${colorShadow}, ${colorShadow}, 255)`;

            context.shadowColor = rgbaShadow;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = -10 - 20 * (1 - rate);
            context.shadowBlur = 50; // * rate;

            context.moveTo(startX, startY);
            context.bezierCurveTo(startX, startY - lampBaseHeight * 2, startX + lampWidth, startY - lampBaseHeight * 2, startX + lampWidth, startY);
            context.lineTo(startX + lampWidth + out, startY + lampBaseHeight);

            context.bezierCurveTo(startX + lampWidth + lampBaseHeight, startY + lampBaseWidth, startX - lampBaseHeight, startY + lampBaseWidth, startX - out, startY + lampBaseHeight);
            context.lineTo(startX, startY);
            context.fill();
            context.restore();
        }

        function drawLight() {
            context.save();
            context.beginPath();
            context.fillStyle = "rgba(255, 255, 255 ,255)";

            let colorShadow = 255;
            let rgbaShadow = `RGBA(${colorShadow}, ${colorShadow}, ${colorShadow}, 255)`;

            context.shadowColor = rgbaShadow;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 30 * (1 - rate);
            context.shadowBlur = 100 * (1 - rate);

            context.moveTo(startX, startY);
            context.bezierCurveTo(startX, startY - lampBaseHeight * 2, startX + lampWidth, startY - lampBaseHeight * 2, startX + lampWidth, startY);
            context.lineTo(startX + lampWidth + out, startY + lampBaseHeight);

            context.bezierCurveTo(startX + lampWidth + lampBaseHeight, startY + lampBaseWidth, startX - lampBaseHeight, startY + lampBaseWidth, startX - out, startY + lampBaseHeight);
            context.lineTo(startX, startY);
            context.fill();
            context.restore();
        }
    }

    function drawBackground(rate) {
        let color = 56 - 20 * rate;
        let rgba = `RGBA(${color}, ${color}, ${color}, 255)`;
        context.fillStyle = rgba;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    let frame = 0;

    function animation() {
        frame %= 2;
        if (frame % 2 == 0) {
            draw();
        }
        frame++;
        window.requestAnimationFrame(animation);
    }


}

var SmartLampViewBuilder = function (canvas) {

    this.canvas = canvas;

    this.build = function () {
        return new SmartLampView(this);
    }
}
