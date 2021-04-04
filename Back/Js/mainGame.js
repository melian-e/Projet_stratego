const Coordinates = require('./Classes/coordinates.js');
const Game = require('./Classes/game.js');
const Room = require('./Classes/room.js');
const research = require('./research.js');

/**
 * Faire un tableau contenant le nom des joueurs et la duré de leur parti pour toutes les games encours (les pions déjà placés) afin de les proproser à un spectateur
 * @param { Map } srvSockets 
 * @param { Array } allCurrentsGames 
 * @returns { Array }
 */
function currentGames(srvSockets, allCurrentsGames){
    let table = Array();
    for(let x = 0; x < allCurrentsGames.length; x++){
        let time = Date.now() - allCurrentsGames[x].startTime;
        let sec = Math.floor((time / 1000) % 60);
        let min = Math.floor(Math.floor(Math.floor(time/1000) / 60) % 60);
        let hours = Math.floor( Math.floor(time/1000) / 3600);
        let players = allCurrentsGames[x].getPlayers(); 
        
        table.push([research.getName(srvSockets, players[0]), research.getName(srvSockets, players[1]), hours+':'+min+':'+sec]);
    }
    return table;
}

/**
 * Ajout de variables à la session et recherche un partenaire de jeu
 * @param { Map } srvSockets 
 * @param { Object } socket 
 * @param { Boolean } revealedRule 
 * @param { Boolean } scoutRule 
 * @param { Boolean } bombRule 
 * @return { Array }
 */
    function waiting(srvSockets,socket,revealedRule,scoutRule,bombRule){
    socket.handshake.session.wait = true;
    socket.handshake.session.revealedRule = revealedRule;
    socket.handshake.session.scoutRule = scoutRule;
    socket.handshake.session.bombRule = bombRule;
    

    let table = [];
    console.log("Quelqu'un s'est connecté, il y a maintenant",srvSockets.size,"personnes connectés");

    srvSockets.forEach(user => {		// Recherche des personnes en recherche d'une partie

        if(user.handshake.session.wait == true && user.handshake.session.revealedRule == revealedRule
                && user.handshake.session.scoutRule == scoutRule && user.handshake.session.bombRule == bombRule){ 
    
                table.push(user.handshake.session.id);
        }
    });

    return table;
}

/**
 * Créer une nouvelle partie avec les 2 joueurs et créé une nouvelle room pour la partie
 * @param { Array } table
 * @param { Array } allCurrentsGames 
 * @param { Array } allRooms
 * @param { Array } rules
 */
    function newGame(table,allCurrentsGames,allRooms,...rules){
    console.log("Nouvelle partie");
    allCurrentsGames.push(new Game(table[0], table[1], rules[0],rules[1],rules[2]));
    allRooms.push(new Room(table));
}

/**
 * Ajoute les pions du joueur à la grid de jeu
 * @param { Array } table 
 * @param { String } playerId 
 * @param { Game } lobby
 */
function ready(table,playerId,lobby){
    if(lobby.getPlayers()[0] == playerId){
        table.reverse();
        table.forEach(elem => elem.reverse());
    }
    lobby.superpose(table, playerId);
}

/**
 * Efface la partie et la room uns fois terminée
 * @param { Game } lobby 
 * @param { Array } allCurrentsGames 
 * @param { Array } allRooms 
 */
function suppress(lobby,allCurrentsGames, allRooms){
    
    let x = research.roomById(lobby.player1.id, allRooms);
    
    allRooms.splice(x, 1);
    allCurrentsGames.splice(allCurrentsGames.indexOf(lobby), 1);
}

/**
 * Supprime une presonne d'une room et supprime si besoin une partie
 * @param { Array } allCurrentsGames 
 * @param { Array } allRooms 
 * @param { Map } Socket
 */
