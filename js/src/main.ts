import GameOfLifeDom from './classes/GameOfLifeDom'

// Instantiate a new game
let game = new GameOfLifeDom()

// Add event listeners to the controls
document.getElementById('play').addEventListener('click', ()=>{game.play()})
document.getElementById('pause').addEventListener('click', ()=>{game.pause()})
document.getElementById('step').addEventListener('click', ()=>{ 
  if (!game.running) game.tick()
})
document.getElementById('stop').addEventListener('click', ()=>{ 
  document.getElementById('game').innerHTML = '';
  game.pause()
  game = new GameOfLifeDom()
})

