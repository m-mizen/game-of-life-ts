define("classes/Events", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Events {
        constructor(events) {
            this._hooks = {};
            for (let i = 0; i < events.length; i++) {
                this._hooks[events[i]] = {};
            }
        }
        subscribe(hook, name, func) {
            if (!this._hooks[hook]) {
                return false;
            }
            if (this._hooks[hook][name] !== undefined) {
                console.log('This name has already been used. Pease choose another');
                return false;
            }
            this._hooks[hook][name] = func;
            return true;
        }
        unSubscribe(hook, name) {
            if (!this._hooks[hook] || !this._hooks[hook][name]) {
                return false;
            }
            delete this._hooks[hook][name];
            return true;
        }
        trigger(hook) {
            if (!this._hooks[hook]) {
                return false;
            }
            try {
                for (const funcName in this._hooks[hook]) {
                    if (this._hooks[hook].hasOwnProperty(funcName)) {
                        const func = this._hooks[hook][funcName];
                        func();
                    }
                }
            }
            catch (e) {
                console.log(this._hooks[hook]);
                throw new Error(`Error triggering hook: ${hook}.`);
            }
            return true;
        }
        addEvent(name) {
            if (this._hooks[name] !== undefined) {
                return false;
            }
            this._hooks[name] = {};
            return true;
        }
        get list() {
            return Object.keys(this._hooks);
        }
    }
    exports.default = Events;
});
define("classes/GameOfLife", ["require", "exports", "classes/Events"], function (require, exports, Events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameOfLife {
        constructor(cols = 50, rows = 50) {
            this.cols = 50;
            this.rows = 50;
            this.history = new Array();
            this._step = 0;
            this._running = false;
            this._stable = false;
            this.events = new Events_1.default(['tick', 'init', 'destroy']);
            this.cols = cols;
            this.rows = rows;
            this.state = this.createGrid();
            this.events.trigger('init');
        }
        get state() {
            return this.history[this.step];
        }
        set state(newState) {
            this.history[this.step] = newState;
        }
        get step() {
            return this._step;
        }
        get stable() {
            return this._stable;
        }
        get running() {
            return this._running;
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
        updateState(currentState) {
            let newState = [];
            let identical = true;
            for (let i = 0; i < this.cols; i++) {
                newState.push([]);
                for (let j = 0; j < this.rows; j++) {
                    let wasAlive = currentState[i][j];
                    let nowAlive = false;
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
                    if (wasAlive) {
                        if (neighbors < 2 || neighbors > 3) {
                            nowAlive = false;
                        }
                        else {
                            nowAlive = true;
                        }
                    }
                    else {
                        if (neighbors == 3) {
                            nowAlive = true;
                        }
                        else {
                            nowAlive = false;
                        }
                    }
                    if (nowAlive !== wasAlive) {
                        identical = false;
                    }
                    newState[i].push(nowAlive);
                }
            }
            if (identical) {
                this._stable = true;
            }
            return newState;
        }
        tick() {
            let currentState = this.state;
            this._step++;
            this.state = this.updateState(currentState);
            this.events.trigger('tick');
            if (!this.stable && this.running) {
                setTimeout(() => {
                    this.tick();
                }, 200);
            }
        }
        play() {
            if (!this.running) {
                this._running = true;
                this.tick();
            }
        }
        pause() {
            this._running = false;
        }
    }
    exports.default = GameOfLife;
});
define("classes/GameOfLifeDom", ["require", "exports", "classes/GameOfLife"], function (require, exports, GameOfLife_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GameOfLifeDom extends GameOfLife_1.default {
        constructor(cols = 50, rows = 50, selector = 'game') {
            super(cols, rows);
            this.game = document.getElementById(selector);
            this.grid = document.createElement('div');
            this.grid.classList.add('container');
            this.grid.setAttribute('style', 'grid-template-columns: repeat(' + cols + ', 1fr); grid-template-rows: repeat(' + rows + ', 1fr);');
            this.grid.addEventListener('click', event => { this.cellClicked(event); });
            this.game.appendChild(this.grid);
            this.gridItems = this.createGridElements();
            this.events.subscribe('tick', 'updateDOM', () => { this.updateElements(); });
        }
        updateElements() {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    if (this.state[i][j]) {
                        this.gridItems[i + (j * this.cols)].classList.add('alive');
                    }
                    else {
                        this.gridItems[i + (j * this.cols)].classList.remove('alive');
                    }
                }
            }
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
    exports.default = GameOfLifeDom;
});
define("main", ["require", "exports", "classes/GameOfLifeDom"], function (require, exports, GameOfLifeDom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let game = new GameOfLifeDom_1.default();
    document.getElementById('play').addEventListener('click', () => { game.play(); });
    document.getElementById('pause').addEventListener('click', () => { game.pause(); });
    document.getElementById('step').addEventListener('click', () => {
        if (!game.running)
            game.tick();
    });
    document.getElementById('stop').addEventListener('click', () => {
        document.getElementById('game').innerHTML = '';
        game.pause();
        game = new GameOfLifeDom_1.default();
    });
    window.gameOfLife = game || {};
});
//# sourceMappingURL=build.js.map