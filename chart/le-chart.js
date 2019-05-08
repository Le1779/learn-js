var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var CircleProgress = function (builder) {
    let canvas = builder.canvas;
    let max = builder.max;
    let progress = builder.progress;

    if (progress > max) {
        return;
    }

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;

    initCanvas();

    function initCanvas() {
        //console.log('width: ' + canvas.width + ' ,height: ' + canvas.height);
        //console.log('width: ' + canvas.offsetWidth + ' ,height: ' + canvas.offsetHeight);

        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
            draw();
        }
    }

    function draw() {
        drawBackgroundCircle();
        drawHint();
        drawProgressCircle();
        drawPercent();
        drawProgressText();

        function drawBackgroundCircle() {
            context.save();
            context.beginPath();
            context.strokeStyle = "#E6E6E6";
            context.lineWidth = viewWidth / 20;
            context.arc(centerX, centerY + viewHeight / 4 - 15, viewWidth * 0.3, 0.1 * Math.PI, 0.9 * Math.PI, true);
            context.stroke();
            context.closePath();
            context.restore();
        }

        function drawHint() {
            context.save();
            context.fillStyle = "#AAA";
            context.font = "15px Arial";
            context.textAlign = "start";
            context.textBaseline = "middle";
            context.fillText("0%", centerX - viewWidth * 0.3, viewHeight - 15);
            context.textAlign = "end";
            context.fillText("100%", centerX + viewWidth * 0.3, viewHeight - 15);
            context.restore();
        }

        function drawProgressCircle() {
            context.save();
            let percentagePoint = 1.2 / max;
            let percent = -1.1 + progress * percentagePoint;
            context.beginPath();
            context.strokeStyle = "#00C58D";
            context.lineWidth = viewWidth / 20;
            context.arc(centerX, centerY + viewHeight / 4 - 15, viewWidth * 0.3, percent * Math.PI, 0.9 * Math.PI, true);
            context.stroke();
            context.closePath();
            context.restore();
        }

        function drawPercent() {
            context.save();
            let percent = Math.round(progress / max * 1000) / 10;
            context.fillStyle = "#3D4060";
            context.font = "bold 60px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(percent + "%", centerX, viewHeight - 60);
            context.restore();
        }

        function drawProgressText() {
            context.save();
            let percent = Math.round(progress / max * 1000) / 10;
            context.font = "30px Arial";
            context.textBaseline = "middle";

            context.fillStyle = "#00C58D";
            context.textAlign = "end";
            context.fillText(progress, centerX - 10, centerY);

            context.fillStyle = "#3D4060";
            context.textAlign = "center";
            context.fillText("/", centerX, centerY);

            context.fillStyle = "#AAA";
            context.textAlign = "start";
            context.fillText(max, centerX + 10, centerY);
            context.restore();
        }
    }
}

var CircleProgressBuilder = function (canvas) {

    this.canvas = canvas;

    this.setMax = function (max) {
        this.max = max;
        return this;
    }

    this.setProgress = function (progress) {
        this.progress = progress;
        return this;
    }

    this.build = function () {
        return new CircleProgress(this);
    }
}

