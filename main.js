/*function randomInt(min, max) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;
    return result;
}
function shuffleList(arr) {
    let shuffledList = [];
    let temp = [...arr];
    while (temp.length > 0) {
        let index = randomInt(0, temp.length - 1);
        shuffledList.push(temp[index]);
        temp.splice(index, 1);
    }
    return shuffledList;
}

function createGrid() {
    nums = [];
    grid = [];
    if (mines > rows * cols) {
        outputTxt.innerText = `too many mines! you can't fit ${mines} mines in a ${rows}x${cols} grid!`
        return;
    }
    createEmptyGrid();
}


function createEmptyGrid() {
    for (let i = 0; i < (cols * rows); i++) {
        grid.push("safe");
    }
    gridContainer.innerHTML = "";
    //get rid of buttons from prev render
    gridContainer.style.width = `${cols*buttonWidth}px`;
        for (let i = 0; i < rows * cols; i++) {
        const child = document.createElement("button");
        child.classList.add("gameButtons");
        if ((i+ Math.floor(i/cols)) % 2  == 0) {
            child.classList.add("gameButtonStyleTwo");
        } else {
            child.classList.add("gameButtonStyleOne");
        }
        child.id = `gameButton${i}`;
        gridContainer.append(child);
        child.innerText = "";

        child.onclick = () => revealSquare(i);
        child.oncontextmenu = (e) => { 
            e.preventDefault(); 
            toggleFlag(i);
        }
    }
}

function fillGrid(i) {
    let row = Math.floor(i / cols);
    let col = i % cols;
    let safeSquares = [i];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) {
                continue; //skip middle square
            }
            let nRow = dr + row;
            let nCol = dc + col;
            if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
                //values are valid
                let nIndex = nCol + nRow * cols;
                safeSquares.push(nIndex);
            }
        }
    }

    for (let i = 0; i < mines; i++) {
        let replaced = false;
        let randCell = randomInt(0, grid.length - 1);
        //flat reduces it to 1d array
        //-1 bc arrays are 0 based
        

        while (replaced == false) {
            if (grid[randCell] !== "mine" && !safeSquares.includes(randCell)) {
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
        checkNeighbouringMines(i);
        let child = document.getElementById(`gameButton${i}`);
        child.classList.add(`gameButton${nums[i]}`);
        //creates nums list
    }

    //-------------------------------------------------------
    outputTxt.innerText = JSON.stringify(grid);
}


function checkNeighbouringMines(i) {    
    let row = Math.floor(i / cols);
    let col = i % cols;
    let temp = 0;
    // dr/dc = change in x/y
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) {
                continue; //skip middle square
            }
            let nRow = dr + row;
            let nCol = dc + col;
            if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
                //values are valid
                let nIndex = nCol + nRow * cols;
                if (grid[nIndex] === "mine") {
                    temp += 1;
                }
            }
        }
    }
    nums.push(temp);
}

function revealSquare(i) {
    if (!gameInProgress) return;
    let btn = document.getElementById(`gameButton${i}`);
    if (btn.classList.contains("flagged")) {
        return;
    }
    if (grid[i] == "mine") {
        endGame();
        return;
    }
    if (nums.length === 0) {
        fillGrid(i);
    }
    let row = Math.floor(i / cols);
    let col = i % cols;
    if (btn.classList.contains("revealed") || !btn) {
        //if alr revealed or doesnt exist
        return;
    }

    let val = nums[i];
    btn.classList.add("revealed");
    if (grid[i] == "mine") {
        btn.innerText = "boom";
        return;
    } else {
        
        revealed.push(i);
        if (revealed.length === rows*cols-mines) {
            //win!!!!
            gameInProgress = false;
            outputTxt.innerText = "you won!!!";
        }
        if ((i+ Math.floor(i/cols)) % 2  == 0) {
            btn.classList.remove("gameButtonStyleTwo")
            btn.classList.add("gameButtonStyleTwoRevealed");
        } else {
            btn.classList.remove("gameButtonStyleOne")
            btn.classList.add("gameButtonStyleOneRevealed");
        }
        if (val === 0) {
            btn.innerText = "";
        } else {
            btn.innerText = val;
        }
    }

    if (val === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) {
                    continue; //skip middle/current square
                }
                let nRow = dr + row;
                let nCol = dc + col;
                if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
                    //values are valid
                    let nIndex = nCol + nRow * cols;
                    revealSquare(nIndex)
                    //recursively reveal chained 0 squares
                }
            }
        }
    }
}

function toggleFlag(i) {
    if (!gameInProgress) return;
    btn = document.getElementById(`gameButton${i}`);
    if (btn.classList.contains("revealed")) { 
        return;
    } else {
        if (btn.classList.contains("flagged")) {
            btn.classList.remove("flagged");
            btn.innerText = "";
        } else {
            btn.classList.add("flagged");
            btn.innerText = "🚩";
        }
    }
}

function endGame() {
    outputTxt.innerText = "you lost :("
    gameInProgress = false;
    minesList = [];
    for (let i = 0; i < grid.length; i++) {
        if (grid[i] == "mine") {
            let mine = document.getElementById(`gameButton${i}`);
            minesList.push(mine); 
        }
    }
    let shuffledMinesList = shuffleList(minesList);
    for (i of shuffledMinesList) {
        i.classList.add("revealed");
        i.innerText = "💥";
        if ((i + Math.floor(i/cols)) % 2 == 0) {
            i.classList.remove("gameButtonStyleOne")
            i.classList.remove("gameButtonStyleTwo")
            i.classList.add("gameButtonStyleTwoRevealed");
        } else {
            i.classList.remove("gameButtonStyleOne")
            i.classList.remove("gameButtonStyleTwo")
            i.classList.add("gameButtonStyleOneRevealed");
        }
    }
}


const buttonWidth = 30;

let nums = [];
let grid = [];
let revealed = [];
let rows = 0;
let cols = 0;
let mines = 0;
let gridContainer = null;
let gameInProgress = false;
window.addEventListener("DOMContentLoaded", (event) => {
    const createBtn = document.getElementById("createBtn");
    const outputTxt = document.getElementById("outputTxt");
    gridContainer = document.getElementById("gridContainer");
    createBtn.addEventListener("click", () => {
        gameInProgress = true;
        nums = [];
        grid = [];
        revealed = [];
        outputTxt.innerText = "";
        rows = parseInt(document.getElementById("rowsInput").value);
        cols = parseInt(document.getElementById("colsInput").value);
        mines = parseInt(document.getElementById("minesInput").value);
        //createGrid();
        populateContainer();
    });
}); 


*/

