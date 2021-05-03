class Candy{
    constructor(){
        this.position = start_position;
        this.is_active = false;
        this.doneForGame = false;
    }

    getPosition(){return this.position;}
    setPosition(new_position){this.position = new_position;}
    changeActive(ac) { this.is_active = ac}
    isActive(){return this.is_active;}
    activate(empty_lst){
        let random_index = Math.floor(Math.random()*empty_lst.length);
        this.is_active = true;
        this.position = empty_lst[random_index];
    }
    done(){this.doneForGame = true; this.is_active=false}
    getDone(){return this.doneForGame}

    getRandomPos(empty_cell_lst){
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
        return [y_position,x_position]
    }
}