function quit(allCurrentsGames, allRooms, socket){
    let x = research.roomById(socket.handshake.session.id, allRooms);
    
    if(x < allRooms.length){
        let lobby = research.gameByRoom(allRooms[x], allCurrentsGames);

        allRooms[x].leave(socket.handshake.session.id);

        if(lobby != undefined && !(lobby.getPlayers().some(player => allRooms[x].isPresent(player)))){
            suppress(lobby, allCurrentsGames, allRooms);
        }

        if(allRooms[x].people.length == 0){
            allRooms.splice(x,1);
        }
    }
}

/**
 * Recherche les cases sur lesquelles peut se déplacer le pion donné
 * @param { Game } lobby 
 * @param { int } numPiece 
* @returns { Array }
 */
function getCases(lobby, numPiece){
    let cases = Array();
    let xPiece = Math.floor(numPiece / 10);
    let yPiece = numPiece % 10;

    for(let x = -1; x < 2; x+=2){
        for(let y = -1; y < 2; y += 2){
            let i = (x < 0) ? xPiece + x*y : xPiece;
            let j = (x > 0) ? yPiece + x*y : yPiece;

            if(lobby.getBox(xPiece, yPiece).getPower() != 2) {
                if( i > -1 && j > -1 && i < 10 && j < 10 && canMove(lobby,xPiece,yPiece,i,j)){
                    (lobby.getBox(xPiece, yPiece).getOwner() == lobby.player1.id) ? cases.push([99 - numPiece, 99 - (i*10+j)]) : cases.push([numPiece, i*10+j]);
                }
            }

            else{
                let p = 1;
                
                while(i > -1 && j > -1 && i < 10 && j < 10 && scoutMove(lobby,xPiece,yPiece,i,j,p)){
                    (lobby.getBox(xPiece, yPiece).getOwner() == lobby.player1.id) ? cases.push([99 - numPiece, 99 - (i*10+j)]) : cases.push([numPiece, i*10+j]);
                    p++;
                    i = (x < 0) ? xPiece + x*y*p : xPiece;
                    j = (x > 0) ? yPiece + x*y*p : yPiece;
                }
            }
        }
    }
    return cases;
}

/**
 * Vérifie si le pion scout peut se déplacer sur la case
 * @param { Game } lobby
 * @param { int } x 
 * @param { int } y 
 * @param { int } i
 * @param { int } j
 * @param { int } p
 * @returns { boolean }
 */
function scoutMove(lobby,x,y,i,j,p){    
    let move = true;
    let ownerPiece = lobby.getBox(x,y).getOwner();
    
    if(lobby.getBox(i,j).getOccupy() == 1){
        let ownerMove = lobby.getBox(i,j).getOwner();
        move = ((ownerMove != ownerPiece) && (p == 1 || lobby.scoutRule)) ? true : false;
    }

    if(lobby.isObstacleOnTheWay(new Coordinates(x,y), new Coordinates(i,j))) move = false;

    return (!lobby.isAlternation(lobby.getBox(x,y),new Coordinates(i,j)) && move && lobby.getBox(i,j).getOccupy() != 2) ? true : false;
}

/**
 * Vérifie si le pion non scout peut se déplacer sur la case
 * @param { Game } lobby 
 * @param { int } x 
 * @param { int } y 
 * @param { int } i 
 * @param { int } j 
 * @returns { boolean }
 */
function canMove(lobby,x,y,i,j){
    
    let lake, ownerPiece, ownerMove;

    if(lobby.getBox(i,j).getOccupy() == 1){
        ownerPiece = lobby.getBox(x,y).getOwner();
        ownerMove = lobby.getBox(i,j).getOwner();
    }
    else{
        lake = (lobby.getBox(i,j).getOccupy() == 2) ? true : false; 
    }

    return (!lobby.isAlternation(lobby.getBox(x,y),new Coordinates(i,j)) && ((lobby.getBox(i,j).getOccupy() != 1 && !lake) || (ownerMove != ownerPiece))) ? true : false;
}

module.exports = {currentGames, waiting, newGame, ready, suppress, quit, getCases}