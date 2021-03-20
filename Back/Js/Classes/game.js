const GameGrid = require('./gamegrid.js');
const Person = require('./person.js');

class Game extends GameGrid {
    constructor(player1, player2, revealedRule, scoutRule,bombRule){
        super();
        let color1 = (Math.floor(Math.random() * Math.floor(2)) == 1) ? 'blue' : 'red' ;
        let color2 = (color1 == 'blue') ? 'red' : 'blue';
        this.player1 = new Person(player1, color1);
        this.player2 = new Person(player2, color2);
        this.currentPlayer = (this.player1.color == 'blue') ? 0 : 1; 
        this.numStrokes = 0;
        this.startTime = Date.now();
        this.revealedRule = revealedRule;// true si les pièces restent révélé après une attaque
        this.scoutRule = scoutRule;     // true si l'éclaireur peut se déplacer et attaquer dans un seul tour
        this.bombRule = bombRule;       // true si la bombe ne peut faire qu'une seule victime avant de s'auto détruire
    }
    getCurrentPlayer(){
        return this.currentPlayer;
    }
    getCurrentPlayerName(){
        return (this.currentPlayer == 0) ? this.player1 : this.player2;
    }
    play(){
        this.currentPlayer = (this.currentPlayer + 1)%2;
        if(this.getCurrentPlayerName().color == 'blue') this.numStrokes++;
    }
    getPlayers(){
        return [this.player1.id, this.player2.id];
    }
    isFinished(){
        let allPieces = this.allPiecesOnGrid();
            
        let red = allPieces.filter(elem => elem.owner == this.player1.id);
        let blue = allPieces.filter(elem => elem.owner == this.player2.id);

        return (!red.some(elem => elem.power == 0) || !blue.some(elem => elem.power == 0) || 
        red.every(elem => elem.power < 1) || blue.every(elem => elem.power < 1)) ? true : false;
    }
    getWinner(){
        let allPieces = this.allPiecesOnGrid();
            
        let red = allPieces.filter(elem => elem.owner == this.player1.id);
        let blue = allPieces.filter(elem => elem.owner == this.player2.id);
    
        let flagR = red.some(elem => elem.power == 0);
        let flagB = blue.some(elem => elem.power == 0);
    
        let movableR = red.every(elem => elem.power < 1);
        let movableB = blue.every(elem => elem.power < 1);
    
        if(movableB == true || flagB == false){
            return (movableR == true || flagR == false) ? undefined : this.player1.id;
        }
    
        if(movableR == true || flagR == false) return this.player2.id;
    }
    getHistoryMove(player){
        return (player == this.player1.id) ? this.player1.historyMove : this.player2.historyMove;
    }
}

module.exports = Game;