var LineRate = function (builder) {
    let canvas = builder.canvas;
    let labels = builder.labels;
    let rates = builder.rates;

    if (labels == null || rates == null || labels.length != rates.length) {
        console.log('data error');
        return;
    }

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;
    let margin = 10;
    let lineMargin = 2;
    let lineHeight = 10;
    let rateColors = ['rgb(57,118,244)', 'rgb(120,195,238)', 'rgb(239,151,54)', 'rgb(199,198,200)', 'rgb(116,216,109)', 'rgb(230,80,62)'];

    let Rect = function (x, y, width, height) {
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    };

    initCanvas();

    function initCanvas() {
        //console.log('width: ' + canvas.width + ' ,height: ' + canvas.height);
        //console.log('width: ' + canvas.offsetWidth + ' ,height: ' + canvas.offsetHeight);
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
            draw();
        }
    }

    function draw() {

        drawRateLine();

        function drawRateLine() {
            let lineWidth = viewWidth - margin * 2;
            let sum = 0;
            for (let i = 0; i < rates.length; i++) {
                sum += rates[i];
                let x = viewWidth * (i + 1) / (rates.length + 1);
                let y = viewHeight - margin * 2;
                drawHint(x, y, labels[i], rates[i], rateColors[i]);
            }

            let positionX = 0;
            for (let i = 0; i < rates.length; i++) {
                if (i == 0) {
                    let rect = new Rect(margin, margin, lineWidth * (rates[i] / sum) - lineMargin, lineHeight);
                    positionX += lineWidth * (rates[i] / sum) + margin - lineMargin;
                    drawRoundedRect(rect, lineHeight / 2, rateColors[i], "start");
                } else if (i == rates.length - 1) {
                    let rect = new Rect(lineMargin + positionX, margin, lineWidth * (rates[i] / sum) - margin, lineHeight);
                    drawRoundedRect(rect, lineHeight / 2, rateColors[i], "end");
                } else {
                    let rect = new Rect(lineMargin + positionX, margin, lineWidth * (rates[i] / sum), lineHeight);
                    positionX += lineMargin + lineWidth * (rates[i] / sum);
                    drawRoundedRect(rect, lineHeight / 2, rateColors[i], "center");
                }
            }
        }

        function drawRoundedRect(rect, r, color, direction) {
            let ptA = Point(rect.x + r, rect.y);
            let ptB = Point(rect.x + rect.width, rect.y);
            let ptC = Point(rect.x + rect.width, rect.y + rect.height);
            let ptD = Point(rect.x, rect.y + rect.height);
            let ptE = Point(rect.x, rect.y);

            context.save();
            context.beginPath();

            context.moveTo(ptA.x, ptA.y);
            switch (direction) {
                case "start":
                    context.lineTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                    context.lineTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                    context.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                    context.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
                    break;
                case "end":
                    context.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                    context.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                    context.lineTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                    context.lineTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
                    break;
                case "center":
                    context.lineTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                    context.lineTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                    context.lineTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                    context.lineTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
                    break;
                case "none":
                    context.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
                    context.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
                    context.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
                    context.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
                    break;
            }

            context.shadowOffsetX = 0;
            context.shadowOffsetY = 2;
            context.shadowColor = color;
            context.shadowBlur = 10;
            context.fillStyle = color;

            context.fill();
            context.restore();

        }

        function drawHint(x, y, text, remark, color) {
            context.save();
            context.fillStyle = color;
            context.font = "12px Arial";
            context.textAlign = "end";
            context.textBaseline = "middle";
            context.fillText(text, x + margin, y);

            context.textAlign = "start";
            context.fillStyle = "#3D4060";
            context.fillText(remark, x + margin + 5, y);
            context.restore();
        }
    }

}

var LineRateBuilder = function (canvas) {

    this.canvas = canvas;

    this.setLabels = function (labels) {
        this.labels = labels;
        return this;
    }

    this.setRates = function (rates) {
        this.rates = rates;
        return this;
    }

    this.build = function () {
        return new LineRate(this);
    }
}

