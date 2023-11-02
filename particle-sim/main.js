// Main update/simulation code

startButton.onclick = function() {start();}
stopButton.onclick = function() {stop();}
resetButton.onclick = function() {reset();}

canvas.onmousedown = function(event) {
    mouseDown = true;
    mouseX = event.clientX * 2 - 640;
    mouseY = event.clientY * 2;
}

canvas.onmousemove = function(event) {
    mouseX = event.clientX * 2 - 640;
    mouseY = event.clientY * 2;
}

canvas.onmouseup = function(event) {
    mouseDown = false;
}

function start() {
    console.log("Start");
    isPlaying = true;
}

function stop() {
    console.log("Stop");
    isPlaying = false;
}

function reset() {
    console.log("Reset");
    particles = [];
    // stop();
    setup();
}

function create(amount, type) {
    for (let i = 0; i < amount; i++) {
        let p = newParticle(randomX(), randomY(), type);
        particles.push(p);
    }
    console.log("Created " + amount + " " + type + " particles");
}

function newParticle(x, y, type) {
    // console.log("Created " + type + " particle at " + x + ", " + y);
    return {
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        color: type
    }
}

function drawParticle(p, selection, size) {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    if (selection) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.arc(p.x + size / 2, p.y + size / 2, size * 2.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
    }
    ctx.arc(p.x + size / 2, p.y + size / 2, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawMouseInteraction() {
    if (!mouseDown) return;
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 8;
    ctx.arc(mouseX, mouseY, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

function affectParticle(p, p2, range, force, speed) {
    let dx = p2.x - p.x;
    let dy = p2.y - p.y;
    let dst = Math.sqrt(dx * dx + dy * dy);
    // if (dst < particleSize * 2) dst = particleSize * 2;

    let factor = Math.pow(Math.max(0, (range * range) - (dst * dst)), 3) / Math.pow(range, 5);
    if (factor == 0) return;

    let directionX = dx / dst;
    let directionY = dy / dst;

    p.vx += directionX * factor / (-range * 50) * force * speed;
    p.vy += directionY * factor / (-range * 50) * force * speed;
}

function updateParticle(p, speed) {
    for (let i = 0; i < particles.length; i++) {
        let p2 = particles[i];
        if (p !== p2) {
            // Universal Repulsion
            affectParticle(p, p2, -100, 3, speed, false);

            // Same Color Attraction/Repulsion
            if (p.color == p2.color) {
                affectParticle(p, p2, 200, 3, speed, false)
            } else {
                affectParticle(p, p2, -300, 3, speed, false);
            }

            // Mouse Repulsion
            if (mouseDown) affectParticle(p, {x: mouseX, y: mouseY}, -200, 1.5, speed, true);
        }
    }
}

function setup() {
    processListItems();
    for (let i = 0; i < initialAmounts.length; i++) {
        if (initialColors[i] == "") return;
        create(initialAmounts[i], initialColors[i]);
    }
}

function update() {
    if (resetCalled) { reset(); resetCalled = false }

    const speed = speedInput.value;
    const selection = selectionInput.value;
    const size = sizeInput.value;
    particleSize = size;

    if (isPlaying) {
        for (let i = 0; i < particles.length; i++) {
            updateParticle(particles[i], speed);
        }

        for (let i = 0; i < particles.length; i++) {
            p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x > dspWidth - particleSize * 2) { p.x = dspWidth - particleSize * 2; p.vx = -p.vx; }
            if (p.x < 0) { p.x = 0; p.vx = -p.vx; }
            if (p.y > dspHeight - particleSize * 2) { p.y = dspHeight - particleSize * 2; p.vy = -p.vy; }
            if (p.y < 0) { p.y = 0; p.vy = -p.vy; }

            p.vx *= 0.9;
            p.vy *= 0.9;
        }
    }

    ctx.fillStyle = "#001"
    ctx.fillRect(0, 0, dspWidth, dspHeight);
    for (let i = 0; i < particles.length; i++) {
        drawParticle(particles[i], selection == i, size);
    }

    // if (mouseDown) {
    //     for (let j = 0; j < 200; j += 10) {
    //         let dst = j;
    //         if (dst < particleSize * 2) dst = particleSize * 2;
    //         if (dst > 300) return;

    //         let factor = 1 / (dst * dst + 5);

    //         ctx.beginPath();
    //         ctx.strokeStyle = "#fff";
    //         ctx.lineWidth = 10;
    //         ctx.arc(mouseX, mouseY, j, 0, Math.PI * 2);
    //         ctx.stroke();
    //         ctx.closePath();

    //         // p.vx += directionX * factor * speed;
    //         // p.vy += directionY * factor * speed;
    //     }
    // }
    drawMouseInteraction();

    requestAnimationFrame(update);
}

setup();
update();