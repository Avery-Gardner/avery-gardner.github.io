let particleSize = 8;
let isPlaying = false;
let particles = [];

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

function randomX() {
    return Math.random() * (dspWidth - particleSize * 2 - 200) + 100;
}

function randomY() {
    return Math.random() * (dspHeight - particleSize * 2 - 200) + 100;
}