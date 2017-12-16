// The columns and rows of the grid:
class GameOfLife{

  cols:number = 50
  rows:number = 50

  game:HTMLElement
  grid:HTMLElement
  gridItems:Array<HTMLElement>

  running: boolean = false
  stable: boolean = false

  private step:number = 0;
  private history:Array<Array<Array<boolean>>> = new Array();

  constructor( cols:number = 50, rows:number = 50 ){

    // Set the cols and rows:
    this.cols = cols

    this.rows = rows

    // Create the initial state:
    this.state = this.createGrid()

    // get the game node:
    this.game = document.getElementById('game')

    // Create the grid element
    this.grid = document.createElement('div')
    this.grid.classList.add('container')

    // Set CSS grid columns
    this.grid.setAttribute('style', 'grid-template-columns: repeat('+cols+', 1fr); grid-template-rows: repeat('+rows+', 1fr);')

    // Add click event listener
    this.grid.addEventListener('click', event=>{this.cellClicked(event)})

    // Add grid to game element
    this.game.appendChild(this.grid)

    // Create the grid items
    this.gridItems = this.createGridElements()

  }

  /**
   * Get current state
   */
  get state():Array<Array<boolean>>{
    return this.history[this.step]
  }

  /**
   * Set current state
   */
  set state(newState:Array<Array<boolean>>){
    this.history[this.step] = newState;
  }

  /**
   * Creates a new blank grid
   */
  createGrid():Array<Array<boolean>>{
    let workingArray = []
    for (let i = 0; i < this.cols; i++) {
      workingArray.push([])
      for (let j = 0; j < this.rows; j++) {
        workingArray[i].push(false);
      }
    }
    return workingArray;
  }

  /**
   * Creates an array of html elements and adds the within the grid element
   */
  createGridElements():Array<HTMLElement>{
    let workingArray = []
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let newElement = document.createElement('div')

        newElement.classList.add('cell')

        newElement.dataset.row = i.toString();
        newElement.dataset.column = j.toString();

        workingArray.push(newElement)

        this.grid.appendChild(newElement)
      }
    }
    return workingArray;
  }

  /**
   * Loops through the previous state and creates the new state
   */
  updateState(currentState){

    // Net state working array
    let newState = []

    // If the new state is identical to the old state
    let identical = true

    for (let i = 0; i < this.cols; i++) {
      newState.push([])
      for (let j = 0; j < this.rows; j++) {

        // Previously alive
        let wasAlive = currentState[i][j]
        // If it will be alive now
        let nowAlive = false

        // Number of neighboring cells that are alive
        let neighbors = 0;

        // the 'j' coordinate of the cells above
        const up = (j - 1 + this.rows) % this.rows
        // the 'j' coordinate of the cells below
        const down = (j + 1 + this.rows) % this.rows
        // the 'i' coordinate of the cells left
        const left = (i - 1 + this.cols) % this.cols
        // the 'i' coordinate of the cells right
        const right = (i + 1 + this.cols) % this.cols

        // Count neibors
        if ( currentState[i][up] ) neighbors++
        if ( currentState[right][up] ) neighbors++
        if ( currentState[right][j] ) neighbors++
        if ( currentState[right][down] ) neighbors++
        if ( currentState[i][down] ) neighbors++
        if ( currentState[left][down] ) neighbors++
        if ( currentState[left][j] ) neighbors++
        if ( currentState[left][up] ) neighbors++

        // Is it now alive?
        if(wasAlive){
          if(neighbors < 2 || neighbors > 3){
            nowAlive = false
          } else {
            nowAlive = true
          }
        } else {
          if(neighbors == 3){
            nowAlive = true
          } else {
            nowAlive = false
          }
        }

        // If different than before then arrays aren't identical
        if (nowAlive !== wasAlive){
          identical = false
        }
        // Push new sate to working array
        newState[i].push(nowAlive)
      }
    }

    // Set stable to true if the arrays are identical
    if (identical){
      this.stable = true
    }
    return newState;
  }

  /**
   * Update the DOM elements to reflect the current state
   */
  updateElements(){
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.state[i][j]){
          this.gridItems[ i + (j*this.cols) ].classList.add('alive')
        } else {
          this.gridItems[ i + (j*this.cols) ].classList.remove('alive')
        }
      }
    }
  }

  /**
   * Go to the next state
   */
  tick(){

    let currentState = this.state
    this.step++
    this.state = this.updateState(currentState)

    this.updateElements()

    if (!this.stable && this.running){
      setTimeout( ()=>{
        this.tick()
      }, 200 )
    }
  }

  /**
   * Start the game
   */
  play(){
    if (!this.running){
      this.running = true
      this.tick()
    }
  }

  /**
   * Pause the game
   */
  pause(){
    this.running = false
  }

  /**
   * Click event for the cells. 
   */
  cellClicked(event:Event){
    const target = event.target as HTMLElement
    if (target.classList.contains('cell')){
      const col = parseInt(target.dataset.column)
      const row = parseInt(target.dataset.row)
      this.history[this.step][col][row] = !this.history[this.step][col][row]
      if (this.history[this.step][col][row]){
        this.gridItems[ col + (row*this.cols) ].classList.add('alive')
      } else {
        this.gridItems[ col + (row*this.cols) ].classList.remove('alive')
      }
    }
  }

}

// Instantiate a new game
let game = new GameOfLife()

// Add event listeners to the controls
document.getElementById('play').addEventListener('click', ()=>{game.play()})
document.getElementById('pause').addEventListener('click', ()=>{game.pause()})
document.getElementById('step').addEventListener('click', ()=>{ 
  if (!game.running) game.tick()
})
document.getElementById('stop').addEventListener('click', ()=>{ 
  document.getElementById('game').innerHTML = '';
  game = new GameOfLife()
})

