var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var Calendar = function (builder) {
    let canvas = builder.canvas;

    let context;
    let viewHeight;
    let viewWidth;
    let centerX;
    let centerY;
    let margin = 10;

    let today;
    let current;

    this.previous = function () {
        console.log("previous");
        current.subtract(1, 'months');
        draw();
    }

    this.next = function () {
        console.log("next");
        current.add(1, 'months');
        draw();
    }

    initCanvas();

    function initCanvas() {
        today = moment();
        current = moment();
        console.log(current);

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
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawWeekText();
        drawDate();
    }

    function drawGrid() {
        let firstDay = moment(current).startOf('month')
        let endDay = moment(current).endOf('month')
        
        let monthsWeek = endDay.week() - firstDay.week();
        if(firstDay.day() == 0){
            monthsWeek++;
        }
        
        let columnGap = (viewWidth - margin * 2) / 7;
        let rowGap = (viewHeight - margin * 2) / (monthsWeek+1);
        context.save();
        context.beginPath();
        context.fillStyle = "#000000";
        for (let i = 0; i <= 7; i++) {
            context.moveTo(columnGap * i + margin, margin);
            context.lineTo(columnGap * i + margin, viewHeight - margin);
        }

        for (let i = 0; i <= (monthsWeek+1); i++) {
            context.moveTo(margin, rowGap * i + margin);
            context.lineTo(viewWidth - margin, rowGap * i + margin);
        }

        context.stroke();
        context.closePath();
        context.restore();
    }

    function drawWeekText() {
        let columnGap = (viewWidth - margin * 2) / 7;
        context.save();
        context.font = viewWidth / 100 + "px Microsoft YaHei";
        context.textAlign = "center";
        context.fillText("周一", columnGap - columnGap / 2, margin * 3);
        context.fillText("周二", columnGap * 2 - columnGap / 2, margin * 3);
        context.fillText("周三", columnGap * 3 - columnGap / 2, margin * 3);
        context.fillText("周四", columnGap * 4 - columnGap / 2, margin * 3);
        context.fillText("周五", columnGap * 5 - columnGap / 2, margin * 3);
        context.fillText("周六", columnGap * 6 - columnGap / 2, margin * 3);
        context.fillText("周日", columnGap * 7 - columnGap / 2, margin * 3);
        context.restore();
    }

    function drawDate() {
        let firstDay = moment(current).startOf('month')
        let endDay = moment(current).endOf('month')        
        let monthsWeek = endDay.week() - firstDay.week();
        if(firstDay.day() == 0){
            monthsWeek++;
        }
        
        let startDayIndex = firstDay.day() == 0 ? 7 : firstDay.day();
        firstDay.add(1 - startDayIndex, 'days');
        
        let columnGap = (viewWidth - margin * 2) / 7;
        let rowGap = (viewHeight - margin * 2) / (monthsWeek+1);
        context.save();
        context.font = viewWidth / 100 + "px Microsoft YaHei";
        context.textAlign = "center";
        for (let i = 0; i < (monthsWeek+1); i++) {
            for (let j = 1; j <= 7; j++) {

                let showText = firstDay.format('D');
                if (showText == '1') {
                    showText = firstDay.format('M月D號')
                }
                if (i == 0) {
                    context.fillText(showText, columnGap * j - columnGap / 2, margin * 5 + rowGap * i);
                } else {
                    context.fillText(showText, columnGap * j - columnGap / 2, margin * 3 + rowGap * i);
                }
                firstDay.add(1, 'days')
            }
        }
        context.restore();
    }
}

var CalendarBuilder = function (canvas) {

    this.canvas = canvas;

    this.build = function () {
        return new Calendar(this);
    }
}
