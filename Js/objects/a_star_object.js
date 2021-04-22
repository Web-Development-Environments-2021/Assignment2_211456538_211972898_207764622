function getNeighbor(board,position){
    let [y,x] = position;
    let neighbor  =[
        [y+1,x],
        [y-1,x],
        [y,x+1],
        [y,x-1],
    ]
    let lst = []
    neighbor.forEach(([n_y,n_x])=>{
        if( n_y >=0 && n_y < board.length && x>=0 && x < board[y].length){
            if( board[n_y][n_x] !== 1){
                lst.push([n_y,n_x]);
            }
        } 
    });
    return lst;
}


function h(current,to){
    let [cur_y,cur_x] = current;
    let [to_y,to_x] = to;
    return Math.sqrt(Math.pow(to_y-cur_y,2) + Math.pow(to_x-cur_x,2));
}

// function AStar(start, goal)
//     let open = {};
//     let close = {};
//     open[start] = 0;
//     while(open.length != 0){
//         let current_node = 
//     }
//     return failure
