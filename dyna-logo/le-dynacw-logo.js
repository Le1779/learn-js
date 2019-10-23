var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var DynaCWLogo = function (builder) {
    let canvas = builder.canvas;
    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;
    let margin;

    let block = [];

    initCanvas();
    initBlock();
    var interval = setInterval(draw, 20);

    function initCanvas() {
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        margin = viewWidth * 0.03;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
        }
    }

    function initBlock() {
        for (let i = 0; i < 18; i++) {
            block[i] = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                r: 1,
                c: 0
            }
        }

        makeTopBlock();
        makeCenterBlock();
        makeBottomBlock();

        function makeTopBlock() {
            let width = (viewWidth - margin * 4) / 3;
            let height = viewWidth * 1.25 * 0.1;

            let preX = margin;
            block[0].x = preX;
            block[0].y = margin;
            block[0].w = width;
            block[0].h = height;
            block[0].c = "rgba(0, 0, 0, .65)";
            preX = preX + width;

            block[1].x = margin + preX;
            block[1].y = margin;
            block[1].w = width;
            block[1].h = height;
            block[1].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            block[2].x = margin + preX;
            block[2].y = margin;
            block[2].w = width;
            block[2].h = height;
            block[2].c = "rgba(0, 0, 0, .45)";
            let preY = margin + height;
            preX = margin;

            block[3].x = preX;
            block[3].y = margin + preY;
            block[3].w = width;
            block[3].h = height;
            block[3].c = "rgba(0, 0, 0, .83)";
            preX = preX + width;

            block[4].x = margin + preX;
            block[4].y = margin + preY;
            block[4].w = width;
            block[4].h = height;
            block[4].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            block[5].x = margin + preX;
            block[5].y = margin + preY;
            block[5].w = width;
            block[5].h = height;
            block[5].c = "rgba(0, 0, 0, .83)";
        }

        function makeCenterBlock() {

            let width = (viewWidth - margin * 5) / 4;
            let height = viewWidth * 1.25 * 0.1;
            let preX = margin;
            let preY = margin + height + margin + height;

            block[6].x = preX;
            block[6].y = margin + preY;
            block[6].w = width;
            block[6].h = height;
            block[6].c = "rgba(0, 0, 0, .83)";
            preX = preX + width;

            block[7].x = margin + preX;
            block[7].y = margin + preY;
            block[7].w = width;
            block[7].h = height;
            block[7].c = "rgba(217, 38, 89, 1)";
            preX = preX + margin + width;

            block[8].x = margin + preX;
            block[8].y = margin + preY;
            block[8].w = width;
            block[8].h = height;
            block[8].c = "rgba(0, 0, 0, .65)";
            preX = preX + margin + width;

            block[9].x = margin + preX;
            block[9].y = margin + preY;
            block[9].w = width;
            block[9].h = height;
            block[9].c = "rgba(0, 0, 0, .83)";

            preY = preY + margin + height;
            preX = margin;

            block[10].x = preX;
            block[10].y = margin + preY;
            block[10].w = width;
            block[10].h = height;
            block[10].c = "rgba(0, 0, 0, .5)";
            preX = preX + width;

            block[11].x = margin + preX;
            block[11].y = margin + preY;
            block[11].w = width;
            block[11].h = height;
            block[11].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            block[12].x = margin + preX;
            block[12].y = margin + preY;
            block[12].w = width;
            block[12].h = height;
            block[12].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            block[13].x = margin + preX;
            block[13].y = margin + preY;
            block[13].w = width;
            block[13].h = height;
            block[13].c = "rgba(0, 0, 0, .83)";
        }

        function makeBottomBlock() {
            let width = (viewWidth - margin * 3) / 2;
            let height = viewWidth * 1.25 * 0.1;
            let preX = margin;
            let preY = margin + height + margin + height + margin + height + margin + height;

            block[14].x = preX;
            block[14].y = margin + preY;
            block[14].w = width;
            block[14].h = height;
            block[14].c = "rgba(0, 0, 0, .65)";
            preX = preX + width;

            block[15].x = margin + preX;
            block[15].y = margin + preY;
            block[15].w = width;
            block[15].h = height;
            block[15].c = "rgba(0, 0, 0, .83)";
            preX = preX + margin + width;

            preY = preY + margin + height;
            preX = margin;

            block[16].x = preX;
            block[16].y = margin + preY;
            block[16].w = width;
            block[16].h = height;
            block[16].c = "rgba(0, 0, 0, .83)";
            preX = preX + width;

            block[17].x = margin + preX;
            block[17].y = margin + preY;
            block[17].w = width;
            block[17].h = height;
            block[17].c = "rgba(0, 0, 0, .65)";
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "rgba(255, 255, 255, 0)";

        transformBlock();
        for (let i = 0; i < 18; i++) {
            context.fillStyle = block[i].c;
            let x = block[i].x + (block[i].w - block[i].w * block[i].r) / 2;
            let y = block[i].y + (block[i].h - block[i].h * block[i].r) / 2;
            roundRect(context, x, y, block[i].w * block[i].r, block[i].h * block[i].r, block[i].h * block[i].r / 8, true);
        }
    }

    let rate = 1;
    let d = 0.05;
    let dirDown = true;

    let level1Rate = 1;
    let level2Rate = 1;
    let level3Rate = 1;
    let level4Rate = 1;

    let level1Down = true;
    let level2Down = true;
    let level3Down = true;
    let level4Down = true;

    let level1Start = true;
    let level2Start = false;
    let level3Start = false;
    let level4Start = false;

    function transformBlock() {

        transformLevel1Block();
        transformLevel2Block();
        transformLevel3Block();
        transformLevel4Block();

        function transformLevel1Block() {
            if (!level1Start) {
                return;
            }
            
            block[7].r = level1Rate;
            if (level1Rate <= 0) {
                level1Down = false;
                level1Start = false;
            }

            if (level1Rate > 1) {
                level1Down = true;
                level1Start = false;
            }

            if (level1Down) {
                level1Rate -= d;
            } else {
                level1Rate += d;
            }

            if (level2Down && level1Rate <= 0.5) {
                level2Start = true;
            }
            
            if (!level2Down && level1Rate > 0.5) {
                level2Start = true;
            }
        }

        function transformLevel2Block() {
            if (!level2Start) {
                return;
            }

            block[8].r = level2Rate;
            block[11].r = level2Rate;
            block[12].r = level2Rate;

            if (level2Rate <= 0) {
                level2Down = false;
                level2Start = false;
            }

            if (level2Rate > 1) {
                level2Down = true;
                level2Start = false;
            }

            if (level2Down) {
                level2Rate -= d;
            } else {
                level2Rate += d;
            }
            
            if (level3Down && level2Rate <= 0.5) {
                level3Start = true;
            }
            
            if (!level3Down && level2Rate > 0.5) {
                level3Start = true;
            }
        }

        function transformLevel3Block() {
            if (!level3Start) {
                return;
            }

            block[3].r = level3Rate;
            block[4].r = level3Rate;
            block[5].r = level3Rate;

            block[6].r = level3Rate;
            block[9].r = level3Rate;
            block[10].r = level3Rate;
            block[13].r = level3Rate;

            block[14].r = level3Rate;
            block[15].r = level3Rate;

            if (level3Rate <= 0) {
                level3Down = false;
                level3Start = false;
            }

            if (level3Rate > 1) {
                level3Down = true;
                level3Start = false;
            }

            if (level3Down) {
                level3Rate -= d;
            } else {
                level3Rate += d;
            }
            
            if (level4Down && level3Rate <= 0.5) {
                level4Start = true;
            }
            
            if (!level4Down && level3Rate > 0.5) {
                level4Start = true;
            }
        }

        function transformLevel4Block() {
            if (!level4Start) {
                return;
            }

            block[0].r = level4Rate;
            block[1].r = level4Rate;
            block[2].r = level4Rate;

            block[16].r = level4Rate;
            block[17].r = level4Rate;

            if (level4Rate <= 0) {
                level4Down = false;
                level4Start = false;
                level1Start = true;
            }

            if (level4Rate > 1) {
                level4Down = true;
                level4Start = false;
                level1Start = true;
            }

            if (level4Down) {
                level4Rate -= d;
            } else {
                level4Rate += d;
            }
        }
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
}

var DynaCWLogoBuilder = function (canvas) {

    this.canvas = canvas;

    this.build = function () {
        return new DynaCWLogo(this);
    }
}
