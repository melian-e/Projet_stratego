class GameGrid {
    constructor(){
        this.grid = Array(10);
        for (let i =0; i< 10; i++){
            this.grid[i] = Array(10);
            for(let j = 0; j < 10; j++) {
                this.grid[i][j] = new Entity(0);
            }
        }
    
        for(let x = 4; x < 6; x++){
            for(let y = 2; y < 4; y++){
                this.grid[x][y] = new Entity(2);
                this.grid[x][y+4] = new Entity(2);
            }
        }
    }
    superpose(table, player){
        for(let x = 0; x < 10; x++){
            for(let y = 0; y < 10; y++){
                if(table[x][y] != 30){    // occupe par une pièce
                    this.grid[x][y] = new Piece(table[x][y], player,x,y);
                }
            }
        }
    }
    getBox(x, y){
        return this.grid[x][y];
    }
    move(piece, x, y){  
        this.grid[piece.getCoord().x][piece.getCoord().y] = new Entity(0);
        this.grid[x][y] = piece;
        piece.move(x,y);
    }
    isAttack(currentPlayer,x,y){
        return (this.grid[x][y].getOccupy() == 1 && 
        this.grid[x][y].getOwner() != currentPlayer) ? true : false;
    }
    isObstacleOnTheWay(start, end){
        let obstacle = false;
        let smaller = ( start.x <= end.x && start.y <= end.y) ? start : end;
        let taller = (smaller == start) ? end : start;
    
        let x = (smaller.x == taller.x) ? smaller.x : smaller.x+1 ;
    
        while(x < taller.x+1 && obstacle != true){
            let y = (smaller.y == taller.y) ? smaller.y : smaller.y+1;
            while(y < taller.y+1 && obstacle != true){
                if(x == taller.x && y == taller.y){
                    if(this.grid[x][y].occupy == 2) obstacle = true;
                }
                else{
                    if(this.grid[x][y].occupy != 0) obstacle = true;
                }
                y++;
            }
            x++;
        }
    
        return obstacle;
    }
    allPiecesOnGrid(){
        let entity = [];

        for (let i = 0; i < this.grid.length; i++){
            entity = entity.concat(this.grid[i].filter(elem => elem.occupy == 1));
        }

        return entity;
    }
    remove(piece){
        this.grid[piece.getCoord().x][piece.getCoord().y] = new Entity(0);
    }
}