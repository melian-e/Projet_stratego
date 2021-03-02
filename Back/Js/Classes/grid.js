class GameGrid {
    constructor(){
        this.grid = Array(10);
        for (let i =0; i< 10; i++){
            grid[i] = Array(10);
        }
    }
    getBox(x, y){
        return this.grid[x][y];
    }
    move(piece, x, y){  // A appeler avant de modifier les coordonnées de la pièce
        this.grid[piece.getCoord().x][piece.getCoord().y] = new Entite(0);
        this.grid[x][y] = piece;
    }
    isObstacleOnTheWay(start, end){
        let obstacle = false;
        let smaller = ( start.x <= end.x && start.y <= end.y) ? start : end;
        let taller = (smaller == start) ? end : start;
    
        let x = smaller.x+1;
    
        while(x < taller.x+1 && obstacle != true){
            let y = smaller.y+1
            while(y < taller.y+1 && obstacle != true){
                if(x == taller.x && y == taller.y){
                    if(this.grid.getBox(x, y).occupe == 2) obstacle = true;
                }
                else{
                    if(this.grid.getBox(x, y).occupe != 0) obstacle = true;
                }
                y++;
            }
            x++;
        }
    
        return obstacle;
    }
    allPiecesOnGrid(){
        let entite = [];
    
        for (let i = 0; i < this.grid.length(); i++){
            entite = entite.concat(this.grid[i].filter(elem => elem.occupe == 1));
        }

        return entite;
    }
    remove(piece){
        grid[piece.getCoord().x][piece.getCoord().y] = new Entite(0);
    }
}