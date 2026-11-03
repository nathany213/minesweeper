function randomInt(min, max) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return result;
}
function removeFromList(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
}

function createGrid(rows, cols, mines) {
    let grid = [];
    let nums = [];
    if (mines > rows * cols) {
        outputTxt.innerText = `too many mines! you can't fit ${mines} mines in a ${rows}x${cols} grid!`
        return;
    }
    for (let i = 0; i < (cols * rows); i++) {
        grid.push("safe");
    }
    //makes a grid of rows*cols length
    //that all values in it are "safe"

    for (let i = 0; i < mines; i++) {
        let replaced = false;
        let randCell = randomInt(0, grid.length - 1);
        //flat reduces it to 1d array
        //-1 bc arrays are 0 based
        while (replaced == false) {
            if (grid[randCell] !== "mine") {
                grid[randCell] = "mine";
                replaced = true;
            } else {
                randCell = randomInt(0, grid.length - 1);
            }
        } 
    }
    //replaces {mines} values with "mine"

    //-------------------------------------------------------

    for (let i = 0; i < rows * cols; i++) {
        let temp = 0;
        let checkableNums = [0, 1, 2, 3, 5, 6, 7, 8];

        //converts from num into index of grid
        let formulae = [i-1-cols, i-cols, i+1-cols, i-1, i, i+1, i-1+cols, i+cols, i+1+cols]

        //row length = r = {cols}
        //|i-1-r| i-r |i+1-r| | 0 1 2
        //| i-1 |  i  | i+1 | | 3 i 5
        //|i-1+r| i+r |i+1+r| | 6 7 8


        //excludes numbers if cut off by edges
        if (i % cols == 0) { //on left edge
            removeFromList(checkableNums, 0);
            removeFromList(checkableNums, 3);
            removeFromList(checkableNums, 6);
        } else if (i % cols == cols-1) { //on right edge
            removeFromList(checkableNums, 2);
            removeFromList(checkableNums, 5);
            removeFromList(checkableNums, 8);
        }
        if (i < cols) { // on top edge
            removeFromList(checkableNums, 0);
            removeFromList(checkableNums, 1);
            removeFromList(checkableNums, 2);
        } else if (i >= cols*(rows-1)) {
            removeFromList(checkableNums, 6);
            removeFromList(checkableNums, 7);
            removeFromList(checkableNums, 8);
        }

        for (let num of checkableNums) {
            const index = formulae[num];
            if (grid[index] == "mine") {
                temp += 1;
            }
        }
        nums.push(temp);
        console.log(temp);
    }
    //-------------------------------------------------------
    outputTxt.innerText = JSON.stringify(grid);
    renderGrid(nums, rows, cols);
}

function renderGrid(nums, rows, cols) {
    document.querySelectorAll(".gameButtons").forEach(btn => btn.remove());
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateCols = `repeat(${cols}, 1fr)`;
    for (let i = 0; i < rows * cols; i++) {
        const child = document.createElement("button");
        child.classList.add("gameButtons")
        gridContainer.append(child);
        child.innerText = nums[i];
    }
}


window.addEventListener("DOMContentLoaded", (event) => {
    const createBtn = document.getElementById("createBtn");
    const outputTxt = document.getElementById("outputTxt");
    const gridContainer = document.getElementById("gridContainer");
    createBtn.addEventListener("click", () => {
        const rowsInputted = parseInt(document.getElementById("rowsInput").value);
        const colsInputted = parseInt(document.getElementById("colsInput").value);
        const minesInputted = parseInt(document.getElementById("minesInput").value);
        createGrid(rowsInputted, colsInputted, minesInputted)
    });
}); 

