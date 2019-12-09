var canvas;
var textControl;
var selectedObj;
var color = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff4040',
    orange: '#ff6518',
    yellow: '#ffbb3b',
    green: '#03bd9e',
    light_blue: '#00a9ff',
    blue: '#515ce6',
    purple: '#9e5fff',
    pink: '#ff5583'
}

var gif = new GIF({
    workers: 2,
    quality: 30,
    workerScript: './script/gif.worker.js'
});

$(document).ready(function () {
    init();
    makeDefaultObject();
});

function init() {
    initCanvas();
    initDeleteEvent();
    initTextControl();
    initAddTextButton();
    initTextColorPicker();
    initImageUploadButton();
    initAnimateSelector();
    selectedObject(null);
    resizeCanvas();

    $(window).resize(function () {
        resizeCanvas();
    });

    function initCanvas() {
        canvas = new fabric.Canvas('myCanvas', {});
        canvas.preserveObjectStacking = true;

        fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
            return {
                left: object.left + this._offset.left,
                top: object.top + this._offset.top
            };
        }

        canvas.on('selection:updated', function () {
            console.log("canvas selection updated");
            selectedObject(null);
        });

        canvas.on('selection:cleared', function () {
            console.log("canvas selection cleared");
            selectedObject(null);
        });

    }

    function initTextControl() {
        textControl = $('.text_control_container');
    }

    function initAddTextButton() {
        $('.add-text-button').click(function () {
            addText('微風迎客，軟語伴茶', 'HanziPen TC');
        });
    }

    function initTextColorPicker() {
        $('.color').click(function () {
            let className = $(this).attr('class').split(' ');
            let style = {
                fill: color[className[1]]
            };
            canvas.getActiveObject().setSelectionStyles(style).setCoords();

            canvas.renderAll();
        });
    }

    function initImageUploadButton() {
        document.getElementById('load-image').onchange = function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var imgObj = new Image();
                imgObj.src = event.target.result;
                imgObj.onload = function () {
                    var image = new fabric.Image(imgObj);
                    image.set({
                        left: 0,
                        top: 0,
                    });
                    canvas.centerObject(image);
                    resizeImage(image);
                    canvas.add(image);
                    canvas.sendToBack(image)
                    canvas.renderAll();
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function initDeleteEvent() {
        $(document).keyup(function (e) {
            if (e.keyCode == 46 || e.keyCode == 8) {
                if (!canvas.getActiveObject().isEditing) {
                    canvas.remove(canvas.getActiveObject());
                }
            }
        });
    }

    function initAnimateSelector() {
        $('#blinking').click(function () {
            let func = canvas.getActiveObject().id;
            if (typeof func !== 'undefined' && $.isFunction(func)) {
                func();
            }
            canvas.getActiveObject().id = blinkingText(canvas.getActiveObject(), 500);
        });

        $('#handwriting').click(function () {
            let func = canvas.getActiveObject().id;
            if (typeof func !== 'undefined' && $.isFunction(func)) {
                func();
            }
            let selectObj = canvas.getActiveObject();
            selectObj.id = signatureText(selectObj);
        });
    }

    function resizeCanvas() {
        canvas.setHeight(window.innerHeight);
        canvas.setWidth(window.innerWidth);
        canvas.renderAll();
    }
};

function addText(t, font, style) {
    let text;
    if (style == null) {
        text = new fabric.IText(t, {
            fontFamily: font,
            left: Math.floor(Math.random() * canvas.getWidth() * 0.7) + canvas.getWidth() * 0.05,
            top: Math.floor(Math.random() * canvas.getHeight() * 0.7) + canvas.getHeight() * 0.1,
        });
    } else {
        text = new fabric.IText(t, style);
    }

    canvas.add(text);

    text.on('moving', function () {
        positionTextControl(text)
    });

    text.on('scaling', function () {
        positionTextControl(text)
    });

    text.on('rotating', function () {
        positionTextControl(text);
    });

    text.on('changed', function () {
        positionTextControl(text);
    });

    text.on('mouseup', function () {
        selectedObject(text);
    });

    return text;
}

function changeFont(obj, fontName) {
    obj.fontFamily = fontName;
    canvas.renderAll();
}

function selectedObject(obj) {
    selectedObj = obj;
    if (obj == null) {
        textControl.hide();
        return;
    }
    if (obj.top > 0 && obj.left > 0) {
        textControl.show();
        positionTextControl(obj);
    }
}

function positionTextControl(obj) {
    let absCoords = canvas.getAbsoluteCoords(obj);
    let width = obj.width * obj.scaleX;
    let height = obj.height * obj.scaleY;
    let centerPoint = obj.getCenterPoint();

    textControl.css({
        "top": centerPoint.y - height * 0.5,
        "left": centerPoint.x + width * 0.5 + 10
    });
}

var fontControl = $('#font-control');
$(document.body).on('change', '#font-control', function () {
    if (selectedObj != null) {
        selectedObj.fontFamily = fontControl.val();
        canvas.renderAll();
    }
});

function saveImage() {
    console.log('export image');
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement("a");

    link.href = image;
    link.download = 'image.png';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function saveAsGIF() {
    let renderFinished = false;
    window.requestAnimationFrame(ad);
    //setInterval(ad, 17);
    function ad() {
        addFrame(document.getElementById('myCanvas'));
        window.requestAnimationFrame(ad);
    }
    gif.on('finished', function (blob) {
        window.open(URL.createObjectURL(blob));
    });

    function addFrame(canvas) {
        if (renderFinished) {
            return;
        }
        if (gif.frames.length < 60) {
            console.log('add frame: ' + gif.frames.length);
            gif.addFrame(canvas, {
                delay: 204
            });
        } else {
            console.log('add frame end');
            renderFinished = true;
            gif.render();
        }
    }
}

function resizeImage(obj) {
    if (obj.width < obj.height) {
        obj.scaleToWidth(canvas.getWidth() * 1);
    } else {
        obj.scaleToHeight(canvas.getHeight() * 1);
    }


    obj.top = 0;
    obj.left = 0;
}

function makeDefaultObject() {
    setBackground();
    let style = {
        fontFamily: 'Love',
        fill: '#03bd9e',
        fontSize: canvas.getHeight() * 0.09,
        left: canvas.getHeight() * 0.25,
        top: canvas.getHeight() * 0.55,
    }
    let t1 = addText('聖誕快樂', 'Love', style);
    //rotateText(t1, 500);

    style.fill = '#ff4040'
    style.left += 5;
    style.top += 2;
    let t2 = addText('聖誕快樂', 'Love', style);
    //rotateText(t2, 500);

    style = {
        fontFamily: 'Love',
        fill: '#161616',
        fontSize: canvas.getHeight() * 0.05,
        left: canvas.getHeight() * 0.7,
        top: canvas.getHeight() * 0.77,
    }
    let t3 = addText('NTD', 'Love', style);
    //moveText(t3, 500);

    //setTest();

    addSignatureText("測試看看", {
        height: canvas.getHeight() * 0.09,
        left: canvas.getHeight() * 0.25,
        top: canvas.getHeight() * 0.65,
        fontFamily: 'Love',
        fill: '#03bd9e',
    });


    function setBackground() {
        fabric.Image.fromURL('background.jpg', function (img) {
            let image = img.set({
                left: 0,
                top: 0,
            });
            canvas.centerObject(image);
            resizeImage(image);
            canvas.add(image);
            canvas.sendToBack(image)
            canvas.renderAll();
        });
    }
}

function addSignatureText(text, style) {
    let mainStyle, fontStyle;
    let main, editText;

    initStyle();
    initObject();

    function initStyle() {
        mainStyle = {
            height: style.height,
            left: style.left,
            top: style.top,
        };
        mainStyle.width = mainStyle.height * 0.8 * text.length;

        fontStyle = {
            height: mainStyle.height,
            width: mainStyle.width,
            left: mainStyle.left,
            top: mainStyle.top,
            fontFamily: style.fontFamily,
            fill: style.fill,
            fontSize: mainStyle.height * 0.8,
            opacity: 1,
        }
    }

    function initObject() {
        main = new fabric.Rect(mainStyle);
        canvas.add(main);
        editText = addText(text, 'Love', fontStyle);

        console.log(main);
        console.log(editText);
        editText.sendToBack();
        editText.selectable = false;
        editText.opacity = 0;
        main.opacity = 1;

        main.on('scaling', function () {
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
        });

        main.on('moving', function () {
            editText.top = main.top;
            editText.left = main.left;
            console.log('main moving')
        });

        main.on('rotating', function () {
            editText.set({
                angle: main.angle,
                top: main.top,
                left: main.left
            });
        });

        main.on('mousedblclick', function () {
            console.log('mousedblclick');
            editText.bringToFront();
            editText.selectable = true;
            canvas.setActiveObject(editText);
            editText.enterEditing();
            editText.selectAll();
            editText.opacity = 1;
            main.opacity = 0;
        });

        canvas.on('selection:updated', function () {
            if (canvas.getActiveObject() != editText) {
                editText.sendToBack();
                editText.selectable = false;
                editText.opacity = 0;
                main.opacity = 1;
            }
        });

        canvas.on('selection:cleared', function () {
            editText.sendToBack();
            editText.selectable = false;
            editText.opacity = 0;
            main.opacity = 1;
        });

        editText.on('editing:exited', function () {
            console.log(editText);
            text = editText.text;
            main.height = editText.height * editText.scaleY;
            main.width = editText.width * editText.scaleX;
            initCanvas();
        });
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
}
