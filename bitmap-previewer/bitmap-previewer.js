var BitmapPreviewer = function (builder) {
    var fontData;
    var codeMap = new Map();
    var fontCodeList = [];
    var scale;

    var container = $('#bitmap-preview');
    var input;
    var canvas;
    var context;
    generateComponent();
    input.val(builder.defaultText)

    $(window).resize(onScreenResize);
    onScreenResize();

    getCodeMap();

    function generateComponent() {
        generateInput();
        generateCanvas();

        function generateInput() {
            var html = '<input type="text" id="bitmap-preview-input">';
            container.append(html);

            input = $('#bitmap-preview-input');
            input.keyup(function () {
                onScreenResize();
                generateFontCodeList();
            });
        }

        function generateCanvas() {
            var html = '<canvas id="bitmap-preview-canvas" width="200" height="200" style="border:1px solid #000000;">Your browser does not support the canvas element.</canvas>';
            container.append(html);

            canvas = $('#bitmap-preview-canvas')[0];
            if (canvas.getContext) {
                context = canvas.getContext('2d');
            }
        }
    }

    function getFontFile() {
        var url = builder.host + '/Fontfiles/BitmapFile/' + builder.filePath + '/Product/' + builder.fontName;

        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "arraybuffer";
        req.onload = function (event) {
            fontData = new Uint8Array(req.response);
            reDraw();
        };

        req.send();
    }

    function getCodeMap() {
        var url = builder.host + '/Document/CodePage/' + builder.spec + '-Full-Unicode';

        if (builder.spec == 'Unicode') {
            url = builder.host + '/Document/CodePage/' + builder.language + '-Unicode-Full';
        }

        $.ajax({
            url: url
        }).done(function (result) {
            var array = result.split('\r\n')
            for (var i = 0; i < array.length; i++) {
                var a = array[i].split('\t0X');
                if (a[1]) {
                    codeMap.set(a[1].toLowerCase(), a[0])
                }
            }

            generateFontCodeList();
            getFontFile();
        });
    }

    function onScreenResize() {
        var ratio = 2;
        var canvasWidth = container[0].offsetWidth;
        scale = canvasWidth / (builder.fontWidth * builder.oneLineWords) * ratio;
        var x = canvasWidth;
        var y = getCanvasHeight();

        canvas.setAttribute('width', x * ratio);
        canvas.setAttribute('height', y * ratio);
        canvas.style.width = x + 'px';
        canvas.style.height = y + 'px';

        if (fontData) {
            reDraw();
        }

        function getCanvasHeight() {
            var lineHeight = builder.fontHeight * scale / ratio;
            var lines = Math.ceil(input.val().length / builder.oneLineWords);
            return lines * lineHeight;
        }
    }

    function reDraw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var col = 0;
        var row = 0;

        for (var i = 0; i < fontCodeList.length; i++) {
            drawFont(fontCodeList[i], col, row);
            col++;

            if (col >= builder.oneLineWords) {
                col = 0;
                row++;
            }
        }

        function drawFont(index, col, row) {
            var rowBytes = Math.ceil(builder.fontWidth / 8);
            var startIndex = index * builder.fontHeight * rowBytes;

            for (var h = 0; h < builder.fontHeight; h++) {
                for (var w = 0; w < builder.fontWidth; w++) {
                    var index = Math.floor(w / 8) + h * rowBytes + startIndex;

                    var ret = (fontData[index] & (0x80 >> (w % 8))) > 0;
                    if (ret) {
                        var x = w + col * builder.fontWidth
                        var y = h + row * builder.fontHeight
                        drawPixel(x, y, scale);
                    }
                }
            }
        }

        function drawPixel(x, y, scale) {
            var px = x * scale;
            var py = y * scale;

            context.fillRect(px, py, scale, scale);
        }
    }

    function generateFontCodeList() {
        fontCodeList = []
        for (var i = 0; i < input.val().length; i++) {
            var code = input.val().charCodeAt(i).toString(16);
            code = paddingLeft(code, 4);
            fontCodeList.push(codeMap.get(code))
        }

        function paddingLeft(str, lenght) {
            if (str.length >= lenght)
                return str;
            else
                return paddingLeft('0' + str, lenght);
        }
    }
}

var BitmapPreviewerBuilder = function () {
    
    this.setDefaultText = function (text) {
        this.defaultText = text;
        return this;
    }

    this.setFontHeight = function (height) {
        this.fontHeight = height;
        return this;
    }

    this.setFontWidth = function (width) {
        this.fontWidth = width;
        return this;
    }

    this.setOneLineWords = function (oneLineWords) {
        this.oneLineWords = oneLineWords;
        return this;
    }

    this.setHost = function (host) {
        this.host = host;
        return this;
    }

    this.setFilePath = function (path) {
        this.filePath = path;
        return this;
    }

    this.setFontName = function (fontName) {
        this.fontName = fontName;
        return this;
    }

    this.setSpec = function (spec) {
        this.spec = spec;
        return this;
    }

    this.setLanguage = function (language) {
        this.language = language;
        return this;
    }

    this.build = function () {
        return new BitmapPreviewer(this);
    }
}
