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
    
    let margin = 10;

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        margin = viewWidth * 0.03;
        
        drawTopBlock();
        drawCenterBlock();
        drawBottomBlock();
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

    function drawTopBlock() {
        context.strokeStyle = "rgba(255, 255, 255, 0)";
        let width = (viewWidth - margin * 4) / 3;
        let height = viewWidth * 1.25 * 0.1;
        let preX = margin;
        context.fillStyle = "rgba(0, 0, 0, .65)";
        roundRect(context, preX, margin, width, height, height/5, true);
        preX = preX + width;
        
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, margin + preX, margin, width, height, height/5, true);
        preX = preX + margin + width;
        
        context.fillStyle = "rgba(0, 0, 0, .45)";
        roundRect(context, margin + preX, margin, width, height, height/5, true);
        
        let preY = margin + height;
        preX = margin;
        
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, preX, margin + preY, width, height, height/5, true);
        preX = preX + width;
        
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        preX = preX + margin + width;
        
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
    }
    
    function drawCenterBlock(){
        context.strokeStyle = "rgba(255, 255, 255, 0)";
        let width = (viewWidth - margin * 5) / 4;
        let height = viewWidth * 1.25 * 0.1;
        let preX = margin;
        let preY = margin + height + margin + height;
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, preX, margin + preY, width, height, height/5, true);
        preX = preX + width;
        
        context.fillStyle = "rgba(217, 38, 89, 1)";
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        preX = preX + margin + width;
        
        context.fillStyle = "rgba(0, 0, 0, .65)";
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        preX = preX + margin + width;
        
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        
        preY = preY + margin + height;
        preX = margin;
        
        context.fillStyle = "rgba(0, 0, 0, .5)";
        roundRect(context, preX, margin + preY, width, height, height/5, true);
        preX = preX + width;
        
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        preX = preX + margin + width;
        
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        preX = preX + margin + width;
        
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
    }
    
    function drawBottomBlock() {
        context.strokeStyle = "rgba(255, 255, 255, 0)";
        let width = (viewWidth - margin * 3) / 2;
        let height = viewWidth * 1.25 * 0.1;
        let preX = margin;
        let preY = margin + height + margin + height + margin + height + margin + height;
        context.fillStyle = "rgba(0, 0, 0, .65)";
        roundRect(context, preX, margin + preY, width, height, height/5, true);
        preX = preX + width;
        
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
        preX = preX + margin + width;
        
        preY = preY + margin + height;
        preX = margin;
        
        context.fillStyle = "rgba(0, 0, 0, .83)";
        roundRect(context, preX, margin + preY, width, height, height/5, true);
        preX = preX + width;
        
        context.fillStyle = "rgba(0, 0, 0, .65)";
        roundRect(context, margin + preX, margin + preY, width, height, height/5, true);
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
