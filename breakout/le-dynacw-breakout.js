var bricksCount = 18;
var bricks = [];

var DynaCWBreakoutBuilder = function (canvas) {

    this.canvas = canvas;

    this.build = function () {
        return new DynaCWBreakout(this);
    }
}


var DynaCWBreakout = function (builder) {
    let canvas = builder.canvas;

    let ctx;
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
        }
    }
}









function initBricks(viewWidth) {
    makeStructure();

    function makeStructure() {
        for (let i = 0; i < bricksCount; i++) {
            bricks[i] = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                r: 0,
                c: 0,
                status: 1
            }
        }
    }

    function makeData() {
        let bracksContainerWidth = canvas.width / 2;
        let margin = bracksContainerWidth * 0.03;
        makeTopBricks();
        makeCenterBricks();
        makeBottomBricks();

        function makeTopBricks() {
            let width = (bracksContainerWidth - margin * 4) / 3;
            let height = bracksContainerWidth * 1.25 * 0.1;

            let preX = margin + brickOffsetLeft;
            bricks[0].x = preX;
            bricks[0].y = margin;
            bricks[0].w = width;
            bricks[0].h = height;
            bricks[0].r = height / 5;
            bricks[0].c = "rgba(0, 0, 0, .65)";
            preX = preX + width;

            bricks[1].x = margin + preX;
            bricks[1].y = margin;
            bricks[1].w = width;
            bricks[1].h = height;
            bricks[1].r = height / 5;
            bricks[1].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            bricks[2].x = margin + preX;
            bricks[2].y = margin;
            bricks[2].w = width;
            bricks[2].h = height;
            bricks[2].r = height / 5;
            bricks[2].c = "rgba(0, 0, 0, .45)";
            let preY = margin + height;
            preX = margin + brickOffsetLeft;

            bricks[3].x = preX;
            bricks[3].y = margin + preY;
            bricks[3].w = width;
            bricks[3].h = height;
            bricks[3].r = height / 5;
            bricks[3].c = "rgba(0, 0, 0, .83)";
            preX = preX + width;

            bricks[4].x = margin + preX;
            bricks[4].y = margin + preY;
            bricks[4].w = width;
            bricks[4].h = height;
            bricks[4].r = height / 5;
            bricks[4].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            bricks[5].x = margin + preX;
            bricks[5].y = margin + preY;
            bricks[5].w = width;
            bricks[5].h = height;
            bricks[5].r = height / 5;
            bricks[5].c = "rgba(0, 0, 0, .83)";
        }

        function makeCenterBricks() {

            let width = (bracksContainerWidth - margin * 5) / 4;
            let height = bracksContainerWidth * 1.25 * 0.1;
            let preX = margin + brickOffsetLeft;
            let preY = margin + height + margin + height;

            bricks[6].x = preX;
            bricks[6].y = margin + preY;
            bricks[6].w = width;
            bricks[6].h = height;
            bricks[6].r = height / 5;
            bricks[6].c = "rgba(0, 0, 0, .83)";
            preX = preX + width;

            bricks[7].x = margin + preX;
            bricks[7].y = margin + preY;
            bricks[7].w = width;
            bricks[7].h = height;
            bricks[7].r = height / 5;
            bricks[7].c = "rgba(217, 38, 89, 1)";
            preX = preX + margin + width;

            bricks[8].x = margin + preX;
            bricks[8].y = margin + preY;
            bricks[8].w = width;
            bricks[8].h = height;
            bricks[8].r = height / 5;
            bricks[8].c = "rgba(0, 0, 0, .65)";
            preX = preX + margin + width;

            bricks[9].x = margin + preX;
            bricks[9].y = margin + preY;
            bricks[9].w = width;
            bricks[9].h = height;
            bricks[9].r = height / 5;
            bricks[9].c = "rgba(0, 0, 0, .83)";

            preY = preY + margin + height;
            preX = margin + brickOffsetLeft;

            bricks[10].x = preX;
            bricks[10].y = margin + preY;
            bricks[10].w = width;
            bricks[10].h = height;
            bricks[10].r = height / 5;
            bricks[10].c = "rgba(0, 0, 0, .5)";
            preX = preX + width;

            bricks[11].x = margin + preX;
            bricks[11].y = margin + preY;
            bricks[11].w = width;
            bricks[11].h = height;
            bricks[11].r = height / 5;
            bricks[11].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            bricks[12].x = margin + preX;
            bricks[12].y = margin + preY;
            bricks[12].w = width;
            bricks[12].h = height;
            bricks[12].r = height / 5;
            bricks[12].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            bricks[13].x = margin + preX;
            bricks[13].y = margin + preY;
            bricks[13].w = width;
            bricks[13].h = height;
            bricks[13].r = height / 5;
            bricks[13].c = "rgba(0, 0, 0, .83)";
        }

        function makeBottomBricks() {
            let width = (bracksContainerWidth - margin * 3) / 2;
            let height = bracksContainerWidth * 1.25 * 0.1;
            let preX = margin + brickOffsetLeft;
            let preY = margin + height + margin + height + margin + height + margin + height;

            bricks[14].x = preX;
            bricks[14].y = margin + preY;
            bricks[14].w = width;
            bricks[14].h = height;
            bricks[14].r = height / 5;
            bricks[14].c = "rgba(0, 0, 0, .65)";
            preX = preX + width;

            bricks[15].x = margin + preX;
            bricks[15].y = margin + preY;
            bricks[15].w = width;
            bricks[15].h = height;
            bricks[15].r = height / 5;
            bricks[15].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            preY = preY + margin + height;
            preX = margin + brickOffsetLeft;

            bricks[16].x = preX;
            bricks[16].y = margin + preY;
            bricks[16].w = width;
            bricks[16].h = height;
            bricks[16].r = height / 5;
            bricks[16].c = "rgba(0, 0, 0, .83)";
            preX = preX + width;

            bricks[17].x = margin + preX;
            bricks[17].y = margin + preY;
            bricks[17].w = width;
            bricks[17].h = height;
            bricks[17].r = height / 5;
            bricks[17].c = "rgba(0, 0, 0, .65)";
        }
    }
}


