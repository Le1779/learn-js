$(document).ready(function () {

    let tolerance = 10;
    let segments = new PathFitter(makeFakeData2()).fit(tolerance || 2.5);
    console.log(segments);

    let bezierView = new BezierViewBuilder($('#bezier')[0]).setData(makeFakeData2()).build();
    bezierView.setResult(segments);
});

let EPSILON = 1e-12;
this.isZero = function (val) {
    return val >= -EPSILON && val <= EPSILON;
}

var Point = function (x, y) {

    this.x = x;
    this.y = y;

    this._angle;

    this.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    this.add = function (point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    this.subtract = function (point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    this.negate = function () {
        return new Point(-this.x, -this.y);
    }

    this.multiply = function (point) {
        return new Point(this.x * point, this.y * point);
    }

    this.dot = function (point) {
        return this.x * point.x + this.y * point.y;
    }

    this.getDistance = function (point) {
        var x = point.x - this.x,
            y = point.y - this.y,
            d = x * x + y * y; //,
        //squared = Base.read(arguments);
        //return squared ? d : Math.sqrt(d);
        return Math.sqrt(d);
    }

    this.normalize = function (length) {
        if (length === undefined)
            length = 1;
        var current = this.getLength(),
            scale = current !== 0 ? length / current : 0,
            point = new Point(this.x * scale, this.y * scale);
        return point;
    }
    return this;
};

var Segment = function (x, y) {
    this.point = x;
    this.handleIn = y;

    //console.log(x);
    //console.log(y);
    //this.point = new Point(x, y);
    this.setHandleOut = function (point) {
        //console.log(point);
        this.handleOut = point;
        //this._handleOut.set(Point.read(arguments));
    }
}

var PathFitter = function (points) {
    this.points = points;
    console.log(this.points);

    this.fit = function (error) {
        var points = this.points,
            length = points.length,
            segments = null;
        if (length > 0) {
            segments = [new Segment(points[0])];
            if (length > 1) {
                this.fitCubic(segments, error, 0, length - 1,
                    points[1].subtract(points[0]),
                    points[length - 2].subtract(points[length - 1]));
                if (this.closed) {
                    segments.shift();
                    segments.pop();
                }
            }
        }
        return segments;
    }

    this.fitCubic = function (segments, error, first, last, tan1, tan2) {
        var points = this.points;
        if (last - first === 1) {
            var pt1 = points[first],
                pt2 = points[last],
                dist = pt1.getDistance(pt2) / 3;
            this.addCurve(segments, [pt1, pt1.add(tan1.normalize(dist)),
					pt2.add(tan2.normalize(dist)), pt2]);
            return;
        }
        var uPrime = this.chordLengthParameterize(first, last),
            maxError = Math.max(error, error * error),
            split,
            parametersInOrder = true;
        for (var i = 0; i <= 4; i++) {
            var curve = this.generateBezier(first, last, uPrime, tan1, tan2);
            var max = this.findMaxError(first, last, curve, uPrime);
            if (max.error < error && parametersInOrder) {
                this.addCurve(segments, curve);
                return;
            }
            split = max.index;
            if (max.error >= maxError)
                break;
            parametersInOrder = this.reparameterize(first, last, uPrime, curve);
            maxError = max.error;
        }
        var tanCenter = points[split - 1].subtract(points[split + 1]);
        this.fitCubic(segments, error, first, split, tan1, tanCenter);
        this.fitCubic(segments, error, split, last, tanCenter.negate(), tan2);
    }

    this.evaluate = function (degree, curve, t) {
        var tmp = curve.slice();
        for (var i = 1; i <= degree; i++) {
            for (var j = 0; j <= degree - i; j++) {
                tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
            }
        }
        return tmp[0];
    }

    this.chordLengthParameterize = function (first, last) {
        var u = [0];
        for (var i = first + 1; i <= last; i++) {
            u[i - first] = u[i - first - 1] +
                this.points[i].getDistance(this.points[i - 1]);
        }
        for (var i = 1, m = last - first; i <= m; i++) {
            u[i] /= u[m];
        }
        return u;
    }

    this.findMaxError = function (first, last, curve, u) {
        var index = Math.floor((last - first + 1) / 2),
            maxDist = 0;
        for (var i = first + 1; i < last; i++) {
            var P = this.evaluate(3, curve, u[i - first]);
            var v = P.subtract(this.points[i]);
            var dist = v.x * v.x + v.y * v.y;
            if (dist >= maxDist) {
                maxDist = dist;
                index = i;
            }
        }
        return {
            error: maxDist,
            index: index
        };
    }

    this.addCurve = function (segments, curve) {
        var prev = segments[segments.length - 1];
        prev.setHandleOut(curve[1].subtract(curve[0]));
        //console.log(curve[1].subtract(curve[0]));
        segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
    }

    this.generateBezier = function (first, last, uPrime, tan1, tan2) {
        var epsilon = 1e-12,
            abs = Math.abs,
            points = this.points,
            pt1 = points[first],
            pt2 = points[last],
            C = [[0, 0], [0, 0]],
            X = [0, 0];

        for (var i = 0, l = last - first + 1; i < l; i++) {
            var u = uPrime[i],
                t = 1 - u,
                b = 3 * u * t,
                b0 = t * t * t,
                b1 = b * t,
                b2 = b * u,
                b3 = u * u * u,
                a1 = tan1.normalize(b1),
                a2 = tan2.normalize(b2),
                tmp = points[first + i]
                .subtract(pt1.multiply(b0 + b1))
                .subtract(pt2.multiply(b2 + b3));
            C[0][0] += a1.dot(a1);
            C[0][1] += a1.dot(a2);
            C[1][0] = C[0][1];
            C[1][1] += a2.dot(a2);
            X[0] += a1.dot(tmp);
            X[1] += a2.dot(tmp);
        }

        var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1],
            alpha1,
            alpha2;
        if (abs(detC0C1) > epsilon) {
            var detC0X = C[0][0] * X[1] - C[1][0] * X[0],
                detXC1 = X[0] * C[1][1] - X[1] * C[0][1];
            alpha1 = detXC1 / detC0C1;
            alpha2 = detC0X / detC0C1;
        } else {
            var c0 = C[0][0] + C[0][1],
                c1 = C[1][0] + C[1][1];
            alpha1 = alpha2 = abs(c0) > epsilon ? X[0] / c0 :
                abs(c1) > epsilon ? X[1] / c1 :
                0;
        }

        var segLength = pt2.getDistance(pt1),
            eps = epsilon * segLength,
            handle1,
            handle2;
        if (alpha1 < eps || alpha2 < eps) {
            alpha1 = alpha2 = segLength / 3;
        } else {
            var line = pt2.subtract(pt1);
            handle1 = tan1.normalize(alpha1);
            handle2 = tan2.normalize(alpha2);
            if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
                alpha1 = alpha2 = segLength / 3;
                handle1 = handle2 = null;
            }
        }

        return [pt1,
				pt1.add(handle1 || tan1.normalize(alpha1)),
				pt2.add(handle2 || tan2.normalize(alpha2)),
				pt2];
    }

    this.reparameterize = function (first, last, u, curve) {
        for (var i = first; i <= last; i++) {
            u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
        }
        for (var i = 1, l = u.length; i < l; i++) {
            if (u[i] <= u[i - 1])
                return false;
        }
        return true;
    }

    this.findRoot = function (curve, point, u) {
        var curve1 = [],
            curve2 = [];
        for (var i = 0; i <= 2; i++) {
            curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
        }
        for (var i = 0; i <= 1; i++) {
            curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
        }
        var pt = this.evaluate(3, curve, u),
            pt1 = this.evaluate(2, curve1, u),
            pt2 = this.evaluate(1, curve2, u),
            diff = pt.subtract(point),
            df = pt1.dot(pt1) + diff.dot(pt2);
        return isZero(df) ? u : u - diff.dot(pt1) / df;
    }

    this.evaluate = function (degree, curve, t) {
        var tmp = curve.slice();
        for (var i = 1; i <= degree; i++) {
            for (var j = 0; j <= degree - i; j++) {
                tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
            }
        }
        return tmp[0];
    }

}

