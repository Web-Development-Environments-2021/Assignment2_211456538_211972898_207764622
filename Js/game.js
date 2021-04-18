let ctx;
let shape = new Object();
let board;
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
  [0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0],
  [0,0,0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,0,0],
  [1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1],
  [0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
  [1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,1,1,1,1],
  [0,0,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,0,0],
  [0,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0],
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
    // ctx.fillStyle = 'blue';
    // ctx.beginPath();
    // ctx.roundedRectangle(0, 0, 100, 100, 20);
    // ctx.stroke();
    // ctx.beginPath();  
    // ctx.roundedRectangle(5, 5, 90, 90, 15);
    // ctx.fill();  

    // console.log(ctx);
  // drawBord(ctx,canvas.width,canvas.height);

  /* calc the rect size */
  let rect_width = width / x_axis_size;
  let rect_height = height / y_axis_size;
  canvas.width = width;
  canvas.height = height;
  drawFromWallBoard(ctx,wall_matrix,Math.min(rect_width,rect_height));
  drawCharacters(ctx);
	Start();
});

function drawFromWallBoard(ctx,board,rect_size){
  ctx.strokeStyle = border_color_hex;// set draw color
  ctx.lineWidth = 2;
  let x_padding;
  let y_padding;
  const spacing = 0;
  ctx.beginPath();
  for (let y_index=0; y_index < y_axis_size;y_index++){
    for(let x_index=0; x_index < x_axis_size; x_index++){
      let should_draw = board[y_index][x_index];
      if(should_draw == 1){
        x_padding = rect_size*x_index;
        y_padding = rect_size*y_index;
        ctx.rect(x_padding, y_padding,rect_size-spacing,rect_size-spacing);
      }
    }
  }
  ctx.stroke();
}

function drawCharacters(ctx){
  let player_img = new Image();
  player_img.src = "https://i.gifer.com/1iIH.gif";
  ctx.drawImage(player_img,0,0);
}

function drawBord(ctx,canvas_width,canvas_height){
    /*  Draw the boar by canvas size*/
    ctx.strokeStyle = border_color_hex;
    ctx.beginPath();
    ctx.roundedRectangle(0,0,canvas_width,canvas_height,5);
    ctx.stroke();

    ctx.beginPath();
    ctx.roundedRectangle(5,5,canvas_width-10,canvas_height-10,5);
    ctx.stroke();

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

