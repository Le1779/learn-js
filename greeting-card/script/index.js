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

$(document).ready(function () {
    init();
    addText();
});

function init() {
    initCanvas();
    initDeleteEvent();
    initTextControl();
    initAddTextButton();
    initTextColorPicker();
    initImageUploadButton();
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
            addText();
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

        function resizeImage(obj) {
            if (obj.width < obj.height) {
                obj.scaleToWidth(canvas.getWidth() * 0.8);
            } else {
                obj.scaleToHeight(canvas.getHeight() * 0.8);
            }


            obj.top = 0;
            obj.left = 0;
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

    function resizeCanvas() {
        canvas.setHeight(window.innerHeight);
        canvas.setWidth(window.innerWidth);
        canvas.renderAll();
    }
};

function addText() {
    var text = new fabric.IText('微風迎客，軟語伴茶', {
        fontFamily: 'HanziPen TC',
        left: Math.floor(Math.random() * canvas.getWidth() * 0.7) + canvas.getWidth() * 0.05,
        top: Math.floor(Math.random() * canvas.getHeight() * 0.7) + canvas.getHeight() * 0.1,
    });

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
