let attack = (function(){
    
    function winnerAttack(attacker, attacked){
    
        if(attacker.getPower() == attacked.getPower()){ // pièces égales
            return undefined;
        }
    
        if(attacker.getPower() == 1 && attacked.getPower() == 10){ // espion attaque un maréchal
            return attacker;
        }
    
        if(attacked.getPower() == -1){       // attaque de bombe
            // A contre check
            return (attacker.getPower() == 3)? attacker : (game.bombRule == false) ? attacked : undefined;
        }
    
        return (attacker.getPower() > attacked.getPower()) ? attacker : attacked;
    }

    return{
        eventAttack(game, attacker, attacked){
            winner = winnerAttack(attacker, attacked);
            //attackAnimation(attacker, attacked, winner);
            if(winner == attacked){
                game.remove(attacker);
            }
            else if(winner == attacker){
                game.remove(attacked);
                game.move(piece,attacked.getCoord().x,attacked.getCoord().y);
            }
            else {
                game.remove(attacked);
                game.remove(attacker);
            }
        
        }
    }
})();