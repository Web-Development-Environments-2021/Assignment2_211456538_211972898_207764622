//const monster_number = 5;
const pacman_live_number = 5;
//const number_of_regular_point_on_board = 80;
const point_score_list = [5,15,25];
const eat_clock_time_added = 20;

class Game{
    constructor(board_matrix,monster_num,timeOfGame,numOfPoints){
        this.score = 0;
        this.time = timeOfGame;
        alert(timeOfGame);
        this.numOfPoints = numOfPoints;
        alert(numOfPoints);
        this.live = pacman_live_number;
        this.charry = new Charry();
        this.pacman = new Pacman();
        this.board_matrix = board_matrix;
        this.monsters = new Array(monster_num);
        this.empty_cell_lst = new Array();
        this.wall_lst = new Array();
        this.portal_lst = new Array();
        this.regular_points = [];
        this.wall_cell_dict = {}
        this.portal_dict = {};
        this.regular_point_dict = {};
        this.heart_position = undefined;
        this.clock_position= undefined;
        this.clock_active = true;
        this.heart_active = true;
        this.a_star = new AStar(board_matrix);
    }

    getScore(){return this.score;}
    getTime(){return this.time;}
    getLive(){return this.live;}
    getIsHeartActive(){return this.heart_active;}
    getIsClockActive(){return this.clock_active;}
    getHeartPosition(){return this.heart_position;}
    getClockPosition(){return this.clock_position;}
    isCharryActivated(){return this.charry.isActive();}
    getCharryPosition(){return this.charry.getPosition();}
    get wall_list() {return this.wall_lst;}
    getPacmanPosition(){return this.pacman.getPosition();}
    getRegularPoints(){return this.regular_points;}
    getMonstersPosition(){
        let monster_position = [];
        this.monsters.forEach(monster=>{
            monster_position.push(monster.getPosition());
        });
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
            this.generateMonsters();
            this.placePacmanInRandomPosition();
            this.placeHeartInRandomPosition();
            this.placeClockInRandomPosition();
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
        let prev_monster_position_dict = {};
        for(let index = 0; index < this.monsters.length; index++){
            monster = new Monster();
            x_position = Math.floor(Math.random()*(x_block[1]-x_block[0])) + x_block[0];
            y_position = Math.floor(Math.random()*(y_block[1]-y_block[0])) + y_block[0];
            while([y_position,x_position] in prev_monster_position_dict){
                x_position = Math.floor(Math.random()*(x_block[1]-x_block[0])) + x_block[0];
                y_position = Math.floor(Math.random()*(y_block[1]-y_block[0])) + y_block[0];
            }
            prev_monster_position_dict[[y_position,x_position]] = true;
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
        for(let index = 0; index < this.numOfPoints; index++){
            score_index = Math.floor(Math.random() * (point_score_list.length));
            random_cell_index = Math.floor(Math.random() * (empty_copy.length)); // rnd point from array
            random_cell_value = [point_score_list[score_index],empty_copy[random_cell_index]];
            this.regular_points[index] = random_cell_value;
            this.regular_point_dict[empty_copy[random_cell_index]] = point_score_list[score_index];
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
        let new_empty = [];
        const [x_block_y,x_block_x] = [8,11];
        const [y_block_y,y_block_x] = [10,13];
        this.empty_cell_lst.forEach(value=>{
            let [y,x] = value;
            if((!(x>= x_block_y && x <= x_block_x) || !(y>= y_block_y && x <= y_block_x))){
                new_empty.push(value);
            }
        });
        let random_empty_lst_index = Math.floor(Math.random()*new_empty.length);
        let [y_position,x_position] = new_empty[random_empty_lst_index];
        this.pacman.setPosition([y_position,x_position]);
    }

    placeHeartInRandomPosition() {
        let tmp_lst = [];
        let [y_pac,x_pac] = this.getPacmanPosition();
        this.empty_cell_lst.forEach(value=>{
            let [y_value,x_value] = value;
            if( (y_pac != y_value || x_pac != x_value)){
                tmp_lst.push(value);
            }
        });
        let random_empty_lst_index = Math.floor(Math.random()*tmp_lst.length);
        let [y_position,x_position] = tmp_lst[random_empty_lst_index];
        //TODO: remove pack man location
        this.heart_position = [y_position,x_position];
    }

    placeClockInRandomPosition() {
        let tmp_lst = [];
        let [y_pac,x_pac] = this.getPacmanPosition();
        let [y_heart,x_heart] = this.getHeartPosition();
        this.empty_cell_lst.forEach(value=>{
            let [y_value,x_value] = value;
            if( (y_pac != y_value || x_pac != x_value) && (y_heart != y_value || x_heart != x_value)){
                tmp_lst.push(value);
            }
        });
        let random_empty_lst_index = Math.floor(Math.random()*tmp_lst.length);
        let [y_position,x_position] = tmp_lst[random_empty_lst_index];
        //TODO: remove pack man location
        this.clock_position = [y_position,x_position];
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

    canMovePacman(direction){
        let prev_position,position;
        let is_wall,out_of_border,is_portal,is_hit_monster;
        let [current_y,current_x] = this.pacman.getPosition();
        let return_value = false;
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
        is_portal = this.afterCheckPortal(prev_position,position,this.pacman);
        is_wall = this.checkIsWall(position);
        out_of_border = this.checkIfOutOfBoard(position);
        return_value = !is_portal && !is_wall && !out_of_border;
        return return_value;
    }

    moveCharry(){
        if(!this.charry.isActive()) return;
        let prev_charry_position,charry_position;
        prev_charry_position = this.charry.getPosition();
        charry_position = this.charry.getRadomMove(this.wall_cell_dict);
        if(charry_position != undefined){
                this.charry.setPosition(charry_position);
        }
        this.afterCheckPortal(prev_charry_position,charry_position,this.charry);
        let [y1,x1] = this.pacman.getPosition();
        let [y2,x2] = this.charry.getPosition();
        if(y1===y2 && x1===x2){this.charry.disActive();}
    }

    movePacman(direction){
        let prev_position,position;
        let is_hit_monster;
        let [current_y,current_x] = this.pacman.getPosition();
        let [heart_y,heart_x] = this.heart_position;
        let [clock_y,clock_x] = this.clock_position;
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
            this.generateMonsters();
            this.placePacmanInRandomPosition();
        }
        else{
            this.onEatRegularPoint(prev_position,position);
            this.pacman.setPosition([current_y,current_x]);
            this.checkIfEatBonus(position,prev_position);
            if(this.heart_active && heart_x === current_x && heart_y === current_y){
                this.live++;
                this.heart_active = false;
            }
            if(this.clock_active && clock_x === current_x && clock_y === current_y){
                this.time += eat_clock_time_added;
                this.clock_active = false;
            }
        }
    }

    afterCheckPortal(prev_position,position,character){
        let value = false;
        if(prev_position in this.portal_dict && this.checkIfOutOfBoard(position)){
            character.setPosition(this.portal_dict[prev_position]);
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

    onEatRegularPoint(prev_position,position){
        let remove_index;
        if(position in this.regular_point_dict){
            remove_index = this.regular_point_dict[position];
            this.regular_points = this.regular_points.filter((value, index, arr)=>{ 
                let point_position = value[1];
                return point_position[0] !== position[0] || point_position[1] !== position[1];
            });
            this.score += this.regular_point_dict[position];
            delete this.regular_point_dict[position];
        }
        else if (prev_position in this.regular_point_dict){
            remove_index = this.regular_point_dict[prev_position];
            this.regular_points = this.regular_points.filter((value, index, arr)=>{ 
                let point_position = value[1];
                return point_position[0] !== prev_position[0] || point_position[1] !== prev_position[1];
            });
            this.score += this.regular_point_dict[position];
            delete this.regular_point_dict[prev_position];
        }
    }

    checkIfEatBonus(position,prev_position){
        let [y_pac,x_pac] = position;
        let [y_prev_pac,x_prev_pac] = prev_position;
        let [y_charry,x_charry] = this.charry.getPosition();
        let has_hit_position = (y_pac == y_charry && x_pac == x_charry);
        let has_hit_prev_position = (y_prev_pac == y_charry && x_prev_pac == x_charry);
        if(this.charry.isActive() && (has_hit_prev_position || has_hit_position)){
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
            let [tmp_y,tmp_x] = monster_position;
            let [pac_y,pac_x] = pac_position;
            if(this.board_matrix[tmp_y][tmp_x] != 1 && tmp_distance <= best_distance){
                best_distance = tmp_distance;
                best_position = monster_position;
            }
        });
        return best_position;

    }

    moveMonsters(prev_pac_position){
        let monster_pos;
        this.monsters.forEach(monster=>{
            if(monster.path.length == 0){
                monster_pos = monster.getPosition();
                monster.path = this.a_star.findPath(monster_pos,prev_pac_position);
            }
            let x = monster.path[0];
            monster.path.splice(0,1);
            monster.setPosition(x);
        });
    }

}
