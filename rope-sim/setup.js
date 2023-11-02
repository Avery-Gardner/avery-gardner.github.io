const canvas = document.getElementById("simulation-canvas");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const clearButton = document.getElementById("clear-button");
const preset = document.getElementById("preset");

const presetOptions = ["Nothing", "Grid"];
presetOptions.forEach(function (option) {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("id", "preset-option-" + option)
    optionElement.text = option;
    preset.add(optionElement);
});

const dspWidth = 2 * (window.innerWidth - 320);
const dspHeight = 2 * window.innerHeight;
canvas.width = dspWidth;
canvas.height = dspHeight;
canvas.style.width =  window.innerWidth - 320 + 'px';
canvas.style.height = window.innerHeight + 'px';

const ctx = canvas.getContext('2d');