// The columns and rows of the grid:
class GameOfLife {
    constructor(cols = 50, rows = 50) {
        this.cols = 50;
        this.rows = 50;
        this.running = false;
        this.step = 0;
        this.history = new Array();
        // Set the cols and rows:
        this.cols = cols;
        this.rows = rows;
        // Create the initial state:
        this.state = this.createGrid();
        // get the game node:
        this.game = document.getElementById('game');
        // Create the grid DOM Node
        this.grid = document.createElement('div');
        this.grid.classList.add('container');
        this.grid.setAttribute('style', 'grid-template-columns: repeat(' + cols + ', 1fr); grid-template-rows: repeat(' + rows + ', 1fr);');
        this.grid.addEventListener('click', event => { this.cellClicked(event); });
        this.game.appendChild(this.grid);
        // Create the grid items
        this.gridItems = this.createGridElements();
    }
    get state() {
        return this.history[this.step];
    }
    set state(newState) {
        this.history[this.step] = newState;
    }
    createGrid() {
        let workingArray = [];
        for (let i = 0; i < this.cols; i++) {
            workingArray.push([]);
            for (let j = 0; j < this.rows; j++) {
                workingArray[i].push(false);
            }
        }
        return workingArray;
    }
    createGridElements() {
        let workingArray = [];
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let newElement = document.createElement('div');
                newElement.classList.add('cell');
                newElement.dataset.row = i.toString();
                newElement.dataset.column = j.toString();
                workingArray.push(newElement);
                this.grid.appendChild(newElement);
            }
        }
        return workingArray;
    }
    updateState(currentState) {
        let newState = [];
        for (let i = 0; i < this.cols; i++) {
            newState.push([]);
            for (let j = 0; j < this.rows; j++) {
                let alive = currentState[i][j];
                let neighbors = 0;
                const up = (j - 1 + this.rows) % this.rows;
                const down = (j + 1 + this.rows) % this.rows;
                const left = (i - 1 + this.cols) % this.cols;
                const right = (i + 1 + this.cols) % this.cols;
                if (currentState[i][up])
                    neighbors++;
                if (currentState[right][up])
                    neighbors++;
                if (currentState[right][j])
                    neighbors++;
                if (currentState[right][down])
                    neighbors++;
                if (currentState[i][down])
                    neighbors++;
                if (currentState[left][down])
                    neighbors++;
                if (currentState[left][j])
                    neighbors++;
                if (currentState[left][up])
                    neighbors++;
                if (alive) {
                    if (neighbors < 2 || neighbors > 3) {
                        newState[i].push(false);
                    }
                    else {
                        newState[i].push(true);
                    }
                }
                else {
                    if (neighbors == 3) {
                        newState[i].push(true);
                    }
                    else {
                        newState[i].push(false);
                    }
                }
            }
        }
        return newState;
    }
    updateElements() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                console.log('state ' + this.state[i][j], i, j);
                if (this.state[i][j]) {
                    this.gridItems[i + (j * this.cols)].classList.add('alive');
                }
                else {
                    this.gridItems[i + (j * this.cols)].classList.remove('alive');
                }
            }
        }
    }
    tick() {
        let currentState = this.state;
        this.step++;
        this.state = this.updateState(currentState);
        this.updateElements();
        if (this.running) {
            setTimeout(() => {
                this.tick();
            }, 200);
        }
    }
    play() {
        if (!this.running) {
            this.running = true;
            this.tick();
        }
    }
    pause() {
        this.running = false;
    }
    cellClicked(event) {
        const target = event.target;
        if (target.classList.contains('cell')) {
            const col = parseInt(target.dataset.column);
            const row = parseInt(target.dataset.row);
            this.history[this.step][col][row] = !this.history[this.step][col][row];
            if (this.history[this.step][col][row]) {
                this.gridItems[col + (row * this.cols)].classList.add('alive');
            }
            else {
                this.gridItems[col + (row * this.cols)].classList.remove('alive');
            }
        }
    }
}
let game = new GameOfLife();
document.getElementById('play').addEventListener('click', () => { game.play(); });
document.getElementById('pause').addEventListener('click', () => { game.pause(); });
document.getElementById('step').addEventListener('click', () => {
    if (!game.running)
        game.tick();
});
document.getElementById('stop').addEventListener('click', () => {
    document.getElementById('game').innerHTML = '';
    game = new GameOfLife();
});
