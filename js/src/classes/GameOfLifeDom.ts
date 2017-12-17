import GameOfLife from './GameOfLife'

/**
 * Extends the Game of Life class to display it as a grid.
 */
class GameOfLifeDom extends GameOfLife{
  
  // The game outer element
  protected game:HTMLElement
  // Grid element
  protected grid:HTMLElement
  // Grid item elements
  protected gridItems:Array<HTMLElement>

  /**
   * Constructor
   */
  constructor(cols:number = 50, rows:number = 50, selector:string = 'game'){
    super(cols, rows);

    // get the game node:
    this.game = document.getElementById(selector)
  
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

    this.events.subscribe('tick', 'updateDOM', ()=>{this.updateElements()})
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
   * Creates an array of html elements and appends them to the grid element
   */
  createGridElements():Array<HTMLElement>{
    let workingArray = []
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {

        // Create new element
        let newElement = document.createElement('div')

        // Set class and row/column
        newElement.classList.add('cell')
        newElement.dataset.row = i.toString();
        newElement.dataset.column = j.toString();

        // Add to return array
        workingArray.push(newElement)

        // Add reference to the grid attribute to reference later without querying the DOM
        this.grid.appendChild(newElement)
      }
    }
    return workingArray;
  }

  /**
   * Click event for the cells. 
   */
  cellClicked(event:Event){
    // Get the click events target
    const target = event.target as HTMLElement

    // Check that it is a cell that was clicked
    if (target.classList.contains('cell')){
      // Get the column and row from the data values
      const col = parseInt(target.dataset.column)
      const row = parseInt(target.dataset.row)
      // Update the alive state
      this.history[this.step][col][row] = !this.history[this.step][col][row]
      // Set the class of the item to reflect if it is alive or not
      if (this.history[this.step][col][row]){
        this.gridItems[ col + (row*this.cols) ].classList.add('alive')
      } else {
        this.gridItems[ col + (row*this.cols) ].classList.remove('alive')
      }
    }
  }
}

export default GameOfLifeDom