const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const fillButton = document.querySelector(".fill");
const clearButton = document.querySelector(".clear");
const saveButton = document.querySelector(".save");
const brushSizeInput = document.getElementById("ageInputID");
const brushSizeOutput = document.getElementById("ageOutputID");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let brushColor = colorPicker.value; 
let fillColor = colorPicker.value; 
let lineWidth = brushSizeInput.value; e
let drawing = false;
let strokes = []; 


colorPicker.addEventListener("input", function () {
    brushColor = colorPicker.value;
});


const colorCircles = document.querySelectorAll(".clr");
colorCircles.forEach((circle) => {
    circle.addEventListener("click", function () {
        brushColor = this.dataset.clr; 
        colorPicker.value = brushColor; 
    });
});


fillButton.addEventListener("click", function () {
    fillColor = colorPicker.value; 
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);  canvas
});


clearButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = []; 
});


saveButton.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = canvas.toDataURL(); 
    link.download = "canvas-drawing.png"; 
    link.click(); 
});


brushSizeInput.addEventListener("input", function () {
    lineWidth = brushSizeInput.value;
    brushSizeOutput.value = lineWidth; 
});


canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", function (e) {
    if (drawing) {
        ctx.lineWidth = lineWidth; 
        ctx.strokeStyle = brushColor; 
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", function () {
    drawing = false;
    ctx.closePath();
    
    strokes.push({
        color: brushColor,
        width: lineWidth,
        path: ctx.getImageData(0, 0, canvas.width, canvas.height)
    });
});

canvas.addEventListener("mouseout", function () {
    drawing = false;
    ctx.closePath();
});


document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === 'z') { 
        e.preventDefault(); 
        undoLastStroke();
    }
});


function undoLastStroke() {
    if (strokes.length > 0) {
        strokes.pop(); 
        redrawCanvas(); 
    }
}


function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(stroke => {
        ctx.putImageData(stroke.path, 0, 0); 
    });
}


const nav = document.querySelector(".nav");
const resizeHandle = document.createElement("div");
resizeHandle.classList.add("nav-resize");
nav.appendChild(resizeHandle); 

let isDragging = false;
let isResizing = false;
let initialX, initialY, initialWidth, initialHeight;


nav.addEventListener("mousedown", function (e) {
    if (e.target === resizeHandle) {
        isResizing = true; 
    } else if (!isMouseOverBrushSize(e)) { input
        isDragging = true; 
        initialX = e.clientX - nav.offsetLeft;
        initialY = e.clientY - nav.offsetTop;
    }
});


function isMouseOverBrushSize(e) {
    const brushSizeRect = brushSizeInput.getBoundingClientRect();
    return (
        e.clientX >= brushSizeRect.left &&
        e.clientX <= brushSizeRect.right &&
        e.clientY >= brushSizeRect.top &&
        e.clientY <= brushSizeRect.bottom
    );
}


document.addEventListener("mousemove", function (e) {
    if (isDragging) {
        nav.style.left = `${e.clientX - initialX}px`;
        nav.style.top = `${e.clientY - initialY}px`;
    } else if (isResizing) {
        const newWidth = e.clientX - nav.getBoundingClientRect().left;
        nav.style.width = `${newWidth}px`;
    }
});


document.addEventListener("mouseup", function () {
    isDragging = false;
    isResizing = false; 
});


