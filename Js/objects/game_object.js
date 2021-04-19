const monster_number = 5;
const pacman_live_number = 5;
const number_of_regular_point_on_board = 80;
const point_score_list = [5];
class Game{
    constructor(board_matrix){
        this.score = monster_number;
        this.live = pacman_live_number;
        this.charry = new Charry();
        this.pacman = new Pacman();
        this.board_matrix = board_matrix;
        this.monsters = new Array(monster_number);
        this.empty_cell_lst = new Array();
        this.wall_lst = new Array();
        this.portal_lst = new Array();
        this.regular_points = [];
        this.wall_cell_dict = {}
        this.portal_dict = {};
        this.regular_point_dict = {};
    }

    isCharryActivated(){return this.charry.isActive();}
    getCharryPosition(){return this.charry.getPosition();}
    get wall_list() {return this.wall_lst;}
    getPacmanPosition(){return this.pacman.getPosition();}
    getRegularPoints(){return this.regular_points;}
    getMonstersPosition(){
        let monster_position = [];
        this.monsters.forEach(monster=>{
            monster_position.push(monster.getPosition());
        })
        return monster_position;
    }

    start(){
        //Todo: add start game function
        if(this.live <= 0 ){this.end()}
        else{
            this.generateEmptyCellList();
            this.generateRegulatorPoints();
            this.createPortals();
            this.createWallList();
            this.charry.activate(this.empty_cell_lst);
            // this.generateMonsters();
            this.placePacmanInRandomPosition();
        }

    }

    end(){
        //Todo: What do to when game is over
        console.log('END GAME');
    }


    generateMonsters(){
        let monster,
            x_position,
            y_position;
        const x_block = [8,11];
        const y_block = [10,13];
        for(let index = 0; index < this.monsters.length; index++){
            monster = new Monster();
            x_position = Math.floor(Math.random()*(x_block[1]-x_block[0])) + x_block[0];
            y_position = Math.floor(Math.random()*(y_block[1]-y_block[0])) + y_block[0];
            monster.setPosition([y_position,x_position]);
            this.monsters[index] = monster;
        }
    }

    generateRegulatorPoints(){
        //TODO: fix shit
        let empty_copy =[];
        let random_cell_index, random_cell_value;
        let score_index;
        /* clone list */
        this.empty_cell_lst.forEach((position)=>{empty_copy.push(position);});
        /* set */
        for(let index = 0; index < number_of_regular_point_on_board; index++){
            score_index = Math.floor(Math.random() * (point_score_list.length));
            random_cell_index = Math.floor(Math.random() * (empty_copy.length)); // rnd point from array
            random_cell_value = [point_score_list[score_index],empty_copy[random_cell_index]];
            this.regular_points[index] = random_cell_value;
            this.regular_point_dict[empty_copy[random_cell_index]] = index;
            this.empty_copy = empty_copy.filter((value, index, arr)=>{ return value !=[score];});
        }
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
                    this.wall_cell_dict[position] = true;
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
        let is_wall,out_of_border,is_portal,is_hit_monster;
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
        is_hit_monster = this.checkIfHitMonster(position);
        if(is_hit_monster){
            this.live--;
            this.score -= 10;
            this.start();
        }
        else{
            is_portal = this.afterCheckPortal(prev_position,position);
            is_wall = this.checkIsWall(position);
            out_of_border = this.checkIfOutOfBoard(position);
            this.onEatRegularPoint(position);
            this.checkIfEatBonus(position);
            if(!is_portal && !is_wall && !out_of_border){
                this.pacman.setPosition([current_y,current_x]);
            }
            this.moveMonsters(position);
            this.charry.moveRandomly(this.wall_cell_dict);
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
        if(position in this.wall_cell_dict){value = true;}
        return value;
    }

    checkIfOutOfBoard(position){
        let [y_index,x_index] = position;
        return ( y_index < 0 || y_index >= this.board_matrix.length || x_index < 0 || x_index >= this.board_matrix[y_index].length);
    }

    onEatRegularPoint(position){
        let remove_index;
        if(position in this.regular_point_dict){
            remove_index = this.regular_point_dict[position];
            this.regular_points = this.regular_points.filter((value, index, arr)=>{ return index !== remove_index;});
            delete this.regular_point_dict[position];
        }
    }

    checkIfEatBonus(position){
        let [y_pac,x_pac] = position;
        let [y_charry,x_charry] = this.charry.getPosition();
        if(this.charry.isActive() && y_pac == y_charry && x_pac == x_charry){
            this.score += 50;
            this.charry.disActive();
        }
    }

    checkIfHitMonster(position){
        let has_hit_monster = false;
        let [y_pac,x_pac] = position;
        this.monsters.forEach(monster => {
            let [y_monster,x_monster] = monster.getPosition();
            if( y_monster === y_pac && x_monster === x_pac ){
                has_hit_monster = true;
            }
        });
        return has_hit_monster;
    }

     getAirDistance(position1,position2){
        let [y1,x1] = position1;
        let [y2,x2] = position2;
        let distance = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
        return distance;
    }

    getBestMonsterPosition(pac_position,monster_position_lst){ 
        let tmp_distance,best_position;
        let best_distance = Math.pow(this.board_matrix.length,2);
        monster_position_lst.forEach(monster_position=>{
            tmp_distance = this.getAirDistance(pac_position,monster_position);
            if(tmp_distance <= best_distance){
                best_distance = tmp_distance;
                best_position = monster_position;
            }
        });
        return best_position;

    }

    moveMonsters(prev_pac_position){
        let all_movement;
        let best_move;
        let available_movement = [];
        let pos_lst = [];
        this.monsters.forEach(monster=>{
            let [y_pos,x_pos] = monster.getPosition();
            all_movement = [ 
                [y_pos+1,x_pos],
                [y_pos-1,x_pos],
                [y_pos,x_pos+1],
                [y_pos,x_pos+1],
            ];
            /* Add all available movement */
            all_movement.forEach(movement=>{
                if(movement in this.wall_cell_dict){
                    available_movement.push(movement);
                }
            });
            /* get the best position */
            best_move = this.getBestMonsterPosition(prev_pac_position,available_movement);
            // monster.setPosition(best_move);
            pos_lst.push(best_move);
        });
        // console.log(pos_lst);
        // for(let index =0;index< this.monsters.length;index++){
        //     this.monsters[index].setPosition(pos_lst[index]);
        // }
    }

}