const start_position = [0,0]
class Pacman{
    constructor(img_path){
        this.state = 'regular';
        this.img_path = img_path;
        this.position = start_position;
    }

    getImgPath(){return this.img_path;}
    getPosition(){return this.position;}
    getState(){return this.state;}

    setPosition(new_position){this.position = new_position;}

    changeToSuper(){this.state = 'super';}
    changeToRegular(){this.state = 'regular';}
}