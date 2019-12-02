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

    

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawText();
    }

    function drawText() {
        context.save();
        context.beginPath();
        context.fillStyle = "#000000";
        //context.lineWidth = viewWidth * 0.06;
        context.fillText("Hello World", 10, 50);
        
        context.fill();
        context.closePath();
        context.restore();
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
