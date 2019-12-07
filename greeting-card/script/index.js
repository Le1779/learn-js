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
        $('.anim').click(function () {
            blinkingText(canvas.getActiveObject(), 500);
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
    textControl.show();
    positionTextControl(obj);
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

    setTest();

    addSignatureText("聖誕快樂", {
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

    function setTest() {
        var dashLen = 220,
            dashOffset = dashLen,
            speed = 5,
            txt = "聖誕快樂",
            x = 0,
            i = 0;

        let patternCanvas = document.createElement('canvas');
        let ctx;

        let shape = new fabric.Rect({
            width: 320,
            height: 100,
            left: 10,
            top: 300,
        });

        shape.width = shape.height * 0.8 * 4;

        let fontSize;

        initCanvas();
        shape.on('scaling', function () {
            var height = shape.height * shape.scaleY;
            var width = shape.width * shape.scaleX;
            shape.height = height;
            shape.width = width;
            shape.scaleX = 1;
            shape.scaleY = 1;
            initCanvas();
        });

        loop()
        canvas.add(shape);

        function initCanvas() {
            patternCanvas = document.createElement('canvas');

            ctx = patternCanvas.getContext('2d');
            ctx.canvas.width = shape.width * 2;
            ctx.canvas.height = shape.height * 2;

            fontSize = shape.height * 0.8;
            ctx.font = fontSize + "px Love, sans-serif";
            ctx.lineWidth = 2;
            ctx.lineJoin = "round";
            //ctx.globalAlpha = 2 / 3;
            ctx.strokeStyle = "#ff4040";
            ctx.fillStyle = "#ff4040";
        }

        function loop() {
            shape.set('fill', new fabric.Pattern({
                source: patternCanvas
            }));
            canvas.renderAll();

            ctx.clearRect(x, 0, fontSize, ctx.canvas.height);
            ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
            dashOffset -= speed; // reduce dash length
            ctx.strokeText(txt[i], x, fontSize); // stroke letter

            if (dashOffset > 0) {
                requestAnimationFrame(loop); // animate
            } else {
                ctx.fillText(txt[i], x, fontSize); // fill final letter
                dashOffset = dashLen; // prep next char
                x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
                ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
                ctx.rotate(Math.random() * 0.005); // random rotation
                if (i < txt.length) {
                    requestAnimationFrame(loop);
                } else {
                    dashLen = 220;
                    dashOffset = dashLen;
                    x = 0;
                    i = 0;

                    requestAnimationFrame(loop);
                }
            }
        }
    }


    function addSignatureText(t, style) {
        let mainStyle, fontStyle;
        let main, editText;

        initStyle();
        initObject();
        initGroup();

        function initStyle() {
            mainStyle = {
                height: style.height,
                left: style.left,
                top: style.top,
            };
            mainStyle.width = mainStyle.height * 0.8 * t.length;

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
            editText = addText(t, 'Love', fontStyle);

            main.on('scaling', function () {
                console.log('main scaling')
            });
        }

        function initGroup() {
            let items = [];
            items.push(editText);
            items.push(main);
            let group = new fabric.Group(items.reverse(), {subTargetCheck: true});
            canvas.add(group);
            
            group.on('mousedblclick', function () {
                ungroup(group);
                canvas.setActiveObject(editText);
                editText.enterEditing();
                editText.selectAll();
            });
            
            group.on('scaling', function () {
                console.log('group scaling')
            });

            function ungroup(group) {
                items = group._objects;
                group._restoreObjectsState();
                canvas.remove(group);
                for (var i = 0; i < items.length; i++) {
                    canvas.add(items[i]);
                }
            }
        }

        editText.on('editing:exited', function () {
            console.log(editText);
            canvas.remove(main);
            canvas.remove(editText);
            initGroup();
        });
    }
}
