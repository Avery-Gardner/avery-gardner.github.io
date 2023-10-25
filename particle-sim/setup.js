const canvas = document.getElementById("simulation-canvas");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");

const speedInput = document.getElementById("speed-input");
const selectionInput = document.getElementById("selection-input");
const sizeInput = document.getElementById("size-input");

const dspWidth = 2 * (window.innerWidth - 320);
const dspHeight = 2 * window.innerHeight;
canvas.width = dspWidth;
canvas.height = dspHeight;
canvas.style.width =  window.innerWidth - 320 + 'px';
canvas.style.height = window.innerHeight + 'px';

const ctx = canvas.getContext('2d');