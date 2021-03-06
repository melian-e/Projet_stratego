/**
 * Trouver la partie d'un joueur
 * @param { String } playerId
 * @param { Array } allCurrentsParts
 * @return { Game }
 */
function researchPart(playerId, allCurrentsParts){
    let x = 0;

    while(!allCurrentsParts[x].getPlayers().some(elem => elem == playerId)){
        x++;
    }

    return allCurrentsParts[x];
}

/**
 * Recherche la room de la partie 
 * @param { Set } rooms 
 * @return { String }
 */
function researchRoom(rooms){
	let x = 0;
	let room = 'room';
  
	if(rooms.size != 1){
	  while(!rooms.has(room+x)){
		x++;
	  }
	}
	return room + x;
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
    socket.handshake.wait = true;
    socket.handshake.revealedRule = revealedRule;
    socket.handshake.scoutRule = scoutRule;
    socket.handshake.bombRule = bombRule;

    let table = Array();
    console.log("Quelqu'un s'est connecté, il y a maintenant",srvSockets.size,"personnes connectés");

    srvSockets.forEach(user => {		// Recherche des personnes en recherche d'une partie
          if(user.handshake.wait == true && socket.handshake.revealedRule == revealedRule 
            && socket.handshake.scoutRule == scoutRule && socket.handshake.bombRule == bombRule){ 
                table.push(user.id);
        }
    });

    return table;
}

/**
 * Créer une nouvelle partie avec les 2 joueurs et les ajoute à une room
 * @param { Map } srvSockets 
 * @param { Array } allCurrentsParts 
 * @param { String } room 
 * @param { Object } socket 
 */
function newGame(srvSockets,allCurrentsParts,room,socket){
    console.log("Nouvelle partie");
    allCurrentsParts.push(new Game(table[0], table[1], socket.revealedRule,
        socket.scoutRule, socket.bombRule));    // Ajout de la partie au tableau

    srvSockets.forEach(user => {
        if(user.id == table[0] || user.id == table[1]) {
        user.handshake.wait = false;
        user.join(room);		// Ajout des joueur à une nouvelle room
        }
    });
}

/**
 * Ajoue des pions du joueur à la grid de jeu
 * @param { Array } table 
 * @param { String } playerId 
 * @param { Array } allCurrentsParts 
 */
function ready(table,playerId,allCurrentsParts){
    let part = researchPart(playerId,allCurrentsParts);
    part.superpose(table, playerId);
}

/**
 * Trouve le nom du joueur à partir de l'ID de sa session
 * @param { Map } srvSockets 
 * @param { String } playerId 
 * @return { String } 
 */
function getName(srvSockets, playerId){
    if(playerId == undefined) return 'mate';
    
    let name;
    srvSockets.forEach(user => {
        if(user.id == playerId){
            name = user.name;
        }
    });
    return name;
}

/**
 * Efface la partie un fois qu'elle est terminée
 * @param { Game } part 
 * @param { Array } allCurrentsParts 
 * @param { Map } srvSockets 
 */
function suppress(part,allCurrentsParts,srvSockets){
    
    srvSockets.forEach(user => {
        if( part.getPlayers().some(id => id == user.id)){
            user.leave(researchRoom(user.rooms));
        }
    });

    allCurrentsParts.splice(allCurrentsParts.indexOf(part), 1);
}
module.exports = {researchPart, researchRoom, waiting, newGame, ready, getName, suppress};