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

    setTimeout(function () {
        animate();
        setInterval(animate, duration);
    }, delay);
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

    setTimeout(function () {
        animate();
        setInterval(animate, duration);
    }, delay);
}

function rotateText(obj, duration, delay){
    let flag = true;

    function animate() {
        obj.set('flipY', flag);
        canvas.renderAll();
        flag = !flag;
    }

    setTimeout(function () {
        animate();
        setInterval(animate, duration);
    }, delay);
}

function moveText(obj, duration, delay){
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

    setTimeout(function () {
        animate();
        setInterval(animate, duration);
    }, delay);
}

