// const start_position = [0,0]
class Monster{
    constructor(){
        this.state = 'regular';
        this.position = start_position;
        this.path = [];
    }
    
    getPosition(){return this.position;}
    getState(){return this.state;}

    setPosition(new_position){this.position = new_position;}    

    changeToEatable(){this.state = 'eatable';}
    changeToRegular(){this.state = 'regular';}

   

}