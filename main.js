function randomInt(min, max) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return result;
}

function createGrid(rows, cols, mines) {
    let grid = [];
    for (let i = 0; i < (cols * rows); i++) {
        grid.push("safe");
    }
    //makes a grid of rows*cols length
    //that all values in it are "safe"

    for (let i = 0; i < mines; i++) {
        let replaced = false;
        randCell = randomInt(0, grid.length - 1);
        //flat reduces it to 1d array
        //-1 bc arrays are 0 based
        console.log(randCell);
        while (replaced == false) {
            if (grid[randCell] !== "mine") {
                grid[randCell] = "mine";
                replaced = true;
                console.log("replaced safe with mine");
            } else {
                randCell = randomInt(0, grid.length - 1);
            }
        } 
    }
    
    //replaces {mines} values with "mine"
    outputTxt.innerText = JSON.stringify(grid);
    //renderGrid(grid, rows, cols);
}

function renderGrid(grid, rows, cols) {
    for (let i = 0; i <= rows * cols; i++) {
        const child = document.createElement('button');
        gridContainer.appendChild(child);
        child.style.innerText = grid[i];
    }
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateCols = `repeat(${cols}, 1fr)`;
}


window.addEventListener("DOMContentLoaded", (event) => {
    const createBtn = document.getElementById("createBtn");
    const outputTxt = document.getElementById("outputTxt");
    const rowsInputted = document.getElementById("rowsInput").value;
    const colsInputted = document.getElementById("colsInput").value;
    const gridContainer = document.getElementById("gridContainer");
    createBtn.addEventListener("click", () => {
        createGrid(12, 12, 10)
    });
}); 

