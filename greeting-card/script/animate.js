function blinkingText(obj, duration, delay) {
    let flag = true;

    function animate() {
        obj.animate({
            opacity: flag ? 0 : 1
        }, {
            duration: duration,
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease.easeOutExpo
        })
        flag = !flag;
    }

    let intervalID;
    setTimeout(function () {
        animate();
        intervalID = setInterval(animate, duration);
    }, delay);

    return function () {
        console.log("claer timeout")
        clearInterval(intervalID);
    }
}

function radomText(obj, duration, delay) {
    function animate() {
        var randomX = Math.round(Math.random() * 500);
        var randomY = Math.round(Math.random() * 500);

        obj.animate({
            left: randomX,
            top: randomY
        }, {
            duration: duration,
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease.easeOutExpo
        })
    }

    let intervalID;
    setTimeout(function () {
        animate();
        intervalID = setInterval(animate, duration);
    }, delay);

    return function () {
        clearInterval(intervalID);
    }
}

function rotateText(obj, duration, delay) {
    let flag = true;

    function animate() {
        obj.set('flipY', flag);
        canvas.renderAll();
        flag = !flag;
    }

    let intervalID;
    setTimeout(function () {
        animate();
        intervalID = setInterval(animate, duration);
    }, delay);

    return function () {
        clearInterval(intervalID);
    }
}

function moveText(obj, duration, delay) {
    let flag = true;
    let x = obj.left;
    let from = x - 10;
    let to = x + 10;

    function animate() {
        obj.animate({
            left: flag ? from : to
        }, {
            duration: duration,
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease.easeOutExpo
        })
        flag = !flag;
    }

    let intervalID
    setTimeout(function () {
        animate();
        intervalID = setInterval(animate, duration);
    }, delay);

    return function () {
        clearInterval(intervalID);
    }
}

function signatureText(editText) {
    let mainStyle, fontStyle;
    let main;
    let text = editText.text;

    canvas.discardActiveObject();
    initStyle();
    initObject();

    function initStyle() {
        mainStyle = {
            height: editText.height * editText.scaleY,
            width: editText.width * editText.scaleX,
            left: editText.left,
            top: editText.top,
        };
    }

    function initObject() {
        main = new fabric.Rect(mainStyle);
        canvas.add(main);

        editText.sendToBack();
        editText.selectable = false;
        editText.opacity = 0;
        main.opacity = 1;
    }

    bind();

    function bind() {
        main.on('scaling', scaling);
        main.on('moving', moving);
        main.on('rotating', rotating);
        main.on('mousedblclick', mousedblclick);
        canvas.on('selection:updated', updated);
        canvas.on('selection:cleared', cleared);
        editText.on('editing:exited', exited);
    }

    function unbind() {
        main.off('scaling', scaling);
        main.off('moving', moving);
        main.off('rotating', rotating);
        main.off('mousedblclick', mousedblclick);
        canvas.off('selection:updated', updated);
        canvas.off('selection:cleared', cleared);
        editText.off('editing:exited', exited);
    }

    function scaling() {
        console.log('main scaling')
        var height = main.height * main.scaleY;
        var width = main.width * main.scaleX;
        main.height = height;
        main.width = width;

        main.scaleX = 1;
        main.scaleY = 1;

        editText.scaleToHeight(height);
        editText.scaleToWidth(width);
        editText.set({
            top: main.top,
            left: main.left
        });

        initCanvas();
    }

    function moving() {
        editText.top = main.top;
        editText.left = main.left;
    }

    function rotating() {
        editText.set({
            angle: main.angle,
            top: main.top,
            left: main.left
        });
    }

    function mousedblclick() {
        editText.bringToFront();
        editText.selectable = true;
        canvas.setActiveObject(editText);
        editText.enterEditing();
        editText.selectAll();
        editText.opacity = 1;
        main.opacity = 0;
    }

    function updated() {
        if (canvas.getActiveObject() != editText) {
            editText.sendToBack();
            editText.selectable = false;
            editText.opacity = 0;
            main.opacity = 1;
        }
    }
    
    function cleared() {
        editText.sendToBack();
            editText.selectable = false;
            editText.opacity = 0;
            main.opacity = 1;
    }
    
    function exited() {
        text = editText.text;
            main.height = editText.height * editText.scaleY;
            main.width = editText.width * editText.scaleX;
            initCanvas();
    }

    let dashLen = 220,
        dashOffset = dashLen,
        speed = 5,
        x = 0,
        i = 0;

    let patternCanvas = document.createElement('canvas');
    let ctx;
    let fontSize;

    initCanvas();
    loop();

    function initCanvas() {
        //patternCanvas = document.createElement('canvas');

        ctx = patternCanvas.getContext('2d');
        ctx.canvas.width = main.width * 2;
        ctx.canvas.height = main.height * 2;

        fontSize = main.height * 0.8;
        ctx.font = fontSize + "px " + editText.fontFamily + ", sans-serif";
        ctx.lineWidth = 1;
        ctx.lineJoin = "round";
        //ctx.globalAlpha = 2 / 3;
        ctx.strokeStyle = editText.fill;
        ctx.fillStyle = editText.fill;
    }

    function loop() {
        main.set('fill', new fabric.Pattern({
            source: patternCanvas
        }));
        canvas.renderAll();

        ctx.clearRect(x, 0, fontSize, ctx.canvas.height);
        ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
        dashOffset -= speed; // reduce dash length
        ctx.strokeText(text[i], x, fontSize * 0.9); // stroke letter

        if (editText.styles['0'] != null) {
            if (editText.styles['0'][i] != null) {
                ctx.strokeStyle = editText.styles['0'][i].fill;
                ctx.fillStyle = editText.styles['0'][i].fill;
            } else {
                ctx.strokeStyle = editText.fill;
                ctx.fillStyle = editText.fill;
            }
        }

        if (dashOffset > 0) {
            requestAnimationFrame(loop); // animate
        } else {
            ctx.fillText(text[i], x, fontSize * 0.9); // fill final letter
            dashOffset = dashLen; // prep next char
            x += ctx.measureText(text[i++]).width + ctx.lineWidth * Math.random();
            ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
            ctx.rotate(Math.random() * 0.005); // random rotation
            if (i < text.length) {
                requestAnimationFrame(loop);
            } else {
                dashLen = 220;
                dashOffset = dashLen;
                x = 0;
                i = 0;

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                requestAnimationFrame(loop);
            }
        }
    }

    return function () {
        unbind();
        canvas.remove(main);
        editText.bringToFront();
        editText.selectable = true;
        canvas.setActiveObject(editText);
        editText.enterEditing();
        editText.selectAll();
        editText.opacity = 1;
    }
}