let population = [];
let agentsCount = 0;
let rows = 0;
let cols = 0;
let mines = 0;

function populateContainer(rows, cols, mines) {
    let cont = document.getElementById("populationContainer");
    cont.innerHTML = "";
    population = [];
    
    for (let i = 0; i < agentsCount; i++) {
        let a = new agent(i, rows, cols, mines);
        population.push(a);
        cont.append(a.domcontainer);
    }
}

window.addEventListener("DOMContentLoaded", (event) => {
    const createBtn = document.getElementById("createBtn");
    const outputTxt = document.getElementById("outputTxt");

    createBtn.addEventListener("click", () => {
        rows = parseInt(document.getElementById("rowsInput").value);
        cols = parseInt(document.getElementById("colsInput").value);
        mines = parseInt(document.getElementById("minesInput").value);
        agentsCount = parseInt(document.getElementById("agentsInput").value);
        
        if (mines > rows * cols) {
            outputTxt.innerText = `Too many mines! You can't fit ${mines} mines in a ${rows}x${cols} grid!`;
            return;
        }

        outputTxt.innerText = "";
        populateContainer(rows, cols, mines);
    });
});

window.setInterval(() => {
    for (let ag in population) {
        if (ag.gameInProgress) {
            
        }
    }
}
    
, 1000)