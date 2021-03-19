const GameGrid = require('./gamegrid.js');

class Game extends GameGrid {
    constructor(player1, player2, revealedRule, scoutRule,bombRule){
        super();
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = 0;
        this.numStrokes = 0;
        this.startTime = Date.now();
        this.historyMove = [[],[]];
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
        if(this.currentPlayer == 0) this.numStrokes++;
    }
    getPlayers(){
        return [this.player1, this.player2];
    }
    isFinished(){
        let allPieces = this.allPiecesOnGrid();
            
        let red = allPieces.filter(elem => elem.owner == this.player1);
        let blue = allPieces.filter(elem => elem.owner == this.player2);

        return (!red.some(elem => elem.power == 0) || !blue.some(elem => elem.power == 0) || 
        red.every(elem => elem.power < 1) || blue.every(elem => elem.power < 1)) ? true : false;
    }
    getWinner(){
        let allPieces = this.allPiecesOnGrid();
            
        let red = allPieces.filter(elem => elem.owner == this.player1);
        let blue = allPieces.filter(elem => elem.owner == this.player2);
    
        let flagR = red.some(elem => elem.power == 0);
        let flagB = blue.some(elem => elem.power == 0);
    
        let movableR = red.every(elem => elem.power < 1);
        let movableB = blue.every(elem => elem.power < 1);
    
        if(movableB == true || flagB == false){
            return (movableR == true || flagR == false) ? undefined : this.player1;
        }
    
        if(movableR == true || flagR == false) return this.player2;
    }
    getHistoryMove(player){
        return this.historyMove[player];
    }
    addMove(piece, coord){
        let player = this.getCurrentPlayer();
        
        if(this.historyMove[player].length == 0){
            this.historyMove[player].push([piece.getPower(), piece.getCoord()]);
        }

        this.historyMove[player].push([piece.getPower(), coord]);

        if(this.historyMove[player].length > 6){
            this.historyMove[player].shift();
        }
    }
}

module.exports = Game;