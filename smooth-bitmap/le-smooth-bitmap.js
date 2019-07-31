var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var BitmapView = function (builder) {
    let canvas = builder.canvas;
    let newCanvas = builder.newCanvas;

    let context;
    let newContext;

    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;

    let img = new Image();
    img.src = 'test.bmp';
    console.log(img);
    console.log(img.width);

    initCanvas();
    initNewCanvas();

    function initCanvas() {

        canvas.height = img.height;
        canvas.width = img.width;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);

            var t = 0;
            var data = context.getImageData(0, 0, canvas.height, canvas.width).data;
            console.log(data);

            drawData(data);
            var count = 0;
            var tmr = null;
            var length = data.length;
            //(pix = function () {
            //    var r = data[count + 0];
            //    var g = data[count + 1];
            //    var b = data[count + 2];
            //    var a = data[count + 3];
            //    var rgba = 'rgba(' + r + ' ,' + g + ' ,' + b + ' ,' + a + ')';
            //    console.log(rgba);
            //    var id = context.createImageData(1, 1); // only do this once per page
            //    var d = id.data; // only do this once per page
            //    d[0] = 255-r;
            //    d[1] = 255-g;
            //    d[2] = 255-b;
            //    d[3] = 255;
            //    let x = t / canvas.width;
            //    let y = t % canvas.height;
            //    t++;
            //    context.putImageData(id, x, y);
            //    if ((count += 4) >= length) {
            //        clearTimeout(tmr);
            //        return;
            //    }
            //    tmr = setTimeout(pix, 1); //at 30 fps
            //})();
        }
    }

    function initNewCanvas() {
        newCanvas.height = img.height;
        newCanvas.width = img.width;
        if (newCanvas.getContext) {
            newContext = newCanvas.getContext('2d');
            newContext.drawImage(img, 0, 0);
        }
    }

    function drawData(data) {
        let length = data.length;
        let t = 0;
        let w = canvas.width;
        let h = canvas.height;
        for (let i = 0; i < length; i += 4) {
            let r = data[i + 0];
            let g = data[i + 1];
            let b = data[i + 2];
            let a = data[i + 3];

            let x = t % canvas.height;
            let y = t / canvas.width;
            t++;

            let id = context.createImageData(1, 1); // only do this once per page
            let d = id.data; // only do this once per page
            let c = (r + g + b) / 3;
            if (test(i)) {
                d[0] = 255;
                d[1] = 255;
                d[2] = 255;
            } else {
                d[0] = 0;
                d[1] = 0;
                d[2] = 0;
            }
            d[3] = 255;
            context.putImageData(id, x, y);
        }

        function test(index) {
            let t = index;
            let sum = 0;
            let d = 0;
            //let x;
            //let y;

            count(index, 0, 0);
            count(index, -1, 0);
            count(index, 1, 0);
            
            //count(index, 0, -1);
            //count(index, -1, -1);
            //count(index, 1, -1);
            
            //count(index, 0, 1);
            //count(index, -1, 1);
            //count(index, 1, 1);
            
            return sum/d > 230;

            function count(index, xx, yy) {
                let x = index / 4 % h;
                let y = index / 4 / w;
                if (inBound(x + xx, y + yy)) {
                    sum += (data[index + xx*4 + yy*w + 0] + data[index + xx*4 + yy*w + 1] + data[index + xx*4 + yy*w + 2])/3;
                    d++;
                }
            }

            function inBound(x, y) {
                return x >= 0 && x <= w && y >= 0 && y <= h;
            }
        }
    }



}

var BitmapViewBuilder = function (canvas) {

    this.canvas = canvas;

    this.setNewCanvas = function (newCanvas) {
        this.newCanvas = newCanvas;
        return this;
    }

    this.build = function () {
        return new BitmapView(this);
    }
}
