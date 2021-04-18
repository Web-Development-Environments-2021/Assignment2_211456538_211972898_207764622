
class Game{
    constructor(board_matrix,monster_number = 5){
        this.pacman = new Pacman();
        this.board_matrix = board_matrix;
        this.monsters = new Array(monster_number);
        this.empty_cell_lst = new Array();
        this.wall_lst = new Array();
        this.portal_lst = new Array();
        this.empty_cell_dict = {}
        this.portal_dict = {};
    }

    get wall_list() {return this.wall_lst;}
    getPacmanPosition(){return this.pacman.getPosition();}

    start(){
        //Todo: add start game function
        this.generateEmptyCellList();
        this.createPortals();
        this.createWallList();
        this.placePacmanInRandomPosition();
    }

    end(){
        //Todo: What do to when game is over
    }

    createWallList(){
        let is_wall;
        let position;
        for (let y_index=0; y_index < this.board_matrix.length;y_index++){
            for(let x_index=0; x_index < this.board_matrix[x_index].length; x_index++){
                is_wall = this.board_matrix[y_index][x_index];
                position = [y_index,x_index];
                if(is_wall === 1){
                    this.wall_lst.push(position);
                    this.empty_cell_dict[position] = true;
                }
            }
        }
    }
    
    placePacmanInRandomPosition(){
        let random_empty_lst_index = Math.floor(Math.random()*this.empty_cell_lst.length);
        let [y_position,x_position] = this.empty_cell_lst[random_empty_lst_index];
        this.pacman.setPosition([y_position,x_position]);
    }

    createPortals(){
        let cell_value,position;
        let portal_lst = new Array();
        for (let y_index=0; y_index < this.board_matrix.length;y_index++){
            for(let x_index=0; x_index < this.board_matrix[x_index].length; x_index++){
                cell_value =  this.board_matrix[y_index][x_index];
                position = [y_index, x_index];
                if(cell_value === 2){
                    portal_lst.push(position);
                }
            }
        }
        this.portal_dict[portal_lst[0]] = portal_lst[1];
        this.portal_dict[portal_lst[1]] = portal_lst[0];
    }

    generateEmptyCellList(){
        let cell_value;
        let position;
        for (let y_index=0; y_index < this.board_matrix.length;y_index++){
            for(let x_index=0; x_index < this.board_matrix[x_index].length; x_index++){
                cell_value =  this.board_matrix[y_index][x_index];
                position = [y_index, x_index];
                if(cell_value === 0 || cell_value === 2){
                    this.empty_cell_lst.push(position);
                }
            }
        }
    }

    movePacMan(direction){
        let prev_position,position;
        let is_wall,out_of_border,is_portal;
        let [current_y,current_x] = this.pacman.getPosition();
        prev_position = [current_y,current_x];
        switch(direction){
            case 'up': current_y--;
                break;
            case 'down': current_y++;
                break;
            case 'left': current_x--;
                break;
            case 'right': current_x++;
                break;
            default: 
                break;
        }
        position = [current_y, current_x];
        is_portal = this.afterCheckPortal(prev_position,position);
        is_wall = this.checkIsWall(position);
        out_of_border = this.checkIfOutOfBoard(position);
        this.checkIfEatBonus();
        this.checkIfHitMonster();
        if(!is_portal && !is_wall && !out_of_border){
            this.pacman.setPosition([current_y,current_x]);
        }
    }

    afterCheckPortal(prev_position,position){
        let value = false;
        if(prev_position in this.portal_dict && this.checkIfOutOfBoard(position)){
            this.pacman.setPosition(this.portal_dict[prev_position]);
            value = true;
        }
        return value;
    }

    checkIsWall(position){
        let value = false;
        if(position in this.empty_cell_dict){value = true;}
        return value;
    }

    checkIfOutOfBoard(position){
        let [y_index,x_index] = position;
        return ( y_index < 0 || y_index >= this.board_matrix.length || x_index < 0 || x_index >= this.board_matrix[y_index].length);
    }

    checkIfEatBonus(){
        //Todo: add on eat boundos action
    }

    checkIfHitMonster(){
        //Todo: add on hit monster (with super and regular)
    }

}