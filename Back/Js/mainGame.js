const Coordinates = require('./Classes/coordinates.js');
const Entity = require('./Classes/entity.js');
const Piece = require('./Classes/piece.js');
const GameGrid = require('./Classes/gamegrid.js');
const Game = require('./Classes/game.js');
const attack = require('./Modules/attack.js');
const move = require('./Modules/move.js');

module.exports = {
    /**
     * Trouver la partie d'un joueur
     * @param { String } playerId
     * @param { Array } allCurrentsGames
     * @return { Game }
     */
    researchGame(playerId, allCurrentsGames){
        let x = 0;

        while(!allCurrentsGames[x].getPlayers().some(elem => elem == playerId)){
            x++;
        }

        return allCurrentsGames[x];
    },

    /**
     * Recherche la room de la partie 
     * @param { Set } rooms 
     * @return { String }
     */
    researchRoom(rooms){
        let x = 0;
        let room = 'room';
    
        if(rooms.size != 1){
        while(!rooms.has(room+x)){
            x++;
        }
        }
        return room + x;
    },

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
            let min = Math.floor(time/60000) % 60;
            let hours = Math.floor((time - min)/60) % 24;
            let players = allCurrentsGames[x].getPlayers(); 
            
            table.push([getName(srvSockets, players[0]), getName(srvSockets, players[1]), hours+':'+min]);
        }
        return table;
    },

    researchRoomById(srvSockets, player){
        
        let x = 0;

        while(srvSockets[x].id != player){
            x++;
        }
        
        return srvSockets[x].rooms;
        /*srvSockets.forEach(user => {
            if(user == player){
                rooms = user.handshake.rooms;
            }
        });*/
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
     * Trouve le nom du joueur à partir de l'ID de sa session
     * @param { Map } srvSockets 
     * @param { String } playerId 
     * @return { String } 
     */
    getName(srvSockets, playerId){
        if(playerId == undefined) return 'mate';
        
        let name;
        srvSockets.forEach(user => {
            if(user.handshake.session.id == playerId){
                name = user.handshake.session.name;
            }
        });
        return name;
    },

    /**
     * Efface la partie un fois qu'elle est terminée
     * @param { Game } pobby 
     * @param { Array } allCurrentsGames 
     * @param { Map } srvSockets 
     */
    suppress(lobby,allCurrentsGames,srvSockets){
        
        srvSockets.forEach(user => {            // A modifier si spectateur
            if( lobby.getPlayers().some(id => id == user.handshake.session.id)){
                user.leave(researchRoom(user.rooms));
            }
        });

        allCurrentsGames.splice(allCurrentsGames.indexOf(lobby), 1);
    },
};