var Point = function (x, y) {
    this.x = x;
    this.y = y;
}

var LampSwitchView = function (builder) {
    let canvas = builder.canvas;

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;
    let powerRate = 0;
    let margin = 10;
    let borderRadius = 20;

    let isTouch = false;
    let touchRate = 0;
    let callback;
    
    this.setCallback = function(c){
        callback = c;
    }

    this.onMouseDown = function (e) {
        isTouch = true;
    }

    this.onMouseMove = function (e) {
        if (isTouch) {
            
            let currentY = e.offsetY - margin;
            if (currentY >= 0) {
                touchRate = e.offsetY / (viewHeight-margin*2);                
                touchRate = 1 - touchRate;
                touchRate *= 10;
                touchRate = Math.ceil(touchRate);
                touchRate /= 10;
                //console.log("touchRate: " + touchRate);
            }
        }
    }

    this.onMouseUp = function (e) {
        isTouch = false;
    }

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
        drawBackground();
        drawSwitch(touchRate);
    }

    function drawSwitch(rate) {
        if (rate < 0.2) {
            callback(1);
            return;
        }
        rate = 1 - rate;
        callback(rate);
        context.save();
        context.beginPath();
        context.fillStyle = "rgba(255, 255, 255, 1)";

        let p1 = new Point(margin, margin + borderRadius);
        let p2 = new Point(margin, viewHeight - margin - borderRadius);
        let p3 = new Point(viewWidth - margin - borderRadius, viewHeight - margin);
        let p4 = new Point(viewWidth - margin, margin + borderRadius);
        let p5 = new Point(margin + borderRadius, margin);

        let c1 = new Point(p2.x + borderRadius, viewHeight - margin - borderRadius);
        let c2 = new Point(p3.x, viewHeight - margin - borderRadius);
        let c3 = new Point(p4.x - borderRadius, margin + borderRadius);
        let c4 = new Point(p5.x, margin + borderRadius);

        p1.y += viewHeight * rate;
        p4.y += viewHeight * rate;
        p5.y += viewHeight * rate;

        c3.y += viewHeight * rate;
        c4.y += viewHeight * rate;

        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.arc(c1.x, c1.y, borderRadius, Math.PI, 0.5 * Math.PI, true);

        context.lineTo(p3.x, p3.y);
        context.arc(c2.x, c2.y, borderRadius, 0.5 * Math.PI, 2 * Math.PI, true);

        context.lineTo(p4.x, p4.y);
        context.arc(c3.x, c3.y, borderRadius, 0, 1.5 * Math.PI, true);

        context.lineTo(p5.x, p5.y);
        context.arc(c4.x, c4.y, borderRadius, 1.5 * Math.PI, 1 * Math.PI, true);

        //context.lineTo(margin, viewHeight - margin - borderRadius);

        context.fill();
        context.restore();

        context.save();
        context.fillStyle = "rgba(150, 150, 150, 1)";
        context.fillRect(p5.x + margin * 2, p1.y - margin, viewWidth - margin * 10, margin / 2);
        context.restore();

        context.font = "bold " + viewWidth / 5 + "px Arial";
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.textAlign = "center";
        
        let showText = (1-rate) * 100;
        showText = Math.ceil(showText);
        context.fillText(showText + "%", viewWidth / 2, p1.y + margin * 3);
    }

    function drawBackground() {
        context.save();
        context.beginPath();
        context.fillStyle = "rgba(255, 255, 255, 0.3)";

        let p1 = new Point(margin, margin + borderRadius);
        let p2 = new Point(margin, viewHeight - margin - borderRadius);
        let p3 = new Point(viewWidth - margin - borderRadius, viewHeight - margin);
        let p4 = new Point(viewWidth - margin, margin + borderRadius);
        let p5 = new Point(margin + borderRadius, margin);

        let c1 = new Point(p2.x + borderRadius, viewHeight - margin - borderRadius);
        let c2 = new Point(p3.x, viewHeight - margin - borderRadius);
        let c3 = new Point(p4.x - borderRadius, margin + borderRadius);
        let c4 = new Point(p5.x, margin + borderRadius);

        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.arc(c1.x, c1.y, borderRadius, Math.PI, 0.5 * Math.PI, true);

        context.lineTo(p3.x, p3.y);
        context.arc(c2.x, c2.y, borderRadius, 0.5 * Math.PI, 2 * Math.PI, true);

        context.lineTo(p4.x, p4.y);
        context.arc(c3.x, c3.y, borderRadius, 0, 1.5 * Math.PI, true);

        context.lineTo(p5.x, p5.y);
        context.arc(c4.x, c4.y, borderRadius, 1.5 * Math.PI, 1 * Math.PI, true);

        //context.lineTo(margin, viewHeight - margin - borderRadius);

        context.fill();
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

var LampSwitchViewBuilder = function (canvas) {

    this.canvas = canvas;

    this.build = function () {
        return new LampSwitchView(this);
    }
}
