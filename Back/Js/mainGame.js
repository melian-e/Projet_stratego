/**
 * Trouver la Lobbyie d'un joueur
 * @param { String } playerId
 * @param { Array } allCurrentsGames
 * @return { Game }
 */
function researchGame(playerId, allCurrentsGames){
    let x = 0;

    while(!allCurrentsGames[x].getPlayers().some(elem => elem == playerId)){
        x++;
    }

    return allCurrentsGames[x];
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
                table.push(user.handshake.id);
        }
    });

    return table;
}

/**
 * Créer une nouvelle partie avec les 2 joueurs et les ajoute à une room
 * @param { Map } srvSockets 
 * @param { Array } allCurrentsGames 
 * @param { String } room 
 * @param { Object } socket 
 */
function newGame(srvSockets,allCurrentsGames,room,socket){
    console.log("Nouvelle partie");
    allCurrentsGames.push(new Game(table[0], table[1], socket.handshake.revealedRule,
        socket.handshake.scoutRule, socket.handshake.bombRule));    // Ajout de la Lobbieie au tableau

    srvSockets.forEach(user => {
        if(user.handshake.id == table[0] || user.handshake.id == table[1]) {
        user.handshake.wait = false;
        user.join(room);		// Ajout des joueur à une nouvelle room
        }
    });
}

/**
 * Ajoute les pions du joueur à la grid de jeu
 * @param { Array } table 
 * @param { String } playerId 
 * @param { Array } allCurrentsGames 
 */
function ready(table,playerId,allCurrentsGames){
    let Lobby = researchGame(playerId,allCurrentsGames);
    if(Lobby.getPlayers()[0] == playerId){
        table.reverse();
        table.forEach(elem => elem.reverse());
    }
    Lobby.superpose(table, playerId);
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
        if(user.handshake.id == playerId){
            name = user.handshake.name;
        }
    });
    return name;
}

/**
 * Efface la partie un fois qu'elle est terminée
 * @param { Game } pobby 
 * @param { Array } allCurrentsGames 
 * @param { Map } srvSockets 
 */
function suppress(Lobby,allCurrentsGames,srvSockets){
    
    srvSockets.forEach(user => {            // A modifier si spectateur
        if( Lobby.getPlayers().some(id => id == user.handshake.id)){
            user.leave(researchRoom(user.handshake.rooms));
        }
    });

    allCurrentsGames.splice(allCurrentsGames.indexOf(Lobby), 1);
}
module.exports = {researchGame, researchRoom, waiting, newGame, ready, getName, suppress};