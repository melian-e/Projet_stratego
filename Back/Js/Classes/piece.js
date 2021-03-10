class Piece extends Entity {
    constructor(power, owner, x, y){
        super(1);
        this.power = power;
        this.owner = owner;
        this.coordinates = new Coordinates(x,y);
        this.visible = false;
    }
    getPower(){
        return this.power;
    }
    getOwner(){
        return this.owner;
    }
    getCoord(){
        return this.coordinates;
    }
    move(x, y){
        if(this.power > 0){
            this.coordinates = new Coordinates(x,y);
        }
    }
    getVisible(){
        return this.visible;
    }
}