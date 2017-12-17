import Events from './Events'

class GameOfLife{
  
  // Number of columns
  protected cols:number = 50
  // Number of rows
  protected rows:number = 50
  // History of states
  protected history:Array<Array<Array<boolean>>> = new Array()
  // The current step
  protected _step:number = 0
  // If the game is playing
  protected _running: boolean = false
  // If the game is in a stable state
  protected _stable: boolean = false
  // The games events
  events: Events = new Events(['tick', 'init', 'destroy'])

  /**
   * Constructor function
   */
  constructor( cols:number = 50, rows:number = 50 ){

    // Set the cols and rows:
    this.cols = cols
    this.rows = rows

    // Create the initial state:
    this.state = this.createGrid()

    // Trigger init event
    this.events.trigger('init')
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
   * Get current step
   */
  get step():number{
    return this._step
  }

  /**
   * Get the stable state
   */
  get stable():boolean{
    return this._stable
  }

  /**
   * Get the running state
   */
  get running():boolean{
    return this._running
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
   * Loops through the previous state and creates the new state
   */
  updateState(currentState:Array<Array<boolean>>):Array<Array<boolean>>{

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

        // Count living neighbors
        if ( currentState[i][up] )       neighbors++
        if ( currentState[right][up] )   neighbors++
        if ( currentState[right][j] )    neighbors++
        if ( currentState[right][down] ) neighbors++
        if ( currentState[i][down] )     neighbors++
        if ( currentState[left][down] )  neighbors++
        if ( currentState[left][j] )     neighbors++
        if ( currentState[left][up] )    neighbors++

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
      this._stable = true
    }
    return newState;
  }

  /**
   * Go to the next state
   */
  tick(){

    let currentState = this.state
    this._step++
    this.state = this.updateState(currentState)

    this.events.trigger('tick')

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
      this._running = true
      this.tick()
    }
  }

  /**
   * Pause the game
   */
  pause(){
    this._running = false
  }

}

export default GameOfLife