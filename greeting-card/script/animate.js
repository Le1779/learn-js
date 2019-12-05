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

function radomText(obj, delay) {
    function animate() {
        var randomX = Math.round(Math.random() * 500);
        var randomY = Math.round(Math.random() * 500);

        obj.animate({
            left: randomX,
            top: randomY
        }, {
            duration: delay,
            onChange: canvas.renderAll.bind(canvas),
            easing: fabric.util.ease.easeOutExpo
        })
    }

    animate();
    setInterval(animate, delay);
}
