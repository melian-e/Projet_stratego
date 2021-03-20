const Game = require('./Classes/game.js');
const Room = require('./Classes/room.js');
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
        //console.log('wait',socket.handshake.session.wait);
        socket.handshake.session.wait = true;
        socket.handshake.session.revealedRule = revealedRule;
        socket.handshake.session.scoutRule = scoutRule;
        socket.handshake.session.bombRule = bombRule;

        let table = [];
        console.log("Quelqu'un s'est connecté, il y a maintenant",srvSockets.size,"personnes connectés");

        srvSockets.forEach(user => {		// Recherche des personnes en recherche d'une partie
            console.log('waiting:',user.handshake.session.wait);
            if(user.handshake.session.wait == true && user.handshake.session.revealedRule == revealedRule && user.handshake.session.scoutRule == scoutRule && user.handshake.session.bombRule == bombRule){ 
                console.log('waiting:',user.handshake.session.wait);
                table.push(user.handshake.session.id);
                console.log(table.length);
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
    newGame(table,srvSockets,allCurrentsGames,allRooms,...rules){
        console.log("Nouvelle partie");
        allCurrentsGames.push(new Game(table[0], table[1], rules[0],rules[1],rules[2])); // Ajout de la Lobbieie au tableau

        srvSockets.forEach(user => {
            if(table.some(id => id == user.handshake.session.id)) {
                console.log('new Game 1', user.handshake.session.wait);
                user.handshake.session.wait = false;
                console.log('new Game 2', user.handshake.session.wait);
                //console.log(user.handshake.session);
                /*user.join(room);		// Ajout des joueur à une nouvelle room
                user.join(user.handshake.session.id);*/                
            }
        });

        allRooms.push(new Room(table))
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
    suppress(lobby,allCurrentsGames,srvSockets, allRooms){
        
        let x = research.roomById(srvSockets, lobby.player1.id);
        
        /*srvSockets.forEach(user => {            // A modifier si spectateur
            /*if( user.rooms.has(rooms)){
                user.leave(rooms);
            }
        });*/
        allRooms.splice(x, 1);
        allCurrentsGames.splice(allCurrentsGames.indexOf(lobby), 1);
    },
};