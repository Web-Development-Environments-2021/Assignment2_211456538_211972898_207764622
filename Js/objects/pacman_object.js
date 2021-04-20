const start_position = [0,0]
class Pacman{
    constructor(){
        this.state = 'regular';
        this.position = start_position;
    }

    getPosition(){return this.position;}
    getState(){return this.state;}

    setPosition(new_position){this.position = new_position;}

    changeToSuper(){this.state = 'super';}
    changeToRegular(){this.state = 'regular';}
}