class Entity{
    constructor(occupy){
        this.occupy = occupy;
    }
    getOccupy(){
        return this.occupy;
    }
    convertCell(player, color, player2){
        return [this.occupy+20];
    }
}