class coordonnees{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let move = function(game, piece, x, y){
    if(piece.getCoord().x == x && piece.getCoord().y == y){ // C'est la position actuelle
        return;
    }
    
    if( piece.getProprety() != game.getCurrentPlayer()){ // La pièce déplacé n'ets pas celle du joureur
        return;
    }

    if(game.getCase(x, y).getOccupe() == 2 || (game.getCase(x, y).getOccupe() == 1 && game.getCase(x, y).getProprety() == game.getCurrentPlayer())){ // Déplacement sur un endroit interdit
        return;
    }

    let num = length(game.getHistoryMove(game.getCurrentPlayer()).filter(element => element == piece.getCoord()));

    if(num == 2 && game.getHistoryMove(game.getCurrentPlayer())[1] == coordonnees(x,y)){ // Alternance sur 3 tours
        return;
    }

    if(piece.getPower() == 1){
        if(piece.getCoord().x == x || piece.getCoord().y == y){  
            if( isLacSurChemin(game.grid, piece.getCoord(), coordonnees(x,y))) return;  // Vérification si le lac est sur le chemin
            piece.move(x,y);
            game.addMove(coordonnees(x,y));
        }
    }

    else if(piece.getPower() > 1){
        if(Math.abs(piece.getX()-x)+Math(abs(piece.getY()-y) == 1)){
            piece.move(x,y);
        }
    }
}

let isLacSurChemin = function(grid, start, end){
    lac == false;
    plusPetit = ( start.x <= end.x && start.y <= end.y) ? start : end;
    plusGrand = (plusPetit == start) ? end : start;

    x = plusPetit.x;

    while(x < plusGrand.x+1 && lac != true){
        y = plusPetit.y
        while(y < plusGrand.y+1 && lac != true){
            if(grid.getCase(x, y).getOccupe()== 2) lac = true;
            y++
        }
        x++;
    }

    return lac;
}

let winnerAttack = function(attaquant, attaque){
    
    if(attaquant.getPower() == attaque.getPower()){ // pièces égales
        return undefined;
    }

    if(attaquant.getPower() == 1 && attaque.getPower() == 10){ // espion attaque un maréchal
        return attaquant;
    }

    if(attaque.getPower() == -1){       // attaque de bombe
        return (attaquant.getPower() == 3)? attaquant : undefined;
    }

    return (attaquant.getPower() > attaque.getPower()) ? attaquant : attaque;
}

let attack = function(game, attaquant, attaque){
    winner = winnerAttack(attaquant, attaque);
    attackAnimation(attaquant, attaque, winner);
    if(winner == undefined){
        game.gridRemove(attaque);
        game.gridRemove(attaquant);
    }
    else if(winner == attaquant) game.gridRemove(attaque);
    else game.gridRemove(attaquant);

}

let isFinished = function(game){
    
    let entite = [];

    for (let i = 0; i < game.grid.length(); i++){
        entite = entite.concat(game.grid[i].filter(elem => elem.occupe == 1));
        
        let red = entite.filter(elem => elem.proprety == game.player1);
        let blue = entite.filter(elem => elem.proprety == game.player2);

        return (!red.some(elem => elem.power == 0) || !blue.some(elem => elem.power == 0) || 
        red.every(elem => elem.power < 1) || red.every(elem => elem.power < 1)) ? true : false;
    }
}

let getWinner = function(game){
    entite = entite.concat(game.grid[i].filter(elem => elem.occupe == 1));
        
    let red = entite.filter(elem => elem.proprety == game.player1);
    let blue = entite.filter(elem => elem.proprety == game.player2);

    let flagR = red.some(elem => elem.power == 0);
    let flagB = blue.some(elem => elem.power == 0);

    let movableR = red.every(elem => elem.power < 1);
    let movableB = blue.every(elem => elem.power < 1);

    if(movableB == true || flagB == false){
        return (movableR == true || flagR == false) ? undefined : game.player1;
    }

    if(movableR == true || flagR == false) return game.player2;
}