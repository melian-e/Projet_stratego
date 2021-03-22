const Game = require('./Classes/game.js');
const Room = require('./Classes/room.js');
const research = require('./research.js');

module.exports = {
    /**
     * Faire un tableau contenant le nom des joueurs et la duré de leur parti pour toutes les games en cours afin de les proproser à un spectateur
     * @param { Map } srvSockets 
     * @param { Array } allCurrentsGames 
     * @returns { Array }
     */
    currentGames(srvSockets, allCurrentsGames){
        let table = Array();
        for(let x = 0; x < allCurrentsGames.length; x++){
            let time = Date.now() - allCurrentsGames[x].startTime;
            let sec = Math.floor((time / 1000) % 60);
            let min = Math.floor(Math.floor(Math.floor(time/1000) / 60) % 60);
            let hours = Math.floor( Math.floor(time/1000) / 3600);
            let players = allCurrentsGames[x].getPlayers(); 
            
            table.push([research.getName(srvSockets, players[0].id), research.getName(srvSockets, players[1].id), hours+':'+min+':'+sec]);
        }
        return table;
    },

    /**
     * Ajout de variables à la session et recherche un partenaire de jeu
     * @param { Map } srvSockets 
     * @param { Object } socket 
     * @param { Boolean } revealedRule 
     * @param { Boolean } scoutRule 
     * @param { Boolean } bombRule 
     * @return { Array }
     */
    waiting(srvSockets,socket,revealedRule,scoutRule,bombRule){
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
    },

    /**
     * Créer une nouvelle partie avec les 2 joueurs et créé une nouvelle room pour la partie
     * @param { Array } table
     * @param { Array } allCurrentsGames 
     * @param { Array } allRooms
     * @param { Array } rules
     */
    newGame(table,allCurrentsGames,allRooms,...rules){
        console.log("Nouvelle partie");
        allCurrentsGames.push(new Game(table[0], table[1], rules[0],rules[1],rules[2]));
        allRooms.push(new Room(table));
    },

    /**
     * Ajoute les pions du joueur à la grid de jeu
     * @param { Array } table 
     * @param { String } playerId 
     * @param { Game } lobby
     */
    ready(table,playerId,lobby){
        if(lobby.getPlayers()[0] == playerId){
            table.reverse();
            table.forEach(elem => elem.reverse());
        }
        lobby.superpose(table, playerId);
    },
    /**
     * Efface la partie et la room uns fois terminée
     * @param { Game } lobby 
     * @param { Array } allCurrentsGames 
     * @param { Array } allRooms 
     */
    suppress(lobby,allCurrentsGames, allRooms){
        
        let x = research.roomById(lobby.player1.id, allRooms);
        
        allRooms.splice(x, 1);
        allCurrentsGames.splice(allCurrentsGames.indexOf(lobby), 1);
    },

    /**
     * Supprime une presonne d'une room et supprime si besoin une partie
     * @param { Array } allCurrentsGames 
     * @param { Array } allRooms 
     */
    quit(allCurrentsGames, allRooms){
        let x = research.roomById(socket.handshake.session.id, allRooms);
        
		if(x < allRooms.length){
            let lobby = research.gameByRoom(allRooms[x], allCurrentsGames);
            allRooms[x].leave(socket.handshake.session.id);

            if(allRooms[x].length == 0) functions.suppress(lobby, allCurrentsGames, allRooms);

		}
    }
};