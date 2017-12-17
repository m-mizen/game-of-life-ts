System.register("classes/Events", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Events;
    return {
        setters: [],
        execute: function () {
            Events = class Events {
                constructor() {
                    this.hooks = {
                        tick: {},
                        init: {},
                        destroy: {},
                    };
                }
                subscribe(hook, name, func) {
                    if (!this.hooks[hook]) {
                        return false;
                    }
                    if (this.hooks[hook][name] !== undefined) {
                        console.log('This name has already been used. Pease choose another');
                        return false;
                    }
                    this.hooks[hook][name] = func;
                    return true;
                }
                unSubscribe(hook, name) {
                    if (!this.hooks[hook] || !this.hooks[hook][name]) {
                        return false;
                    }
                    delete this.hooks[hook][name];
                    return true;
                }
                trigger(hook) {
                    if (!this.hooks[hook]) {
                        return false;
                    }
                    console.log(this.hooks[hook]);
                    try {
                        for (const funcName in this.hooks[hook]) {
                            if (this.hooks[hook].hasOwnProperty(funcName)) {
                                const func = this.hooks[hook][funcName];
                                func();
                            }
                        }
                    }
                    catch (e) {
                        console.log(this.hooks[hook]);
                        throw new Error(`Error triggering hook: ${hook}.`);
                    }
                    return true;
                }
            };
            exports_1("default", Events);
        }
    };
});
System.register("classes/GameOfLife", ["classes/Events"], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Events_1, GameOfLife;
    return {
        setters: [
            function (Events_1_1) {
                Events_1 = Events_1_1;
            }
        ],
        execute: function () {
            GameOfLife = class GameOfLife {
                constructor(cols = 50, rows = 50) {
                    this.cols = 50;
                    this.rows = 50;
                    this.running = false;
                    this.stable = false;
                    this.step = 0;
                    this.history = new Array();
                    this.events = new Events_1.default();
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
                        this.stable = true;
                    }
                    return newState;
                }
                tick() {
                    let currentState = this.state;
                    this.step++;
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
                        this.running = true;
                        this.tick();
                    }
                }
                pause() {
                    this.running = false;
                }
            };
            exports_2("default", GameOfLife);
        }
    };
});
System.register("classes/GameOfLifeDom", ["classes/GameOfLife"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var GameOfLife_1, GameOfLifeDom;
    return {
        setters: [
            function (GameOfLife_1_1) {
                GameOfLife_1 = GameOfLife_1_1;
            }
        ],
        execute: function () {
            GameOfLifeDom = class GameOfLifeDom extends GameOfLife_1.default {
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
            };
            exports_3("default", GameOfLifeDom);
        }
    };
});
System.register("main", ["classes/GameOfLifeDom"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var GameOfLifeDom_1, game;
    return {
        setters: [
            function (GameOfLifeDom_1_1) {
                GameOfLifeDom_1 = GameOfLifeDom_1_1;
            }
        ],
        execute: function () {
            game = new GameOfLifeDom_1.default();
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
        }
    };
});
//# sourceMappingURL=build.js.map