var BezierView = function (builder) {
    let canvas = builder.canvas;
    let data = builder.data;
    console.log(data);

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
            draw();
        }
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.beginPath();
        context.fillStyle = "#FFFFFF";
        //context.lineWidth = viewWidth * 0.06;
        //context.arc(centerX, 0, viewWidth * 0.047, 0, 2 * Math.PI);
        context.moveTo(data[0].x, data[0].y);
        //context.rect(data[0].x - 2.5, data[0].y - 2.5, 5, 5);
        for (let i = 1; i < data.length; i++) {
            context.lineTo(data[i].x, data[i].y);
            //context.rect(data[i].x - 2.5, data[i].y - 2.5, 5, 5);
        }
        context.stroke();
        context.closePath();
        context.restore();
    }

    this.setResult = function (point) {
        for (let i = 0; i < point.length; i++) {
            point[i].point.x += 100;
        }
        context.save();
        context.beginPath();
        context.fillStyle = "#FF0000";
        context.moveTo(point[0].point.x, point[0].point.y);
        for (let i = 1; i < point.length; i++) {
            let c1 = new Point(point[i - 1].point.x + point[i - 1].handleOut.x, point[i - 1].point.y + point[i - 1].handleOut.y);
            let c2 = new Point(point[i].point.x + point[i].handleIn.x, point[i].point.y + point[i].handleIn.y);
            context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, point[i].point.x, point[i].point.y);
        }
        context.stroke();
        context.closePath();
        context.restore();
    }


}

