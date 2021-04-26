class Node{
    constructor(position,g,h){
        this.position = position
        this.g = g;
        this.h = h;
        this.f = this.h + this.g;
    }

    compare(other){
        let [y1,x1] = this.position;
        let [y2,x2] = other.position;
        if(y1 === y2 && x1 == x2) return 0;
        else if(this.f > other.f) return 1;
        else return -1;
    }
}