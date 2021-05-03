//var modal2 = document.getElementById("myModal");
var gameOver=false;
var users = {"k" : "k"};
var keys = {}; 
var keysCodes = {};
document.addEventListener('keydown', onKeyEvent);
var finish_building_game = false;
let last_pacman_movement = 'up';
let pac_velocity = 5;
let other_velocity = 5;
let rect_size;
let ctx;
let color_mapper;
let pac_color;
let start_time;
//let time_elapsed;
let interval;
let empty_cell_lst;
let heart_img_path = './assets/img/heart.png';
let border_color_hex = '#2e348b';
const x_axis_size = 20;
const y_axis_size = 23;
const wall_matrix = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
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
  [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

$(document).ready(function() {
  init();
  ctx = canvas.getContext("2d");
  let width = window.innerWidth/1.02;
  let height = window.innerHeight/1.6;
  let rect_width = width / x_axis_size;
  let rect_height = height / y_axis_size;
  rect_size = Math.min(rect_width,rect_height);
  canvas.width = x_axis_size*rect_size;
  canvas.height = y_axis_size*rect_size;
  let point_color_lst = ['red','yellow','brown'];
  color_mapper = {
  5: point_color_lst[0],
  15: point_color_lst[1],
  25: point_color_lst[2],
  } 
});

function startGame(){
  let gameInterval = setInterval(()=>{
    if(game.canMovePacman(last_pacman_movement)){
      game.movePacman(last_pacman_movement);
    }
    game.moveCharry();
    game.disappearingCandy();
    game.moveMonsters(game.getPacmanPosition());
    drawGame();
    let t = game.checkIfHitMonster(game.getPacmanPosition());
    if(t!= 0 ){
      if(t==1)
      {
        game.live--;
      }
      if(t==2)
      {
        game.live-=2;
        game.score -= 10;
      }
        game.score -= 10;
        game.generateMonsters();
        game.placePacmanInRandomPosition();;
    }
    document.getElementById("lblScore").value = game.getScore();
    let live = game.getLive();
    document.getElementById("lblLives").value = live;
    let time = game.getTime();
    let end_game_text = 'Loser';
    if(time<=0 || live<=0){
      if(time <= 0){
        end_game_text = `You Are Better Than ${game.score} Points`;
      }
      gameOver = true;
      // let img = new Image();
      // img.src = '/./../assets/img/gameover.jpg';
      // ctx.drawImage(img,0,0,canvas.width,canvas.height);
      // document.getElementById("lblScore").value = "";
      // document.getElementById("lblTime").value = "";
      // document.getElementById("lblLives").value = "";
      audio.pause(); 
      document.getElementById("lblGameRes").innerText = end_game_text;
      document.getElementById("myModal").style.display = "block";
      clearInterval(gameInterval);
    }
    else if(game.regular_points.length == 0 || game.score>500){
      gameOver = true;
      end_game_text = 'Winner Winner Chicken Dinner!!'
      document.getElementById("lblGameRes").innerText = end_game_text;
      document.getElementById("myModal").style.display = "block";
      audio.pause(); 
      clearInterval(gameInterval);
    }

  },350);

}


function onKeyEvent(e) {
  let value, new_move;
  if(finish_building_game){
    switch(e.code){
      case keys["left"]: value = game.canMovePacman('left');
        new_move = 'left';
        break;
      case keys["right"]: value = game.canMovePacman('right');
        new_move = 'right';
        break;
      case keys["up"]: value = game.canMovePacman('up');
        new_move = 'up';
        break;
      case keys["down"]: value = game.canMovePacman('down');
        new_move = 'down';
        break;
      default: break;
    }
    if(value == undefined) return;
    last_pacman_movement = new_move;
    if (!gameOver){
      drawGame();
    }
  }
}

function clearDrawing() {
  ctx.fillStyle = '#ecf0f1';
  ctx.beginPath();
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fill()
}

function drawGame() {
  clearDrawing();
  /* Draw Walls */
  drawWalls();
  /* Draw all regular point on board */
  drawRegularPoint();
  /* Draw Charry Character */
  drawCharry();
  /* Draw Heart Character */
  drawHeart();
  /* Draw Clock Character */
  drawClock()
  /* Draw Main Character */
  drawPacman();
  /* Draw monster Character */
  drawMonsters();
  drawCandy();
}

function drawWalls(){
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

function drawPacman(){
  const spacing = 0;
  let img = new Image();
  let [y_index, x_index] = game.getPacmanPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size; 
  img.src = `./assets/img/pacman/${last_pacman_movement}.png`;
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}

function drawHeart(){
  const spacing = 0;
  let img = new Image();
  if(!game.getIsHeartActive()) return;
  let [y_index, x_index] = game.getHeartPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size;
  img.src = heart_img_path;
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}

function drawClock(){
  const spacing = 0;
  let img = new Image();
  if(!game.getIsClockActive())return;
  let [y_index, x_index] = game.getClockPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size;
  img.src = './assets/img/clock.png';
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}

function drawRegularPoint(){
  game.getRegularPoints().forEach(([p,position])=>{
    let [y_index,x_index] = position;
    let x_padding,y_padding;
    x_padding = x_index * rect_size + rect_size/2;
    y_padding = y_index * rect_size + rect_size/2;
    ctx.fillStyle = color_mapper[p];
    ctx.beginPath();
    ctx.arc(x_padding,y_padding,rect_size/8,0,2 * Math.PI);
    ctx.fill();
  });
}

function drawMonsters(){
  const spacing = 0;
  let monsters = game.getMonstersPosition();
  let types = game.getMonstersTypes();
  let path = './assets/img/monsters/';
  let index = 0;
  monsters.forEach(monster_position=>{
    let [y_position,x_position] = monster_position;
    let x_padding,y_padding;
    let img = new Image();
    if(types[index] == "Monster")
    {
      img.src = path + `${index}.png`;
      x_padding = x_position * rect_size;
      y_padding = y_position * rect_size;
      ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
    }
    else if(types[index] == "MonsterBig")
    {
      img.src = path + `5.png`;
      x_padding = x_position * rect_size;
      y_padding = y_position * rect_size;
      ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
    }
    index++;
  });
 
}

function drawCharry(){
  const spacing = 0;
  let img = new Image();
  let [y_index, x_index] = game.getCharryPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size;
  if(!game.isCharryActivated()) return;
  img.src ='./assets/img/charry.png';
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}

function drawCandy()
{
  const spacing = 0;
  let img = new Image();
  let [y_index, x_index] = game.getCandyPosition();
  let x_padding =x_index * rect_size;
  let y_padding =y_index * rect_size;
  if(!game.isCandyActivated()) return;
  img.src ='./assets/img/candy.png';
  ctx.drawImage(img,x_padding, y_padding,rect_size-spacing,rect_size-spacing);
}