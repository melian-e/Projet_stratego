let Coordinates = require('../Classes/coordinates.js');

module.exports = (function(){
        function isMovable(piece){  // Vérifie que la pièce n'est pas un drapeau ou une bombe
            return (piece.getPower() < 1) ? false : true;
        }
        function isMovement(piece, x, y){   // Vérifie que la position de la pièce est différente de la nouvelle position
            return (piece.getCoord() == new Coordinates(x,y)) ? false : true;
        }
        function isMyPiece(game, piece){    // Vérifie que la pièce que l'on veut bouger est bien la sienne
            return (piece.getOwner() != game.getCurrentPlayerName()) ? false : true; // vérifier la val de piece.owner
        }
        function isAuthorizedMove(boxEntity, currentPlayer){    // Vérifie que la case de destination est libre ou occupé par l'ennemi
            return (boxEntity.getOccupy() == 2 || 
            (boxEntity.getOccupy() == 1 && boxEntity.getOwner() == currentPlayer)) ? false : true;
        }
        function isAlternation(game, piece, destinationCoord){  // Vérifie l'alternance entre 2 cases
            let historyMove = game.getHistoryMove(game.getCurrentPlayer());
            let currentBox = historyMove.filter(elem => (elem[0] === piece.getPower() && piece.getCoord().isEqual(elem[1])));
            let destinationBox = historyMove.filter(elem => (elem[0] === piece.getPower() && destinationCoord.isEqual(elem[1])));

            return (currentBox.length == 3 && destinationBox.length == 3) ? true : false;
        }
        function scoutMove(game, piece, x, y){
            let canMove = false;
            if(piece.getCoord().x == x || piece.getCoord().y == y){  
                if( !game.isObstacleOnTheWay(piece.getCoord(), new Coordinates(x,y))){
                    canMove = true;
                }
                if((game.scoutRule == false && 
                    (Math.abs(piece.getCoord().x-x)+Math.abs(piece.getCoord().y-y) != 1) && 
                    game.getBox(x, y).getOccupy() != 0)){
                        canMove = false;
                }
            }
            return canMove;
        }
        function pieceMove(piece,x,y){
            return (Math.abs(piece.getCoord().x-x)+Math.abs(piece.getCoord().y-y) == 1) ? true : false;
        }
        return {
            eventMove(game, piece, x, y){
                
                if(isMovable(piece) && isMovement(piece, x, y) && isMyPiece(game, piece) && 
                isAuthorizedMove(game.getBox(x, y), game.getCurrentPlayerName()) && 
                !isAlternation(game, piece, new Coordinates(x,y))){

                    let canMove = (piece.getPower() == 2) ? scoutMove(game, piece, x, y) : pieceMove(piece, x, y);

                    if(canMove){
                        game.addMove(piece, new Coordinates(x,y));
                        (game.isAttack(game.getCurrentPlayerName(),x,y)) ? attack.eventAttack(game, piece, game.getBox(x,y)) : game.move(piece,x,y);
                        game.play();
                    }
                }
            }
        }
    })();