var BezierViewBuilder = function (canvas) {

    this.canvas = canvas;

    this.setData = function (data) {
        this.data = data;
        return this;
    }

    this.build = function () {
        return new BezierView(this);
    }
}

function makeFakeData() {
    let data = [];
    data.push(new Point(390, 82));
    data.push(new Point(391, 82));
    data.push(new Point(391, 83));
    data.push(new Point(393, 89));
    data.push(new Point(393, 95));
    data.push(new Point(393, 102));
    data.push(new Point(393, 109));
    data.push(new Point(392, 117));
    data.push(new Point(391, 126));
    data.push(new Point(390, 137));

    data.push(new Point(387, 146));
    data.push(new Point(384, 154));
    data.push(new Point(380, 163));
    data.push(new Point(375, 171));
    data.push(new Point(371, 180));
    data.push(new Point(365, 188));
    data.push(new Point(360, 197));
    data.push(new Point(354, 205));
    data.push(new Point(348, 213));
    data.push(new Point(343, 221));

    data.push(new Point(337, 227));
    data.push(new Point(330, 232));
    data.push(new Point(323, 238));
    data.push(new Point(317, 242));
    data.push(new Point(311, 247));
    data.push(new Point(306, 250));
    data.push(new Point(300, 251));
    data.push(new Point(294, 254));
    data.push(new Point(289, 255));
    data.push(new Point(284, 257));

    data.push(new Point(279, 258));
    data.push(new Point(273, 258));
    data.push(new Point(269, 258));
    data.push(new Point(263, 258));
    data.push(new Point(259, 258));
    data.push(new Point(253, 258));
    data.push(new Point(249, 258));
    return data;
}

