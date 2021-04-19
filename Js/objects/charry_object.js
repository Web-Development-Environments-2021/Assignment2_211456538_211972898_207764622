class Charry{
    constructor(){
        this.position = start_position;
        this.is_active = false;
    }

    getPosition(){return this.position;}
    disActive(){this.is_active = false;}
    isActive(){return this.is_active;}
    activate(empty_lst){
        let random_index = Math.floor(Math.random()*empty_lst.length);
        this.is_active = true;
        this.position = empty_lst[random_index];
    }


    moveRandomly(wall_cell_dict){
        let random_index;
        let option_lst = [];
        let [y_index,x_index] = this.position;
        let movement_lst=[
            [y_index,x_index+1],
            [y_index,x_index-1],
            [y_index+1,x_index],
            [y_index-1,x_index],
        ];
        movement_lst.forEach(position =>{
            if(!(position in wall_cell_dict)){option_lst.push(position);}
        });
        if(option_lst.length <= 0)return;
        random_index = Math.floor(Math.random() * option_lst.length);
        this.position = option_lst[random_index];
    }
}