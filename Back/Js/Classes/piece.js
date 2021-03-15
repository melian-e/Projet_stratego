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
    convertCell(player, color, player2){
        let otherColor = (color == 'blue') ? 'red' : 'blue';
        //return [15,..] Pièce caché de l'adversaire
        return (player == 'spectator') ? this.spectatorConvert(player2, color, otherColor) 
        : this.playerConvert(player, color, otherColor);
    }
    playerConvert(player, color, otherColor){
        return (this.owner != player && this.visible == false)? [15, otherColor]:
        [this.power, (player == this.owner) ? color : otherColor];
    }
    spectatorConvert(player2, color, otherColor){
        return [(this.visible == false) ? 15 : this.power, (this.owner == player2) ? 
            color : otherColor];
    }
}