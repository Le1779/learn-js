var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var RippleView = function (builder) {
    let canvas = builder.canvas;
    let max = builder.max;
    let progress = builder.progress;

    if (progress > max) {
        return;
    }

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;

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

    let ripple1 = 0;
    let ripple2 = 15;
    let ripple3 = 30;
    let ripple4 = 45;
    let ripple5 = 60;

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawRipple(ripple1 %= 60);
        drawRipple(ripple2 %= 60);
        drawRipple(ripple3 %= 60);
        drawRipple(ripple4 %= 60);

        ripple1++;
        ripple2++;
        ripple3++;
        ripple4++;
    }

    function drawCenter() {
        context.save();
        context.beginPath();
        context.fillStyle = "#FFFFFF";
        //context.lineWidth = viewWidth * 0.06;
        context.arc(centerX, 0, viewWidth * 0.047, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        context.restore();
    }

    function drawRipple(frame) {
        context.save();
        context.beginPath();
        context.strokeStyle = "#0D95FF";

        let radius = viewWidth * 0.48 * (frame / 60);

        let width = viewWidth * 0.4 * 0.3;
        context.globalAlpha = 1 - frame / 60;
        context.lineWidth = width;
        context.arc(centerX, -viewWidth * 0.060, radius, 0, 2 * Math.PI);
        context.stroke();
        context.closePath();
        context.restore();
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

var RippleViewBuilder = function (canvas) {

    this.canvas = canvas;

    this.setMax = function (max) {
        this.max = max;
        return this;
    }

    this.setProgress = function (progress) {
        this.progress = progress;
        return this;
    }

    this.build = function () {
        return new RippleView(this);
    }
}
