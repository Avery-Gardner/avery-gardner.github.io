let points = [];
let sticks = [];

let isPlaying = false;
let mousePos = new Vector(0, 0);
let prevMousePos = new Vector(0, 0);
let mouseClick = false;
let mouseDown = false;
let rightClick = false;
let selectedPoint = -1;

const pointSize = 20;
const rodSize = 13;
const gravityScale = 1;

startButton.onclick = function() { start(); }
stopButton.onclick = function() { stop(); }
saveButton.onclick = function() { save(); }
loadButton.onclick = function() { load(); }
clearButton.onclick = function() { reset(); }
preset.onchange = function() { reset(); }

canvas.onmousedown = function(event) {
    rightClick = event.button == 2;
    mouseDown = true;
    mouseClick = true;
    mousePos.x = event.clientX * 2 - 640;
    mousePos.y = event.clientY * 2;
}

canvas.onmousemove = function(event) {
    mousePos.x = event.clientX * 2 - 640;
    mousePos.y = event.clientY * 2;
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

function save() {
    console.log("Saving...");

    localStorage.setItem("saved-points", JSON.stringify(points));
    console.log("Saved points array as");
    console.log(points);
    
    localStorage.setItem("saved-sticks", JSON.stringify(sticks));
    console.log("Saved sticks array as");
    console.log(sticks);

    console.log("Saved");
}

function load() {
    stop();
    console.log("Loading...");

    points = JSON.parse(localStorage.getItem("saved-points"));
    // Converts the raw position objects to vectors to fix weird stuff
    points.forEach(p => {
        p.pos = new Vector(p.pos.x, p.pos.y);
        p.vel = new Vector(p.vel.x, p.vel.y);
    });
    console.log("Loaded points array as");
    console.log(points);

    sticks = JSON.parse(localStorage.getItem("saved-sticks"));
    console.log("Loaded sticks array as");
    console.log(sticks);

    console.log("Loaded");
}

function reset() {
    console.log("Clear");
    points = [];
    sticks = [];
    stop();
    setup();
}

function point(x, y, locked) {
    const point = {
        pos: new Vector(x, y),
        vel: new Vector(0, 0),
        // prevPos: new Vector(x, y),
        locked: locked
    }
    points.push(point);
    return point;
}

function stick(pA, pB) {
    const stick = {
        p1: pA,
        p2: pB,
        length: Vector.dst(points[pA].pos, points[pB].pos)
    }
    sticks.push(stick);
    return stick;
}

function drawPoint(p) {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    if (p.locked) ctx.fillStyle = "#f88";
    ctx.arc(p.pos.x, p.pos.y, pointSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function drawStick(s) {
    ctx.beginPath();
    ctx.strokeStyle = "#888";
    ctx.lineWidth = rodSize;
    ctx.moveTo(points[s.p1].pos.x, points[s.p1].pos.y);
    ctx.lineTo(points[s.p2].pos.x, points[s.p2].pos.y);
    ctx.stroke();
    ctx.closePath();
}

function drawLine(p1, p2) {
    ctx.beginPath();
    ctx.strokeStyle = "#777";
    ctx.lineWidth = rodSize;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
}

function calculateIntersections(a, b, c, d) {
    let intersections = [];
    for (let i = 0; i < sticks.length; i++) {
        const st = sticks[i];
        const p = points[st.p1].pos.x;
        const q = points[st.p1].pos.y;
        const r = points[st.p2].pos.x;
        const s = points[st.p2].pos.y;
        let det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det == 0) {
            continue;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            if ((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)) {
                intersections.push(i);
            }
        }
    }
    return intersections;
}

function setup() {
    if (preset.value == "Grid") {
        let offset = new Vector(100, 100);
        let gridSize = new Vector(51, 30);
        let tileSize = 40;
        for (let y = 0; y < gridSize.y; y++) {
            for (let x = 0; x < gridSize.x; x++) {
                let currentPoint = points.length;
                point(offset.x + x * tileSize, offset.y + y * tileSize, y == 0 && x % 5 == 0);
                if (y - 1 >= 0) stick(currentPoint, currentPoint - gridSize.x);
                if (x - 1 >= 0) stick(currentPoint, currentPoint - 1);
            }
        }
    }
}

function update() {
    if (!isPlaying) {
        if (mouseClick) {
            let clickedPoint = -1;
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                if (Vector.dst(p.pos, mousePos) <= pointSize) {
                    clickedPoint = i;
                }
            }
            if (rightClick) {
                let point = points[clickedPoint];
                if (clickedPoint == -1) selectedPoint = -1;
                else point.locked = point.locked ? false : true;
            } else {
                if (clickedPoint == -1) {
                    if (selectedPoint != -1) {
                        const newPoint = points.length;
                        point(mousePos.x, mousePos.y, false);
                        stick(selectedPoint, newPoint);
                        selectedPoint = newPoint;
                    } else point(mousePos.x, mousePos.y, false);
                } else {
                    if (selectedPoint != -1) {
                        console.log("Created stick between points " + selectedPoint + " and " + clickedPoint);
                        stick(selectedPoint, clickedPoint);
                        selectedPoint = -1;
                    } else selectedPoint = clickedPoint;
                }
            }
        }
    } else {
        // Update points
        points.forEach((p) => {
            if (!p.locked) {
                p.pos = Vector.add(p.pos, p.vel);
                p.vel.y += gravityScale;

                if (p.pos.y > dspHeight - pointSize) {
                    p.vel.y = -p.vel.y / 4;
                    p.pos.y = dspHeight - pointSize;
                    p.vel.x *= 0.8;
                }
            }
        });

        // Update sticks
        for (let i = 0; i < 8; i++) {
            sticks.forEach((s) => {
                let stickCenter = Vector.add(points[s.p1].pos, points[s.p2].pos).div(2);
                let stickDir = Vector.sub(points[s.p1].pos, points[s.p2].pos).normalize();
                if (!points[s.p1].locked) {
                    const motion = Vector.add(stickCenter, stickDir.setMag(s.length).div(2));
                    points[s.p1].vel = Vector.add(points[s.p1].vel, Vector.sub(motion, points[s.p1].pos));
                    points[s.p1].pos = motion;
                }
                if (!points[s.p2].locked) {
                    const motion = Vector.sub(stickCenter, stickDir.setMag(s.length).div(2));
                    points[s.p2].vel = Vector.add(points[s.p2].vel, Vector.sub(motion, points[s.p2].pos));
                    points[s.p2].pos = motion;
                }
            });
        }

        // Cutting sticks with the mouse
        let mouseIntersections = calculateIntersections(mousePos.x, mousePos.y, prevMousePos.x, prevMousePos.y);
        for (let i = 0; i < mouseIntersections.length; i++) {
            sticks.splice(mouseIntersections[i], 1);
        }
    }

    if (mouseClick) mouseClick = false;
    prevMousePos.x = mousePos.x;
    prevMousePos.y = mousePos.y;
}

function render() {
    ctx.fillStyle = "#334";
    ctx.fillRect(0, 0, dspWidth, dspHeight);
    if (selectedPoint != -1) drawLine(points[selectedPoint].pos, mousePos);
    for (let i = 0; i < sticks.length; i++) {
        drawStick(sticks[i]);
    }
    for (let i = 0; i < points.length; i++) {
        drawPoint(points[i]);
    }
}

function frame() {
    update();
    render();
    requestAnimationFrame(frame);
}

setup()
frame()