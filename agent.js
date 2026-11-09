class agent {
    constructor(index, rows, cols, mines) {
        
        this.index = index;
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;

        this.grid = [];
        this.nums = [];
        this.revealed = [];

        this.score = 0;
        this.isAlive = true;
        this.gameInProgress = true;

        this.brain = new NeuralNetwork(rows * cols, 16, rows * cols);
        this.domcontainer = document.createElement("div");
        this.domcontainer.classList.add("agentContainer");
        this.domcontainer.style.padding = "10px";
        this.createEmptyGrid();
    }
    randomInt(min, max) {
        let result = Math.floor(Math.random() * (max - min + 1)) + min;
        return result;
    }
    shuffleList(arr) {
        let shuffledList = [];
        let temp = [...arr];
        while (temp.length > 0) {
            let index = randomInt(0, temp.length - 1);
            shuffledList.push(temp[index]);
            temp.splice(index, 1);
        }
        return shuffledList;
    }

    createEmptyGrid() {
        const btnSize = 20; //------------------
        this.domcontainer.style.width = `${this.cols * btnSize}px`;
        for (let i = 0; i < this.rows * this.cols; i++) {
            this.grid.push("safe");
            this.nums.push(0);
            this.revealed.push(false);

            const btn = document.createElement("button");
            btn.classList.add("gameButtons");
            btn.id = `gameButton${i}Agent${this.index}`;
            btn.innerText = "";


            btn.style.width = `${btnSize}px`;
            btn.style.height = `${btnSize}px`;
            this.domcontainer.append(btn);
        }
    }

    fillGrid(i) {
        let row = Math.floor(i / this.cols);
        let col = i % this.cols;
        let safeSquares = [i];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) {
                    continue;
                }
                let nRow = dr + row;
                let nCol = dc + col;
                if (nRow >= 0 && nRow < this.rows && nCol >= 0 && nCol < this.cols) {
                    let nIndex = nCol + nRow * this.cols;
                    safeSquares.push(nIndex);
                }
            }
        }

        for (let m = 0; m < this.mines; m++) {
            let replaced = false;
            let randCell = randomInt(0, this.grid.length - 1);

            while (replaced == false) {
                if (this.grid[randCell] !== "mine" && !safeSquares.includes(randCell)) {
                    this.grid[randCell] = "mine";
                    replaced = true;
                } else {
                    randCell = randomInt(0, this.grid.length - 1);
                }
            } 
        }

        for (let j = 0; j < this.rows * this.cols; j++) {
            this.checkNeighbouringMines(j);
            let child = document.getElementById(`gameButton${j}Agent${this.index}`);
            if (child) {
                child.classList.add(`gameButton${this.nums[j]}`);
            }
        }
    }

    checkNeighbouringMines(i) {    
        let row = Math.floor(i / this.cols);
        let col = i % this.cols;
        let temp = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) {
                    continue;
                }
                let nRow = dr + row;
                let nCol = dc + col;
                if (nRow >= 0 && nRow < this.rows && nCol >= 0 && nCol < this.cols) {
                    let nIndex = nCol + nRow * this.cols;
                    if (this.grid[nIndex] === "mine") {
                        temp += 1;
                    }
                }
            }
        }
        this.nums.push(temp);
    }

    revealSquare(i) {
        if (!this.gameInProgress) return;
        let btn = document.getElementById(`gameButton${i}Agent${this.index}`);
        if (!btn || btn.classList.contains("flagged")) {
            return;
        }
        if (this.grid[i] == "mine") {
            this.endGame();
            return;
        }
        if (this.nums.length === 0) {
            this.fillGrid(i);
        }
        let row = Math.floor(i / this.cols);
        let col = i % this.cols;
        if (btn.classList.contains("revealed")) {
            return;
        }

        let val = this.nums[i];
        btn.classList.add("revealed");
        if (this.grid[i] == "mine") {
            btn.innerText = "boom";
            return;
        } else {
            this.revealed.push(i);
            if (this.revealed.length === this.rows * this.cols - this.mines) {
                this.gameInProgress = false;
            }
            if ((i + Math.floor(i / this.cols)) % 2 == 0) {
                btn.classList.remove("gameButtonStyleTwo");
                btn.classList.add("gameButtonStyleTwoRevealed");
            } else {
                btn.classList.remove("gameButtonStyleOne");
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
                        continue;
                    }
                    let nRow = dr + row;
                    let nCol = dc + col;
                    if (nRow >= 0 && nRow < this.rows && nCol >= 0 && nCol < this.cols) {
                        let nIndex = nCol + nRow * this.cols;
                        this.revealSquare(nIndex);
                    }
                }
            }
        }
    }

    toggleFlag(i) {
        if (!this.gameInProgress) return;
        let btn = document.getElementById(`gameButton${i}Agent${this.index}`);
        if (!btn || btn.classList.contains("revealed")) { 
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

    endGame() {
        this.gameInProgress = false;
        let minesList = [];
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i] == "mine") {
                let mine = document.getElementById(`gameButton${i}Agent${this.index}`);
                if (mine) {
                    minesList.push(mine); 
                }
            }
        }
        let shuffledMinesList = shuffleList(minesList);
        for (let i of shuffledMinesList) {
            i.classList.add("revealed");
            i.innerText = "💥";
            i.classList.remove("gameButtonStyleOne");
            i.classList.remove("gameButtonStyleTwo");
            i.classList.add("gameButtonStyleTwoRevealed");
        }
    }



    think() {
        let arr = [];
        for (let i = 0; i < this.rows*this.cols; i++) {
            let square = document.getElementById(`gameButton${i}Agent${this.index}`);
            //hidden = -1
            //flagged = -2
            //revealed = 0/1/2/3/4/5/6/7/8
            if (square.classList.contains("revealed")) {
                arr.push(this.nums[i]);
            } else if (square.classList.contains("flagged")){
                arr.push(-2);
            } else {//hidden
                arr.push(-1);
            }
        }
        let outputs = this.brain.predict(arr);
        return outputs;
    }

    doAction() {
        const outputs = this.think();
        let bestSquare = -Infinity;
        let bestSquareIndex = 0;
        for (let i = 0; i < 2*this.rows*this.cols; i++) {
            let squareIndex = i >= this.rows*this.cols ? i - this.rows*this.cols : i;
            let square = document.getElementById(`gameButton${squareIndex}Agent${this.index}`);
            if (square.classList.contains("revealed")) {
                continue;
            }
            if (outputs[i] > bestSquare) {
                bestSquare = outputs[i];
                bestSquareIndex = i;
            } else if (outputs[i] == bestSquare) {
                if (randomInt(0, 1) === 0) {
                    bestSquare = outputs[i];
                    bestSquareIndex = i;
                } //else: it stays the same
            }
        }
        if (bestSquareIndex >= this.rows*this.cols) {
            this.toggleFlag(bestSquareIndex-this.rows*this.cols);
        } else {
            this.revealSquare(bestSquareIndex);
        }
    }
}