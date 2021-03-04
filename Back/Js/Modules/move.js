let move = (function(){
    function isMovable(piece){  // Vérifie que la pièce n'est pas un drapeau ou une bombe
        return (piece.getPower() < 1) ? false : true;
    }
    function isMovement(piece, x, y){   // Vérifie que la position de la pièce est différente de la nouvelle position
        return (piece.getCoord().x == x && piece.getCoord().y == y) ? false : true;
    }
    function isMyPiece(game, piece){    // Vérifie que la pièce que l'on veut bouger est bien la sienne
        return (piece.getProprety() != game.getCurrentPlayer()) ? false : true; // vérifier la val de piece.proprety
    }
    function isAuthorizedMove(boxEntity, currentPlayer){    // Vérifie que la case de destination est libre ou occupé par l'ennemi
        return (boxEntity.getOccupe() == 2 || 
        (boxEntity.getOccupe() == 1 && boxEntity.getProprety() == currentPlayer)) ? false : true;
    }
    function isAlternation(game, piece, destinationCoord){  // Vérifie l'alternance entre 2 cases
        let historyMove = game.getHistoryMove(game.getCurrentPlayer());
        let currentBox = historyMove.filter(elem => (elem[0] == piece.getPower() && elem[1] == piece.getCoord()));
        let destinationBox = historyMove.filter(elem => (elem[0] == piece.getPower() && elem[1] == destinationCoord));

        return (currentBox.length == 3 && destinationBox.length == 3) ? true : false;
    }
    function scoutMove(game, piece, x, y){
        let canMove = false;
        if(piece.getCoord().x == x || piece.getCoord().y == y){  
            if( !game.isObstacleOnTheWay(piece.getCoord(), new Coordonnees(x,y))){
                canMove = true;
            }
            if((game.scoutRule == true && 
                Math.abs(piece.getCoord().x-x)+Math(abs(piece.getCoord().y-y) != 1) && 
                game.getBox(x, y).getOccupe() != 0)){
                    canMove = false;
            }
        }
        return canMove;
    }
    function pieceMove(piece){
        return (Math.abs(piece.getCoord().x-x)+Math(abs(piece.getCoord().y-y) == 1)) ? true : false;
    }
    return {
        eventMove(game, piece, x, y){
            
            if(isMovable(piece) && isMovement(piece, x, y) && isMyPiece(game, piece) && 
            isAuthorizedMove(game.getBox(x, y), game.getCurrentPlayer()) && 
            !isAlternation(game, piece, new Coordonnees(x,y))){

                let canMove = (piece.getPower() == 2) ? scoutMove(game, piece, x, y) : pieceMove(piece, x, y);

                if(canMove){
                    game.addMove(piece, new Coordonnees(x,y));
                    piece.move(x,y);
                    game.play();
                }
            }
        }
    }
})();