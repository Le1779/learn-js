var Point = function (x, y) {
    return {
        x: x,
        y: y
    };
};

var Rect = function (x, y, width, height) {
    return {
        x: x,
        y: y,
        width: width,
        height: height
    };
};
let color = ["#979797", "#008FB5", "#F1C109", "#67AB49", "#F05C75", "#654982"];

function initOrderFlowGraph() {
    let canvas = document.getElementById('order-flow-graph');
    let ctx;
    let margin = 50;
    let viewHeight;
    let viewWidth;
    let pointRadius = 10;
    let widthFlag = 1;
    let heightFlag = 1;
    
    let minWidth = 300;
    let lineHeight = 50;
    let lineMargin = 5;
    let blockCount = 0

    initCanvas();

    drawFalseGraph();

    function initCanvas() {
        canvas.height = 300;
        canvas.width = window.innerWidth * 0.8;
        viewHeight = canvas.height;
        viewWidth = canvas.width;
        pointRadius = viewHeight / 30;
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
        }
    }

    function drawFalseGraph() {
        drawFlowBlock(0, 0);
    }

    function drawFlowBlock(distance, line) {
        let x = distance*minWidth + 10;
        let y = line*lineHeight + 10 ;
        let height = lineHeight - lineMargin*2;
        //畫出區塊外框
        let rect = Rect(x, y, minWidth, height);
        drawRoundedRect(rect, height/2, ctx);
        //畫出外框的點
        let point = Point(x + height/2, y + height/2);
        drawPoint(point);
        //畫出內文
        drawText(point);
    }

    function drawPoint(point) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.fill();
        ctx.restore();
    }

    function drawText(point) {
        ctx.save();
        ctx.fillStyle = "#FFF";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.textAlign = "start"; 
        ctx.fillText("簡亨儒 to 謝明憲", point.x + 15, point.y);
        ctx.restore();
    }
    
    function drawSubtitle(point){
        ctx.save();
        ctx.fillStyle = "#FFF";
        ctx.font = "15px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.textAlign = "start"; 
        ctx.fillText("0.4天", point.x + 15, point.y);
        ctx.restore();
    }

    function drawRoundedRect(rect, r, ctx) {
        let ptA = Point(rect.x + r, rect.y);
        let ptB = Point(rect.x + rect.width, rect.y);
        let ptC = Point(rect.x + rect.width, rect.y + rect.height);
        let ptD = Point(rect.x, rect.y + rect.height);
        let ptE = Point(rect.x, rect.y);
        
        ctx.save();
        ctx.beginPath();

        ctx.moveTo(ptA.x, ptA.y);
        ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
        ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
        ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
        ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);

        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowColor = 'rgba(61,204,153,0.5)';
        ctx.shadowBlur = 10;

        //let bgc = ctx.createLinearGradient(0, 0, 300, 40);
        //bgc = ctx.createRadialGradient(50, 70, 20, 60, 70, 60);
        //bgc.addColorStop(1, 'rgb(61,204,153)');
        //bgc.addColorStop(1, 'rgb(249,227,141)');
        //bgc.addColorStop(1, 'rgb(241,193,9,1)');
        ctx.fillStyle = 'rgb(61,204,153)';

        ctx.fill();
        ctx.restore();

    }
}