function init() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 12;
    var dy = -12;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = canvas.width / 4;

    var bricks = [];
    for (let i = 0; i < 18; i++) {
        bricks[i] = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            r: 0,
            c: 0,
            status: 1
        }
    }

    let bracksContainerWidth = canvas.width / 2;
    let margin = bracksContainerWidth * 0.03;
    makeTopBricks();
    makeCenterBricks();
    makeBottomBricks();

    function makeTopBricks() {
        let width = (bracksContainerWidth - margin * 4) / 3;
        let height = bracksContainerWidth * 1.25 * 0.1;

        let preX = margin + brickOffsetLeft;
        bricks[0].x = preX;
        bricks[0].y = margin;
        bricks[0].w = width;
        bricks[0].h = height;
        bricks[0].r = height / 5;
        bricks[0].c = "rgba(0, 0, 0, .65)";
        preX = preX + width;

        bricks[1].x = margin + preX;
        bricks[1].y = margin;
        bricks[1].w = width;
        bricks[1].h = height;
        bricks[1].r = height / 5;
        bricks[1].c = "rgba(0, 0, 0, .83)";
        preX = preX + margin + width;

        bricks[2].x = margin + preX;
        bricks[2].y = margin;
        bricks[2].w = width;
        bricks[2].h = height;
        bricks[2].r = height / 5;
        bricks[2].c = "rgba(0, 0, 0, .45)";
        let preY = margin + height;
        preX = margin + brickOffsetLeft;

        bricks[3].x = preX;
        bricks[3].y = margin + preY;
        bricks[3].w = width;
        bricks[3].h = height;
        bricks[3].r = height / 5;
        bricks[3].c = "rgba(0, 0, 0, .83)";
        preX = preX + width;

        bricks[4].x = margin + preX;
        bricks[4].y = margin + preY;
        bricks[4].w = width;
        bricks[4].h = height;
        bricks[4].r = height / 5;
        bricks[4].c = "rgba(0, 0, 0, .83)";
        preX = preX + margin + width;

        bricks[5].x = margin + preX;
        bricks[5].y = margin + preY;
        bricks[5].w = width;
        bricks[5].h = height;
        bricks[5].r = height / 5;
        bricks[5].c = "rgba(0, 0, 0, .83)";
    }

    function makeCenterBricks() {

        let width = (bracksContainerWidth - margin * 5) / 4;
        let height = bracksContainerWidth * 1.25 * 0.1;
        let preX = margin + brickOffsetLeft;
        let preY = margin + height + margin + height;

        bricks[6].x = preX;
        bricks[6].y = margin + preY;
        bricks[6].w = width;
        bricks[6].h = height;
        bricks[6].r = height / 5;
        bricks[6].c = "rgba(0, 0, 0, .83)";
        preX = preX + width;

        bricks[7].x = margin + preX;
        bricks[7].y = margin + preY;
        bricks[7].w = width;
        bricks[7].h = height;
        bricks[7].r = height / 5;
        bricks[7].c = "rgba(217, 38, 89, 1)";
        preX = preX + margin + width;

        bricks[8].x = margin + preX;
        bricks[8].y = margin + preY;
        bricks[8].w = width;
        bricks[8].h = height;
        bricks[8].r = height / 5;
        bricks[8].c = "rgba(0, 0, 0, .65)";
        preX = preX + margin + width;

        bricks[9].x = margin + preX;
        bricks[9].y = margin + preY;
        bricks[9].w = width;
        bricks[9].h = height;
        bricks[9].r = height / 5;
        bricks[9].c = "rgba(0, 0, 0, .83)";

        preY = preY + margin + height;
        preX = margin + brickOffsetLeft;

        bricks[10].x = preX;
        bricks[10].y = margin + preY;
        bricks[10].w = width;
        bricks[10].h = height;
        bricks[10].r = height / 5;
        bricks[10].c = "rgba(0, 0, 0, .5)";
        preX = preX + width;

        bricks[11].x = margin + preX;
        bricks[11].y = margin + preY;
        bricks[11].w = width;
        bricks[11].h = height;
        bricks[11].r = height / 5;
        bricks[11].c = "rgba(0, 0, 0, .83)";
        preX = preX + margin + width;

        bricks[12].x = margin + preX;
        bricks[12].y = margin + preY;
        bricks[12].w = width;
        bricks[12].h = height;
        bricks[12].r = height / 5;
        bricks[12].c = "rgba(0, 0, 0, .83)";
        preX = preX + margin + width;

        bricks[13].x = margin + preX;
        bricks[13].y = margin + preY;
        bricks[13].w = width;
        bricks[13].h = height;
        bricks[13].r = height / 5;
        bricks[13].c = "rgba(0, 0, 0, .83)";
    }

    function makeBottomBricks() {
        let width = (bracksContainerWidth - margin * 3) / 2;
        let height = bracksContainerWidth * 1.25 * 0.1;
        let preX = margin + brickOffsetLeft;
        let preY = margin + height + margin + height + margin + height + margin + height;

        bricks[14].x = preX;
        bricks[14].y = margin + preY;
        bricks[14].w = width;
        bricks[14].h = height;
        bricks[14].r = height / 5;
        bricks[14].c = "rgba(0, 0, 0, .65)";
        preX = preX + width;

        bricks[15].x = margin + preX;
        bricks[15].y = margin + preY;
        bricks[15].w = width;
        bricks[15].h = height;
        bricks[15].r = height / 5;
        bricks[15].c = "rgba(0, 0, 0, .83)";
        preX = preX + margin + width;

        preY = preY + margin + height;
        preX = margin + brickOffsetLeft;

        bricks[16].x = preX;
        bricks[16].y = margin + preY;
        bricks[16].w = width;
        bricks[16].h = height;
        bricks[16].r = height / 5;
        bricks[16].c = "rgba(0, 0, 0, .83)";
        preX = preX + width;

        bricks[17].x = margin + preX;
        bricks[17].y = margin + preY;
        bricks[17].w = width;
        bricks[17].h = height;
        bricks[17].r = height / 5;
        bricks[17].c = "rgba(0, 0, 0, .65)";
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(217, 38, 89, 1)";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "rgba(217, 38, 89, 1)";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        ctx.strokeStyle = "rgba(255, 255, 255, 0)";
        for (let i = 0; i < 18; i++) {
            if (bricks[i].status == 1) {
                ctx.fillStyle = bricks[i].c;
                roundRect(ctx, bricks[i].x, bricks[i].y, bricks[i].w, bricks[i].h, bricks[i].r, true);
            }
        }



    }

    function collisionDetection() {
        for (let i = 0; i < 18; i++) {
            var b = bricks[i];
            if (b.status == 1) {
                if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) {
                    dy = -dy;
                    b.status = 0;
                }
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                if (y = y - paddleHeight) {
                    dy = -dy;
                }
            } else {
                //alert("GAME OVER");
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    }

    var interval = setInterval(draw, 10);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {
            tl: radius,
            tr: radius,
            br: radius,
            bl: radius
        };
    } else {
        var defaultRadius = {
            tl: 0,
            tr: 0,
            br: 0,
            bl: 0
        };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}
