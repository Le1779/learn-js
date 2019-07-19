var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var ErrorView = function (builder) {
    let canvas = builder.canvas;

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;

    initCanvas();

    function initCanvas() {

        //canvas.height = canvas.offsetHeight;
        canvas.height = 300;
        //canvas.width = canvas.offsetWidth;
        canvas.width = 700;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
            requestAnimationFrame(animation);
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);        
        context.font = "250px Arial";
        context.fillText("rror", 250, 220);
        drawBezier(Math.round(Math.random() * (cp.length - 1)));
    }

    var cp = [[158.69, 72.19], [83.5, 225.47], [121.22, 88.25], [50.17, 209.17], [28.48, 180.71]];

    function drawBezier(index) {
        let s = Math.floor(Math.random() * 1);
        let rate = Math.floor(Math.random() * 50);
        cp[index][s] -= rate;

        Math.random()

        context.save();
        context.beginPath();
        context.moveTo(162.34, 156.13);
        context.bezierCurveTo(163.07, 127.66, cp[0][0], cp[0][1], 97.37, 70);
        context.bezierCurveTo(36.06, 67.81, 28.39, 130.4, 29.49, 146.64);

        context.moveTo(153.58, 224.74);
        context.bezierCurveTo(125.47, 236.7, 77.66, 242.26, 52.85, 220);
        context.bezierCurveTo(36.3, 205.16, cp[4][0], cp[4][1], 29.4, 146.64);

        context.moveTo(153.58, 205.04);
        context.bezierCurveTo(cp[1][0], cp[1][1], cp[3][0], cp[3][1], 53.58, 156.13);
        context.lineTo(162.4, 156.13);

        context.moveTo(153.58, 224.01);
        context.lineTo(153.58, 205.77);
        context.lineTo(153.58, 224.01);

        context.moveTo(95.91, 89.71);
        context.bezierCurveTo(cp[2][0], cp[2][1], 134.84, 103.58, 136.79, 135.69);
        context.lineTo(53.34, 135.69);
        context.bezierCurveTo(56.42, 106.5, 70.61, 91.17, 95.91, 89.71);

        context.stroke();
        context.closePath();
        context.restore();

        drawControlPoint(97.37, 70, cp[0][0], cp[0][1]);

        drawControlPoint(162.34, 156.13, 163.07, 127.66);
        drawControlPoint(29.4, 146.64, cp[4][0], cp[4][1]);

        drawControlPoint(153.58, 224.74, 125.47, 236.7);
        drawControlPoint(52.85, 220, 77.66, 242.26);

        drawControlPoint(153.58, 205.04, cp[1][0], cp[1][1]);
        drawControlPoint(53.58, 156.13, cp[3][0], cp[3][1]);

        drawControlPoint(95.91, 89.71, cp[2][0], cp[2][1]);
        drawControlPoint(136.79, 135.69, 134.84, 103.58);
        cp[index][s] += rate;

    }

    function drawControlPoint(x, y, cx, cy) {
        context.save();
        context.beginPath();
        context.rect(cx - 2.5, cy - 2.5, 5, 5);
        context.rect(x * 2 - cx - 2.5, y * 2 - cy - 2.5, 5, 5);
        context.strokeStyle = "#0D95FF";
        context.stroke();
        context.restore();

        context.save();
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.moveTo(cx, cy);
        context.lineTo(x * 2 - cx, y * 2 - cy);
        context.stroke();
        context.restore();
    }

    let frame = 0;

    function animation() {
        frame %= 5;
        if (frame % 5 == 0) {
            draw();
        }
        frame++;
        window.requestAnimationFrame(animation);
    }


}

var ErrorViewBuilder = function (canvas) {

    this.canvas = canvas;

    this.build = function () {
        return new ErrorView(this);
    }
}
