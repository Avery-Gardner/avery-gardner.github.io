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

const itemList = document.getElementById("item-list");
const addItemButton = document.getElementById("add-item");

document.addEventListener("DOMContentLoaded", function () {  
    addItemButton.addEventListener("click", function() {
        addItem();
        resetCalled = true;
    });
});

const colorOptions = ["Red", "Lime", "Blue", "Yellow", "Orange", "Green", "Gray", "Gold", "Purple", "White"];

function addItem(amount, color) {
    const listItem = document.createElement("li");
    const numberInput = document.createElement("input");
    numberInput.setAttribute("id", "listnum");
    numberInput.setAttribute("type", "number");
    numberInput.setAttribute("placeholder", "Amount");
    numberInput.setAttribute("value", amount);
    
    const colorInput = document.createElement("select");
    colorInput.setAttribute("id", "liststr");
    colorInput.setAttribute("type", "text");
    colorInput.setAttribute("placeholder", "Color");
    colorInput.setAttribute("value", color);

    colorOptions.forEach(function (color) {
      const option = document.createElement("option");
      option.text = color;
      colorInput.add(option);
    });

    const removeButton = document.createElement("button");
    removeButton.setAttribute("id", "listrem");
    removeButton.innerText = "X";
    
    removeButton.addEventListener("click", function() {
        itemList.removeChild(listItem);
        resetCalled = true;
    });

    listItem.appendChild(numberInput);
    listItem.appendChild(colorInput);
    listItem.appendChild(removeButton);

    itemList.appendChild(listItem);
}

let initialAmounts = [];
let initialColors = [];

let isInitial = true;
let resetCalled = false;

function processListItems() {
    if (isInitial) {
        isInitial = false;
        addItem(300, "lime");
        addItem(300, "red");
        addItem(300, "blue");
    }
    const listItems = document.querySelectorAll("#item-list li");
    initialAmounts = [];
    initialColors = [];
    listItems.forEach(function (item) {
        const numberInput = item.querySelector("input[type='number']");
        const stringInput = item.querySelector("select");
        const number = numberInput.value;
        const color = stringInput.value;
        initialAmounts.push(number);
        initialColors.push(color);
    });
}