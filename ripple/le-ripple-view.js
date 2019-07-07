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
        //drawCenter();
        //drawRipple(ripple5 %= 60);

        ripple1++;
        ripple2++;
        ripple3++;
        ripple4++;

        //ripple5++;
        //drawBackgroundCircle();
        //drawHint();
        //drawProgressCircle();
        //drawPercent();
        //drawProgressText();

        function drawBackgroundCircle() {
            context.save();
            context.beginPath();
            context.strokeStyle = "#E6E6E6";
            context.lineWidth = viewWidth / 20;
            context.arc(centerX, centerY + viewHeight / 4 - 15, viewWidth * 0.3, 0.1 * Math.PI, 0.9 * Math.PI, true);
            context.stroke();
            context.closePath();
            context.restore();
        }

        function drawHint() {
            context.save();
            context.fillStyle = "#AAA";
            context.font = "15px Arial";
            context.textAlign = "start";
            context.textBaseline = "middle";
            context.fillText("0%", centerX - viewWidth * 0.3, viewHeight - 15);
            context.textAlign = "end";
            context.fillText("100%", centerX + viewWidth * 0.3, viewHeight - 15);
            context.restore();
        }

        function drawProgressCircle() {
            context.save();
            let percentagePoint = 1.2 / max;
            let percent = -1.1 + progress * percentagePoint;
            context.beginPath();
            context.strokeStyle = "#00C58D";
            context.lineWidth = viewWidth / 20;
            context.arc(centerX, centerY + viewHeight / 4 - 15, viewWidth * 0.3, percent * Math.PI, 0.9 * Math.PI, true);
            context.stroke();
            context.closePath();
            context.restore();
        }

        function drawPercent() {
            context.save();
            let percent = Math.round(progress / max * 1000) / 10;
            context.fillStyle = "#3D4060";
            context.font = "bold 60px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(percent + "%", centerX, viewHeight - 60);
            context.restore();
        }

        function drawProgressText() {
            context.save();
            let percent = Math.round(progress / max * 1000) / 10;
            context.font = "30px Arial";
            context.textBaseline = "middle";

            context.fillStyle = "#00C58D";
            context.textAlign = "end";
            context.fillText(progress, centerX - 10, centerY);

            context.fillStyle = "#3D4060";
            context.textAlign = "center";
            context.fillText("/", centerX, centerY);

            context.fillStyle = "#AAA";
            context.textAlign = "start";
            context.fillText(max, centerX + 10, centerY);
            context.restore();
        }
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
        //if(radius <= width){            
        //    width *= (frame / 0.3 / 60);
        //    radius = width;
        //}
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