var CircleRate = function (builder) {
    let canvas = builder.canvas;
    let labels = builder.labels;
    let rates = builder.rates;

    if (labels == null || rates == null || labels.length != rates.length) {
        console.log('data error');
        return;
    }

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;
    let margin = 10;
    let circleMargin = 0.008;
    let lineHeight = 50;
    let rateColors = ['rgb(57,118,244)', 'rgb(239,151,54)', 'rgb(120,195,238)', 'rgb(199,198,200)', 'rgb(116,216,109)', 'rgb(230,80,62)'];

    initCanvas();

    function initCanvas() {
        //console.log('width: ' + canvas.width + ' ,height: ' + canvas.height);
        //console.log('width: ' + canvas.offsetWidth + ' ,height: ' + canvas.offsetHeight);
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;

        //console.log('width: ' + canvas.width + ' ,height: ' + canvas.height);
        viewWidth = canvas.width;
        viewHeight = canvas.height;

        centerX = viewWidth / 2;
        centerY = viewHeight / 2;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
            draw();
        }
    }

    function draw() {
        //start draw
        let radius = viewWidth / 5;
        centerX /= 2
        let sum = 0;
        for (let i = 0; i < rates.length; i++) {
            sum += rates[i];
        }

        let positionStart = 0;
        for (let i = 0; i < rates.length; i++) {
            let start = positionStart - circleMargin;
            let end = 2 - 2 * (rates[i] / sum) + positionStart;
            drawRate(rateColors[i], start, end);
            positionStart = end;
            drawHint(rateColors[i], labels[i], rates[i], rates[i] / sum, i);
        }
        drawCenterText(sum);

        //end draw

        function drawRate(color, start, end) {
            context.save();
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = viewWidth / 20;
            context.arc(centerX, centerY, radius, start * Math.PI, end * Math.PI, true);
            context.stroke();
            context.closePath();
            context.restore();
        }

        function drawCenterText(total) {
            context.save();
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "#AAAAAA";
            context.font = "15px Arial";
            context.fillText("工單總數", centerX, centerY - 20);

            context.fillStyle = "#3D4060";
            context.font = "50px Arial";
            context.fillText(total, centerX, centerY + 20);
            context.restore();
        }

        function drawHint(color, text, amount, rate, line) {
            context.save();
            context.fillStyle = "#3D4060";
            context.font = "16px Microsoft YaHei ,Arial";
            context.textAlign = "start";
            context.textBaseline = "middle";
            context.fillText(text, centerX * 2.5, lineHeight * line + 10);
            context.restore();
            drawPoint(color, centerX * 2.5 - 10, lineHeight * line + 10);
            let splitLineX = centerX * 2.5 + context.measureText(text).width * 2;
            drawSplitLine(splitLineX, lineHeight * line);
            drawPercentage(Math.round(rate * 1000) / 10, amount, splitLineX + 10, lineHeight * line + 10);

            function drawPoint(color, x, y) {
                context.save();
                context.beginPath();
                context.arc(x, y, 5, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.restore();
            }

            function drawSplitLine(x, y) {
                context.save();
                context.beginPath();
                context.strokeStyle = "#AAAAAA";
                context.moveTo(x, y);
                context.lineTo(x, y + 16);
                context.stroke();
                context.restore();
            }

            function drawPercentage(rate, amount, x, y) {
                context.save();
                context.fillStyle = "#AAAAAA";
                context.font = "16px Microsoft YaHei ,Arial";
                context.textAlign = "start";
                context.textBaseline = "middle";
                context.fillText(rate + '% (' + amount + ')', x, y);
                context.restore();
            }
        }
    }
}

var CircleRateBuilder = function (canvas) {

    this.canvas = canvas;

    this.setLabels = function (labels) {
        this.labels = labels;
        return this;
    }

    this.setRates = function (rates) {
        this.rates = rates;
        return this;
    }

    this.build = function () {
        return new CircleRate(this);
    }
}

function LineChart(canvas_id) {
    let canvas = document.getElementById(canvas_id);
    let context;
    let data;

    let viewHeight;
    let viewWidth;

    getFalseData();
    initCanvas();

    function initCanvas() {
        canvas.height = 300;
        canvas.width = 600;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        if (canvas.getContext) {
            context = canvas.getContext('2d');
        }

        initAxes();
    }

    function initAxes() {
        for (let i = 0; i < data.length; i++) {
            drawText(new Point(viewWidth * ((i + 1) / data.length) - viewWidth / data.length / 2, viewHeight - 15), data[i].y);
        }
    }

    function drawText(point, text) {
        context.save();
        context.fillStyle = "#000";
        context.font = "15px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, point.x, point.y);
        context.restore();
    }

    function getFalseData() {
        data = [{
            y: '2018/01',
            x: 2
        }, {
            y: '2018/02',
            x: 5
        }, {
            y: '2018/05',
            x: 1
        }];
    }
}
