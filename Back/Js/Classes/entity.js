class Entity{
    constructor(occupy){
        this.occupy = occupy;
    }
    getOccupy(){
        return this.occupy;
    }
    convertCell(player){
        return [this.occupy+20];
    }
}