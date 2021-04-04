class Person {
    constructor(id, color){
        this.id = id;
        this.color = color;
        this.historyMove = [];
    }
    addMove(piece, coord){
        
        if(this.historyMove.length == 0) this.historyMove.push([piece.getPower(), piece.getCoord()]);

        this.historyMove.push([piece.getPower(), coord]);

        if(this.historyMove.length > 6) this.historyMove.shift();
    }
}

module.exports = Person;