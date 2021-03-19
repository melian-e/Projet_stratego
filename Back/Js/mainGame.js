const Game = require('./Classes/game.js');
const research = require('./research.js');

module.exports = {
    /**
     * Faire un tableua contenant le nom des joueurs et la duré de leur parti pour toutes les game en cours afin de les proproser à un spectateur
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
            
            table.push([research.getName(srvSockets, players[0]), research.getName(srvSockets, players[1]), hours+':'+min+':'+sec]);
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

        let table = Array();
        console.log("Quelqu'un s'est connecté, il y a maintenant",srvSockets.size,"personnes connectés");

        srvSockets.forEach(user => {		// Recherche des personnes en recherche d'une partie
        //console.log(user.handshake.session);
            if(user.handshake.session.wait == true && socket.handshake.session.revealedRule == revealedRule 
                && socket.handshake.session.scoutRule == scoutRule && socket.handshake.session.bombRule == bombRule){ 
                    table.push(user.handshake.session.id);
            }
        });

        return table;
    },

    /**
     * Créer une nouvelle partie avec les 2 joueurs et les ajoutent à une room
     * @param { Array } table
     * @param { Map } srvSockets 
     * @param { Array } allCurrentsGames 
     * @param { String } room 
     * @param { Array } rules
     */
    newGame(table,srvSockets,allCurrentsGames,room,...rules){
        console.log("Nouvelle partie");
        allCurrentsGames.push(new Game(table[0], table[1], rules[0],rules[1],rules[2])); // Ajout de la Lobbieie au tableau

        srvSockets.forEach(user => {
            if(user.handshake.session.id == table[0] || user.handshake.session.id == table[1]) {
                user.handshake.session.wait = false;
                user.join(room);		// Ajout des joueur à une nouvelle room
                user.join(user.handshake.session.id);
                
            }
        });
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
     * Efface la partie un fois qu'elle est terminée
     * @param { Game } pobby 
     * @param { Array } allCurrentsGames 
     * @param { Map } srvSockets 
     */
    suppress(lobby,allCurrentsGames,srvSockets, rooms){
        
        srvSockets.forEach(user => {            // A modifier si spectateur
            if( user.rooms.has(rooms)){
                user.leave(rooms);
            }
        });

        allCurrentsGames.splice(allCurrentsGames.indexOf(lobby), 1);
    },
};