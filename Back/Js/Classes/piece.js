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
    convertCell(player){
            //return [15, 2] Pièce caché de l'adversaire
        return (this.owner != player && this.visible == false)? [15,2]:
        [this.power, (player == this.owner) ? 1 : 2];
    }
}