function makeFakeData2() {
    let data = [];
    data.push(new Point(287, 137));
    data.push(new Point(286, 137));
    data.push(new Point(282, 140));
    data.push(new Point(278, 142));
    data.push(new Point(273, 144));
    data.push(new Point(268, 149));
    data.push(new Point(263, 152));
    data.push(new Point(259, 153));
    data.push(new Point(255, 156));
    data.push(new Point(252, 157));

    data.push(new Point(249, 159));
    data.push(new Point(248, 160));
    data.push(new Point(246, 162));
    data.push(new Point(245, 163));
    data.push(new Point(244, 164));
    data.push(new Point(242, 167));
    data.push(new Point(241, 170));
    data.push(new Point(239, 173));
    data.push(new Point(238, 177));
    data.push(new Point(236, 180));

    data.push(new Point(236, 184));
    data.push(new Point(235, 187));
    data.push(new Point(235, 191));
    data.push(new Point(235, 194));
    data.push(new Point(235, 196));
    data.push(new Point(235, 200));
    data.push(new Point(237, 201));
    data.push(new Point(238, 204));
    data.push(new Point(240, 207));
    data.push(new Point(243, 208));

    data.push(new Point(245, 210));
    data.push(new Point(250, 214));
    data.push(new Point(254, 215));
    data.push(new Point(258, 220));
    data.push(new Point(262, 221));
    data.push(new Point(267, 224));
    data.push(new Point(271, 225));
    data.push(new Point(275, 227));
    data.push(new Point(279, 228));
    data.push(new Point(284, 228));

    data.push(new Point(288, 228));
    data.push(new Point(291, 228));
    data.push(new Point(294, 226));
    data.push(new Point(296, 225));
    data.push(new Point(298, 224));
    data.push(new Point(299, 222));
    data.push(new Point(301, 221));
    data.push(new Point(301, 219));
    data.push(new Point(302, 218));
    data.push(new Point(302, 216));

    data.push(new Point(302, 214));
    data.push(new Point(302, 212));
    data.push(new Point(300, 209));
    data.push(new Point(299, 208));
    data.push(new Point(297, 207));
    data.push(new Point(296, 205));
    data.push(new Point(295, 204));
    data.push(new Point(293, 202));
    data.push(new Point(290, 201));
    data.push(new Point(286, 198));
    data.push(new Point(282, 197));
    data.push(new Point(279, 195));
    data.push(new Point(276, 195));
    data.push(new Point(272, 194));
    data.push(new Point(269, 194));
    data.push(new Point(265, 194));
    data.push(new Point(261, 194));
    data.push(new Point(258, 196));
    data.push(new Point(253, 197));
    data.push(new Point(249, 198));
    data.push(new Point(245, 200));
    data.push(new Point(242, 201));
    data.push(new Point(238, 203));
    data.push(new Point(236, 204));
    data.push(new Point(234, 207));
    data.push(new Point(231, 210));
    data.push(new Point(229, 211));
    data.push(new Point(228, 215));
    data.push(new Point(226, 218));
    data.push(new Point(225, 221));

    data.push(new Point(224, 224));
    data.push(new Point(222, 228));
    data.push(new Point(222, 232));
    data.push(new Point(221, 235));
    data.push(new Point(221, 237));
    data.push(new Point(221, 238));
    data.push(new Point(223, 240));
    data.push(new Point(224, 241));
    data.push(new Point(225, 242));
    data.push(new Point(228, 245));
    data.push(new Point(231, 248));
    data.push(new Point(233, 250));
    data.push(new Point(235, 251));
    data.push(new Point(238, 252));
    data.push(new Point(240, 254));
    data.push(new Point(244, 255));
    data.push(new Point(248, 257));
    data.push(new Point(251, 258));
    data.push(new Point(255, 259));
    data.push(new Point(260, 259));

    data.push(new Point(265, 261));
    data.push(new Point(271, 261));
    data.push(new Point(277, 261));
    data.push(new Point(282, 261));
    data.push(new Point(288, 261));
    data.push(new Point(294, 261));
    data.push(new Point(298, 261));
    data.push(new Point(304, 260));
    data.push(new Point(308, 259));
    data.push(new Point(312, 258));
    data.push(new Point(316, 256));
    data.push(new Point(319, 256));
    data.push(new Point(321, 255));
    data.push(new Point(322, 255));
    data.push(new Point(323, 255));
    data.push(new Point(325, 255));
    data.push(new Point(326, 255));
    return data;
}

/*
0:
_handleIn: SegmentPoint {_x: 0, _y: 0, _owner: Segment}
_handleOut: SegmentPoint {_x: -5.318790009770623, _y: 0, _owner: Segment}
_point: SegmentPoint {_x: 287, _y: 137, _owner: Segment}
1:
_handleIn: SegmentPoint {_x: 3.7914545749254103, _y: -3.033163659940328, _owner: Segment}
_handleOut: SegmentPoint {_x: -14.75554617719726, _y: 11.804436941757814, _owner: Segment}
_point: SegmentPoint {_x: 268, _y: 149, _owner: Segment}
2:
_handleIn: SegmentPoint {_x: -10.844288235660713, _y: -27.11072058915181, _owner: Segment}
_handleOut: SegmentPoint {_x: 8.94953429826387, _y: 22.373835745659648, _owner: Segment}
_point: SegmentPoint {_x: 235, _y: 200, _owner: Segment}
3:
_handleIn: SegmentPoint {_x: 11.757150912312227, _y: 29.392877280780596, _owner: Segment}
_handleOut: SegmentPoint {_x: -12.999812803455768, _y: -32.49953200863948, _owner: Segment}
_point: SegmentPoint {_x: 302, _y: 212, _owner: Segment}
4:
_handleIn: SegmentPoint {_x: 12.774045868563974, _y: -29.8061070266493, _owner: Segment}
_handleOut: SegmentPoint {_x: -0.97391292979475, _y: 2.2724635028544355, _owner: Segment}
_point: SegmentPoint {_x: 224, _y: 224, _owner: Segment}
5:
_handleIn: SegmentPoint {_x: -1.7801991949632736, _y: -2.670298792444896, _owner: Segment}
_handleOut: SegmentPoint {_x: 24.868243718699432, _y: 37.30236557804915, _owner: Segment}
_point: SegmentPoint {_x: 221, _y: 238, _owner: Segment}
6:
_handleIn: SegmentPoint {_x: -31.467881287403884, _y: 0, _owner: Segment}
_handleOut: SegmentPoint {_x: 0, _y: 0, _owner: Segment}
_point: SegmentPoint {_x: 326, _y: 255, _owner: Segment}
*/