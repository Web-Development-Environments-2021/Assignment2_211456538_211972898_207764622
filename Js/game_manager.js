document.addEventListener('keydown', onKeyEvent);
var finish_building_game = false;
let game;
let rect_size;
let ctx;
let score;
let pac_color;
let start_time;
let time_elapsed;
let interval;
let empty_cell_lst;
let border_color_hex = '#0037d4';
const x_axis_size = 20;
const y_axis_size = 23;
const wall_matrix = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
  [-1,-1,-1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,-1,-1,-1],
  [-1,-1,-1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,-1,-1,-1],
  [1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1],
  [2,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,2],
  [1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1],
  [-1,-1,-1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,-1,-1,-1],
  [-1,-1,-1,1,0,1,0,0,0,0,0,0,0,0,1,0,1,-1,-1,-1],
  [1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1],
  [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

$(document).ready(function() {
  ctx = canvas.getContext("2d");
  let width = window.innerWidth/1.02;
  let height = window.innerHeight/1.2;
  let rect_width = width / x_axis_size;
  let rect_height = height / y_axis_size;
  rect_size = Math.min(rect_width,rect_height);
  // let empty_lst = getEmptyPosition(wall_matrix)
  canvas.width = width;
  canvas.height = height;
  // drawBoardFromWalls(ctx,wall_matrix,rect_size);
  // drawCharacters(ctx,empty_lst,rect_size);

  game = new Game(wall_matrix);
  game.start();
  finish_building_game = true;
  console.log(game);
  drawGame(game,rect_size);
	// Start();
});

function onKeyEvent(e) {
  if(finish_building_game){
    switch(e.code){
      case 'ArrowLeft': game.movePacMan('left');
        break;
      case 'ArrowRight': game.movePacMan('right');
        break;
      case 'ArrowUp': game.movePacMan('up');
        break;
      case 'ArrowDown': game.movePacMan('down');
        break;
      case 'KeyA': game.movePacMan('left');
        break;
      case 'KeyD': game.movePacMan('right');
        break;
      case 'KeyW': game.movePacMan('up');
        break;

      case 'KeyS': game.movePacMan('down');
        break;
      default: break;
    }    
    drawGame(game,rect_size);
  }
}

function clearDrawing() {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fill()
}

function drawGame(game,rect_size) {
  clearDrawing();
  /* Draw Walls */
  drawWalls(game,rect_size);
  /* Draw all regular point on board */
  drawRegularPoint(game,rect_size);
  /* Draw Main Character */
  drawPacman(game,rect_size);
  /* Draw monster Character */
  drawMonsters(game,rect_size);

}

function drawWalls(game,rect_size){
  let x_padding,y_padding;
  const spacing = 0;
  ctx.strokeStyle = border_color_hex;// set draw color
  ctx.lineWidth = 2;
  ctx.beginPath();
  game.wall_list.forEach(position => {
    let [y_index, x_index] = position;
    x_padding = rect_size*x_index;
    y_padding = rect_size*y_index;
    ctx.rect(x_padding, y_padding,rect_size-spacing,rect_size-spacing);
  });
  ctx.stroke();
}

function drawPacman(game,rect_size){
  let player_img = new Image();
  let [y_position,x_position] = game.getPacmanPosition();
  let x_padding,y_padding;
  x_padding = x_position * rect_size;
  y_padding = y_position * rect_size;
  player_img.src = "https://i.gifer.com/1iIH.gif";
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.rect(x_padding,y_padding,rect_size,rect_size);
  ctx.fill();
}

function drawRegularPoint(game,rect_size){
  game.getRegularPoints().forEach(([score,position])=>{
    let [y_index,x_index] = position;
    let x_padding,y_padding;
    x_padding = x_index * rect_size + rect_size/2;
    y_padding = y_index * rect_size + rect_size/2;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(x_padding,y_padding,rect_size/4,0,2 * Math.PI);
    ctx.fill();
  });
}

function drawMonsters(game,rect_size){
  let monsters = game.getMonstersPosition();
  ctx.fillStyle = 'green';
  monsters.forEach(monster_position=>{
    let [y_position,x_position] = monster_position;
    let x_padding,y_padding;
    x_padding = x_position * rect_size;
    y_padding = y_position * rect_size;
    ctx.beginPath();
    ctx.rect(x_padding,y_padding,rect_size,rect_size);
    ctx.fill();
  });
 
}
function Start() {
	board = new Array();// Create Board as Matrix
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date(); // set Start time
}

